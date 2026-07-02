import type { AlgorithmLessonContent, LessonComplexity, LessonConceptSection, LessonContent, LessonMistake, LessonPracticeExample, RichText } from "../types";

type SectionMap = Partial<Record<LessonMarkdownSection, string[]>>;

type LessonMarkdownSection =
  | "Learning Goals"
  | "Concept"
  | "Complexity"
  | "Common Mistakes"
  | "Practice"
  | "Reflection";

const LESSON_SECTIONS = new Set<LessonMarkdownSection>([
  "Learning Goals",
  "Concept",
  "Complexity",
  "Common Mistakes",
  "Practice",
  "Reflection",
]);

function findLessonSection(value: string): LessonMarkdownSection | undefined {
  const normalized = value.toLowerCase().trim();
  return Array.from(LESSON_SECTIONS).find((s) => s.toLowerCase() === normalized);
}

function assertSection(lines: string[] | undefined, section: LessonMarkdownSection): string[] {
  if (!lines) {
    throw new Error(`Missing lesson Markdown section: ${section}`);
  }

  return lines;
}

function splitTopLevelSections(markdown: string): SectionMap {
  const sections: SectionMap = {};
  let currentSection: LessonMarkdownSection | null = null;

  markdown.replace(/\r\n/g, "\n").split("\n").forEach((line) => {
    const heading = line.match(/^#+\s+(.+)$/);

    if (heading) {
      const title = heading[1]?.trim() ?? "";
      const matchedSection = findLessonSection(title);

      if (matchedSection) {
        currentSection = matchedSection;
        sections[currentSection] = [];
        return;
      }

      if (line.match(/^#\s/)) {
        currentSection = null;
        return;
      }
    }

    if (currentSection) {
      sections[currentSection]?.push(line);
    }
  });

  return sections;
}

function parseInlineMarkdown(text: string): RichText {
  const segments: RichText = [];
  const inlinePattern = /(`[^`]+`|\*\*[^*]+\*\*|_[^_]+_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlinePattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith("`")) {
      segments.push({ code: token.slice(1, -1) });
    } else if (token.startsWith("**")) {
      segments.push({ strong: token.slice(2, -2) });
    } else {
      segments.push({ emphasis: token.slice(1, -1) });
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex));
  }

  return segments;
}

function parseLearningGoals(lines: string[]): string[] {
  return lines
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim());
}

function pushParagraph(section: LessonConceptSection, paragraphLines: string[]) {
  if (paragraphLines.length === 0) {
    return;
  }

  section.paragraphs.push(parseInlineMarkdown(paragraphLines.join(" ").trim()));
  paragraphLines.length = 0;
}

