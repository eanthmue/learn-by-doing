import { LessonPage } from "../../LessonPage";
import { parseLessonMarkdown } from "../../markdown/parseLessonMarkdown";
import type { TraceLessonDefinition, VisualizerStep } from "../../types";
import { SlidingWindowWordFrequencyVisualizer } from "./SlidingWindowWordFrequencyVisualizer";
import slidingWindowWordFrequencyMarkdown from "./slidingWindowWordFrequency.md" with { type: "text" };

export interface WordBundleExample {
  stream: string;
  bundle: string[];
}

const exampleInput: WordBundleExample = {
  stream: "paylogadmseelogadmpay",
  bundle: ["pay", "log", "adm"],
};

const traceCode = `function findRiskBundles(stream, bundle) {
  if (bundle.length === 0) {
    return [];
  }
  const wordLength = bundle[0].length;
  const bundleSize = bundle.length;
  const required = new Map();
  for (const word of bundle) {
    required.set(word, (required.get(word) ?? 0) + 1);
  }
  const starts = [];
  for (let offset = 0; offset < wordLength; offset++) {
    let left = offset;
    let matchedWords = 0;
    const window = new Map();
    for (let right = offset; right + wordLength <= stream.length; right += wordLength) {
      const word = stream.slice(right, right + wordLength);
      if (!required.has(word)) {
        window.clear();
        matchedWords = 0;
        left = right + wordLength;
        continue;
      }
      window.set(word, (window.get(word) ?? 0) + 1);
      matchedWords += 1;
      while ((window.get(word) ?? 0) > (required.get(word) ?? 0)) {
        const leftWord = stream.slice(left, left + wordLength);
        window.set(leftWord, (window.get(leftWord) ?? 0) - 1);
        matchedWords -= 1;
        left += wordLength;
      }
      if (matchedWords === bundleSize) {
        starts.push(left);
        const leftWord = stream.slice(left, left + wordLength);
        window.set(leftWord, (window.get(leftWord) ?? 0) - 1);
        matchedWords -= 1;
        left += wordLength;
      }
    }
  }
  return starts;
}`;

const starterCode = `function findRiskBundles(stream, bundle) {
  if (bundle.length === 0) {
    return [];
  }

  const wordLength = bundle[0].length;
  const bundleSize = bundle.length;
  const required = new Map();

  for (const word of bundle) {
    required.set(word, (required.get(word) ?? 0) + 1);
  }

  const starts = [];

  for (let offset = 0; offset < wordLength; offset++) {
    let left = offset;
    let matchedWords = 0;
    const window = new Map();

    for (let right = offset; right + wordLength <= stream.length; right += wordLength) {
      const word = stream.slice(right, right + wordLength);

      if (!required.has(word)) {
        window.clear();
        matchedWords = 0;
        left = right + wordLength;
        continue;
      }

      window.set(word, (window.get(word) ?? 0) + 1);
      matchedWords += 1;

      while ((window.get(word) ?? 0) > (required.get(word) ?? 0)) {
        const leftWord = stream.slice(left, left + wordLength);
        window.set(leftWord, (window.get(leftWord) ?? 0) - 1);
        matchedWords -= 1;
        left += wordLength;
      }

      if (matchedWords === bundleSize) {
        starts.push(left);
        const leftWord = stream.slice(left, left + wordLength);
        window.set(leftWord, (window.get(leftWord) ?? 0) - 1);
        matchedWords -= 1;
        left += wordLength;
      }
    }
  }

  return starts;
}

// Try it out
console.log(findRiskBundles("paylogadmseelogadmpay", ["pay", "log", "adm"]));
console.log(findRiskBundles("logpaypayadm", ["pay", "pay", "log"]));
console.log(findRiskBundles("payseelogadm", ["pay", "log", "adm"]));`;

const content = parseLessonMarkdown(slidingWindowWordFrequencyMarkdown);

type Chunk = {
  index: number;
  start: number;
  value: string;
};

function addCount(counts: Map<string, number>, word: string) {
  counts.set(word, (counts.get(word) ?? 0) + 1);
}

function subtractCount(counts: Map<string, number>, word: string) {
  const nextCount = (counts.get(word) ?? 0) - 1;
  if (nextCount <= 0) {
    counts.delete(word);
    return;
  }
  counts.set(word, nextCount);
}