function parseConcept(lines: string[]): LessonConceptSection[] {
  const sections: LessonConceptSection[] = [];
  let current: LessonConceptSection = { paragraphs: [] };
  let paragraphLines: string[] = [];

  const finishSection = () => {
    pushParagraph(current, paragraphLines);

    if (current.paragraphs.length > 0 || current.showArrayDiagram || current.showGraphDiagram || current.pattern) {
      sections.push(current);
    }
  };

  for (let index = 0; index < lines.length; index += 1) {
    const rawLine = lines[index] ?? "";
    const line = rawLine.trim();

    if (line.match(/^#+\s+/)) {
      finishSection();
      current = { title: line.replace(/^#+\s+/, "").trim(), paragraphs: [] };
      paragraphLines = [];
      continue;
    }

    if (line === "::: array-diagram") {
      pushParagraph(current, paragraphLines);
      current.showArrayDiagram = true;

      while (index + 1 < lines.length && (lines[index + 1] ?? "").trim() !== ":::") {
        index += 1;
      }
      index += 1;
      finishSection();
      current = { paragraphs: [] };
      continue;
    }

    if (line === "::: graph-diagram") {
      pushParagraph(current, paragraphLines);
      current.showGraphDiagram = true;

      while (index + 1 < lines.length && (lines[index + 1] ?? "").trim() !== ":::") {
        index += 1;
      }
      index += 1;
      finishSection();
      current = { paragraphs: [] };
      continue;
    }

    if (line === "::: pattern") {
      const patternLines: string[] = [];
      pushParagraph(current, paragraphLines);

      while (index + 1 < lines.length && (lines[index + 1] ?? "").trim() !== ":::") {
        index += 1;
        patternLines.push(lines[index] ?? "");
      }

      current.pattern = patternLines.join("\n").trim();
      index += 1;
      continue;
    }

    if (line === "") {
      pushParagraph(current, paragraphLines);
      continue;
    }

    paragraphLines.push(line);
  }

  finishSection();

  return sections;
}

function parseTableCells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseComplexity(lines: string[]): LessonComplexity {
  const rows = lines
    .map((line) => line.trim())
    .filter((line) => line.startsWith("|") && !/^\|\s*-/.test(line))
    .map(parseTableCells)
    .filter((cells) => cells[0] !== "Metric");

  const time = rows.find((row) => row[0] === "Time");
  const space = rows.find((row) => row[0] === "Space");

  if (!time?.[1] || !time[2] || !space?.[1] || !space[2]) {
    throw new Error("Complexity section must include Time and Space rows with value and reason columns.");
  }

  return {
    time: time[1],
    timeReason: parseInlineMarkdown(time[2]),
    space: space[1],
    spaceReason: parseInlineMarkdown(space[2]),
  };
}

function readFencedCode(lines: string[], startIndex: number): { code: string; nextIndex: number } {
  let index = startIndex;

  while (index < lines.length && !(lines[index] ?? "").trim().startsWith("```")) {
    index += 1;
  }

  if (index >= lines.length) {
    throw new Error("Expected fenced code block.");
  }

  const codeLines: string[] = [];
  index += 1;

  while (index < lines.length && !(lines[index] ?? "").trim().startsWith("```")) {
    codeLines.push(lines[index] ?? "");
    index += 1;
  }

  if (index >= lines.length) {
    throw new Error("Unclosed fenced code block.");
  }

  return { code: codeLines.join("\n").trim(), nextIndex: index };
}

function parseCommonMistakes(lines: string[]): LessonMistake[] {
  const mistakes: LessonMistake[] = [];
  let index = 0;

  while (index < lines.length) {
    const titleLine = lines[index]?.trim() ?? "";

    if (!titleLine.match(/^#+\s+/)) {
      index += 1;
      continue;
    }

    const title = titleLine.replace(/^#+\s+/, "").trim();
    let badCode = "";
    let goodCode = "";
    index += 1;

    while (index < lines.length && !(lines[index] ?? "").trim().match(/^#+\s+/)) {
      const line = lines[index]?.trim() ?? "";

      if (line === "Bad:") {
        const result = readFencedCode(lines, index + 1);
        badCode = result.code;
        index = result.nextIndex;
      }

      if (line === "Good:") {
        const result = readFencedCode(lines, index + 1);
        goodCode = result.code;
        index = result.nextIndex;
      }

      index += 1;
    }

    if (!badCode || !goodCode) {
      throw new Error(`Common mistake "${title}" must include Bad and Good code blocks.`);
    }

    mistakes.push({ title, badCode, goodCode });
  }

  return mistakes;
}

function parseExamples(lines: string[]): LessonPracticeExample[] {
  return lines
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => {
      const example = line.slice(2).trim();
      const match = example.match(/^`(.+)`\s*->\s*`(.+)`$/);

      if (!match?.[1] || !match[2]) {
        throw new Error(`Invalid practice example: ${example}`);
      }

      return { input: match[1], output: match[2] };
    });
}

function parsePractice(lines: string[]): LessonContent["practice"] {
  const titleLine = lines.find((line) => line.trim().match(/^#+\s+/))?.trim();

  if (!titleLine) {
    throw new Error("Practice section must include a heading.");
  }

  const title = titleLine.replace(/^#+\s+/, "").trim();
  const titleIndex = lines.findIndex((line) => line.trim() === titleLine);
  const bodyLines = lines.slice(titleIndex + 1);
  const examplesLabelIndex = bodyLines.findIndex((line) => line.trim() === "Examples:");
  const descriptionLines = examplesLabelIndex >= 0 ? bodyLines.slice(0, examplesLabelIndex) : bodyLines;
  const exampleLines = examplesLabelIndex >= 0 ? bodyLines.slice(examplesLabelIndex + 1) : [];
  const description = descriptionLines.map((line) => line.trim()).filter(Boolean).join(" ");

  return {
    title,
    description: parseInlineMarkdown(description),
    examples: parseExamples(exampleLines),
  };
}

function parseReflection(lines: string[]): RichText {
  return parseInlineMarkdown(lines.map((line) => line.trim()).filter(Boolean).join(" "));
}

export function parseLessonMarkdown(markdown: string): AlgorithmLessonContent {
  const sections = splitTopLevelSections(markdown);

  return {
    learningGoals: parseLearningGoals(assertSection(sections["Learning Goals"], "Learning Goals")),
    conceptSections: parseConcept(assertSection(sections.Concept, "Concept")),
    complexity: parseComplexity(assertSection(sections.Complexity, "Complexity")),
    commonMistakes: parseCommonMistakes(assertSection(sections["Common Mistakes"], "Common Mistakes")),
    practice: parsePractice(assertSection(sections.Practice, "Practice")),
    reflectionPrompt: parseReflection(assertSection(sections.Reflection, "Reflection")),
  };
}