function mapToRecord(counts: Map<string, number>): Record<string, number> {
  return Object.fromEntries(Array.from(counts.entries()).filter(([, count]) => count > 0));
}

function formatCounts(counts: Map<string, number>) {
  const entries = Array.from(counts.entries()).filter(([, count]) => count > 0);
  if (entries.length === 0) {
    return "empty";
  }
  return entries.map(([word, count]) => `${word}:${count}`).join(", ");
}

function tokenizeOffset(stream: string, wordLength: number, offset: number): Chunk[] {
  const chunks: Chunk[] = [];
  for (let start = offset; start + wordLength <= stream.length; start += wordLength) {
    chunks.push({
      index: chunks.length,
      start,
      value: stream.slice(start, start + wordLength),
    });
  }
  return chunks;
}

function createStep(params: {
  activeIndex: number | null;
  total: number;
  description: string;
  codeLine: number;
  stream: string;
  wordLength: number;
  required: Map<string, number>;
  window: Map<string, number>;
  offset: number;
  leftStart: number;
  rightStart: number;
  matchedStarts: number[];
  activeStart?: number | null;
  enteringStart?: number | null;
  leavingStart?: number | null;
  variables?: Record<string, string | number | boolean | null>;
}): VisualizerStep {
  return {
    activeIndex: params.activeIndex,
    total: params.total,
    description: params.description,
    codeLine: params.codeLine,
    variables: {
      offset: params.offset,
      left: params.leftStart,
      matchedWords: params.total,
      window: formatCounts(params.window),
      starts: params.matchedStarts.length > 0 ? params.matchedStarts.join(", ") : "none",
      ...params.variables,
    },
    wordWindow: {
      chunks: tokenizeOffset(params.stream, params.wordLength, params.offset),
      requiredCounts: mapToRecord(params.required),
      windowCounts: mapToRecord(params.window),
      offset: params.offset,
      wordLength: params.wordLength,
      leftStart: params.leftStart,
      rightStart: params.rightStart,
      matchedStarts: params.matchedStarts,
      activeStart: params.activeStart,
      enteringStart: params.enteringStart,
      leavingStart: params.leavingStart,
    },
  };
}

export function buildSlidingWindowWordFrequencySteps(example: WordBundleExample): VisualizerStep[] {
  const { stream, bundle } = example;
  const firstWord = bundle[0];

  if (!firstWord || bundle.some((word) => word.length !== firstWord.length)) {
    return [
      {
        activeIndex: null,
        total: 0,
        description: "The scanner needs at least one event code, and every event code must have the same width.",
        codeLine: 2,
        variables: {
          result: "[]",
        },
      },
    ];
  }

  const wordLength = firstWord.length;
  const required = new Map<string, number>();
  for (const word of bundle) {
    addCount(required, word);
  }

  const steps: VisualizerStep[] = [
    createStep({
      activeIndex: null,
      total: 0,
      description: `Build the required checklist: ${formatCounts(required)}.`,
      codeLine: 7,
      stream,
      wordLength,
      required,
      window: new Map<string, number>(),
      offset: 0,
      leftStart: 0,
      rightStart: -1,
      matchedStarts: [],
      variables: {
        required: formatCounts(required),
      },
    }),
  ];

  const matchedStarts: number[] = [];

  for (let offset = 0; offset < wordLength; offset += 1) {
    let left = offset;
    let matchedWords = 0;
    const window = new Map<string, number>();

    steps.push(createStep({
      activeIndex: null,
      total: matchedWords,
      description: `Start scanning alignment ${offset}. Every chunk in this pass begins at index ${offset} plus a multiple of ${wordLength}.`,
      codeLine: 12,
      stream,
      wordLength,
      required,
      window,
      offset,
      leftStart: left,
      rightStart: offset - wordLength,
      matchedStarts: [...matchedStarts],
    }));

    for (let right = offset; right + wordLength <= stream.length; right += wordLength) {
      const word = stream.slice(right, right + wordLength);

      if (!required.has(word)) {
        window.clear();
        matchedWords = 0;
        left = right + wordLength;
        steps.push(createStep({
          activeIndex: right,
          total: matchedWords,
          description: `${word} is not on the suspicious checklist, so the current window is cleared and the left edge moves after it.`,
          codeLine: 18,
          stream,
          wordLength,
          required,
          window,
          offset,
          leftStart: left,
          rightStart: right,
          matchedStarts: [...matchedStarts],
          activeStart: right,
          enteringStart: right,
          variables: {
            word,
          },
        }));
        continue;
      }

      addCount(window, word);
      matchedWords += 1;
      steps.push(createStep({
        activeIndex: right,
        total: matchedWords,
        description: `${word} enters the window. The scanner now has ${formatCounts(window)} in the current block.`,
        codeLine: 24,
        stream,
        wordLength,
        required,
        window,
        offset,
        leftStart: left,
        rightStart: right,
        matchedStarts: [...matchedStarts],
        activeStart: right,
        enteringStart: right,
        variables: {
          word,
        },
      }));

      while ((window.get(word) ?? 0) > (required.get(word) ?? 0)) {
        const leftWord = stream.slice(left, left + wordLength);
        const leavingStart = left;
        subtractCount(window, leftWord);
        matchedWords -= 1;
        left += wordLength;

        steps.push(createStep({
          activeIndex: leavingStart,
          total: matchedWords,
          description: `There are too many ${word} codes, so ${leftWord} leaves from the left until the counts are valid again.`,
          codeLine: 26,
          stream,
          wordLength,
          required,
          window,
          offset,
          leftStart: left,
          rightStart: right,
          matchedStarts: [...matchedStarts],
          activeStart: leavingStart,
          leavingStart,
          variables: {
            word,
            leftWord,
          },
        }));
      }

      if (matchedWords === bundle.length) {
        matchedStarts.push(left);
        steps.push(createStep({
          activeIndex: left,
          total: matchedWords,
          description: `The window contains exactly the whole bundle, so index ${left} is recorded.`,
          codeLine: 33,
          stream,
          wordLength,
          required,
          window,
          offset,
          leftStart: left,
          rightStart: right,
          matchedStarts: [...matchedStarts],
          activeStart: left,
          variables: {
            recordedStart: left,
          },
        }));

        const leftWord = stream.slice(left, left + wordLength);
        const leavingStart = left;
        subtractCount(window, leftWord);
        matchedWords -= 1;
        left += wordLength;

        steps.push(createStep({
          activeIndex: leavingStart,
          total: matchedWords,
          description: `${leftWord} leaves so the scanner can keep moving and still find overlapping bundles.`,
          codeLine: 35,
          stream,
          wordLength,
          required,
          window,
          offset,
          leftStart: left,
          rightStart: right,
          matchedStarts: [...matchedStarts],
          activeStart: leavingStart,
          leavingStart,
          variables: {
            leftWord,
          },
        }));
      }
    }
  }

  steps.push(createStep({
    activeIndex: null,
    total: matchedStarts.length,
    description: `Done. Matching bundles start at indexes ${matchedStarts.join(", ")}.`,
    codeLine: 41,
    stream,
    wordLength,
    required,
    window: new Map<string, number>(),
    offset: 0,
    leftStart: 0,
    rightStart: -1,
    matchedStarts: [...matchedStarts],
    variables: {
      result: `[${matchedStarts.join(", ")}]`,
    },
  }));

  return steps;
}

export const slidingWindowWordFrequencyLesson: TraceLessonDefinition<WordBundleExample> = {
  slug: "sliding-window-word-frequency",
  title: "Sliding Window with Word Frequencies",
  stage: "Linear Data Structures",
  stageNumber: 2,
  module: "Arrays and Strings",
  moduleSlug: "arrays-and-strings",
  moduleOrder: 1,
  number: 6,
  lessonOrder: 4,
  description: "Scan a fixed-width event stream for a required bundle of words using window frequency counts.",
  tags: ["O(n)", "hash map", "substring"],
  available: true,
  routePath: "/lessons/sliding-window-word-frequency",
  traceCode,
  starterCode,
  exampleValues: exampleInput,
  content,
  buildSteps: buildSlidingWindowWordFrequencySteps,
  Visualizer: SlidingWindowWordFrequencyVisualizer,
  PageComponent: LessonPage,
};