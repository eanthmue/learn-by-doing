import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { runUserCode } from "../sandbox/runUserCode";
import type { LessonDefinition, LessonPageProps, RichText, TextSegment, VisualizerStep } from "./types";

function renderSegment(segment: TextSegment, index: number): ReactNode {
  if (typeof segment === "string") {
    return segment;
  }

  if ("code" in segment) {
    return <code key={index}>{segment.code}</code>;
  }

  if ("strong" in segment) {
    return <strong key={index}>{segment.strong}</strong>;
  }

  return <em key={index}>{segment.emphasis}</em>;
}

function RichTextView({ content }: { content: RichText }) {
  return <>{content.map(renderSegment)}</>;
}

function formatTraceValue(value: string | number | boolean | null) {
  if (value === null) {
    return "null";
  }

  return String(value);
}

function LessonNav({ lesson }: { lesson: LessonDefinition }) {
  return (
    <nav className="lesson-nav" aria-label="Lesson navigation">
      <a className="lesson-nav-brand" href="#/" aria-label="Back to home">
        <span className="brand-mark">LB</span>
        <span>LearnByDoing</span>
      </a>
      <div className="lesson-nav-trail">
        <a href="#/">Home</a>
        <span aria-hidden="true">&gt;</span>
        <span>{lesson.stage}</span>
        <span aria-hidden="true">&gt;</span>
        <span>{lesson.module}</span>
        <span aria-hidden="true">&gt;</span>
        <span className="trail-current">{lesson.title}</span>
      </div>
    </nav>
  );
}

function ArrayDiagram({ values }: { values: number[] }) {
  return (
    <div className="concept-diagram" aria-label="Array index and value diagram">
      <div className="diagram-row">
        <span className="diagram-label">Index</span>
        {values.map((_, index) => (
          <span className="diagram-index" key={index}>{index}</span>
        ))}
      </div>
      <div className="diagram-row">
        <span className="diagram-label">Value</span>
        {values.map((value, index) => (
          <span className="diagram-value" key={index}>{value}</span>
        ))}
      </div>
    </div>
  );
}

function ConceptPanel({ lesson }: { lesson: LessonDefinition }) {
  const { content } = lesson;

  return (
    <article className="concept-panel">
      <header className="concept-header">
        <span className="lesson-badge">Stage {lesson.stageNumber} - Lesson {lesson.lessonOrder} - {lesson.module}</span>
        <h1>{lesson.title}</h1>
      </header>

      <section className="concept-goals" aria-labelledby="learning-goals-title">
        <h2 id="learning-goals-title">Learning Goals</h2>
        <ol>
          {content.learningGoals.map((goal) => (
            <li key={goal}>{goal}</li>
          ))}
        </ol>
      </section>

      <section className="concept-body" aria-labelledby="concept-title">
        <h2 id="concept-title">Concept</h2>
        {content.conceptSections.map((section, sectionIndex) => (
          <div key={section.title ?? sectionIndex}>
            {section.title ? <h3>{section.title}</h3> : null}
            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex}><RichTextView content={paragraph} /></p>
            ))}
            {section.showArrayDiagram ? <ArrayDiagram values={lesson.exampleValues} /> : null}
            {section.pattern ? (
              <div className="concept-pattern">
                <span className="pattern-label">The Pattern</span>
                <pre>{section.pattern}</pre>
              </div>
            ) : null}
          </div>
        ))}
      </section>

      <section className="concept-body" aria-labelledby="complexity-title">
        <h2 id="complexity-title">Complexity</h2>
        <table className="complexity-table">
          <thead>
            <tr><th>Metric</th><th>Value</th><th>Reason</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Time</td>
              <td><strong>{content.complexity.time}</strong></td>
              <td><RichTextView content={content.complexity.timeReason} /></td>
            </tr>
            <tr>
              <td>Space</td>
              <td><strong>{content.complexity.space}</strong></td>
              <td><RichTextView content={content.complexity.spaceReason} /></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="concept-body" aria-labelledby="mistakes-title">
        <h2 id="mistakes-title">Common Mistakes</h2>
        {content.commonMistakes.map((mistake) => (
          <div className="mistake-card" key={mistake.title}>
            <h4>{mistake.title}</h4>
            <div className="mistake-code bad">
              <span className="mistake-label bad">Bug</span>
              <code>{mistake.badCode}</code>
            </div>
            <div className="mistake-code good">
              <span className="mistake-label good">Correct</span>
              <code>{mistake.goodCode}</code>
            </div>
          </div>
        ))}
      </section>

      <section className="concept-body" aria-labelledby="practice-title">
        <h2 id="practice-title">Practice Task</h2>
        <div className="practice-card">
          <h4>{content.practice.title}</h4>
          <p><RichTextView content={content.practice.description} /></p>
          <div className="practice-examples">
            {content.practice.examples.map((example) => (
              <code key={`${example.input}-${example.output}`}>
                {example.input} -&gt; {example.output}
              </code>
            ))}
          </div>
        </div>
      </section>

      <section className="concept-body" aria-labelledby="reflection-title">
        <h2 id="reflection-title">Reflection Check</h2>
        <blockquote className="reflection-quote">
          <RichTextView content={content.reflectionPrompt} />
        </blockquote>
      </section>
    </article>
  );
}

function CodeSandbox({ starterCode, traceStep }: { starterCode: string; traceStep: VisualizerStep | undefined }) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setCode(starterCode);
    setOutput([]);
  }, [starterCode]);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput([]);

    const result = await runUserCode(code);
    if (result.error) {
      setOutput([`${result.timedOut ? "Timeout" : "Error"}: ${result.error}`]);
    } else {
      setOutput(result.logs);
    }

    setIsRunning(false);
  }, [code]);

  const resetCode = useCallback(() => {
    setCode(starterCode);
    setOutput([]);
  }, [starterCode]);

  const traceCodeLine = traceStep?.codeLine ? code.split("\n")[traceStep.codeLine - 1]?.trim() : undefined;
  const traceVariables = traceStep?.variables ? Object.entries(traceStep.variables) : [];

  return (
    <div className="sandbox-panel" aria-label="Code sandbox">
      <div className="sandbox-toolbar">
        <span className="sandbox-title">Code Sandbox</span>
        <div className="sandbox-actions">
          <button className="sandbox-btn reset" onClick={resetCode} aria-label="Reset code">
            Reset
          </button>
          <button
            className="sandbox-btn run"
            onClick={runCode}
            disabled={isRunning}
            aria-label="Run code"
          >
            {isRunning ? "Running…" : "Run"}
          </button>
        </div>
      </div>
      {traceStep ? (
        <div className="trace-sync-panel" aria-label="Synchronized trace state">
          <div className="trace-sync-header">
            <span>Trace Sync</span>
            {traceStep.codeLine ? <code>line {traceStep.codeLine}</code> : null}
          </div>
          {traceCodeLine ? <pre className="trace-code-line">{traceCodeLine}</pre> : null}
          <p>{traceStep.description}</p>
          {traceVariables.length > 0 ? (
            <dl className="trace-vars">
              {traceVariables.map(([name, value]) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd>{formatTraceValue(value)}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      ) : null}
      <div className="sandbox-output" aria-label="Console output" aria-live="polite">
        <span className="output-label">Console</span>
        {output.length > 0 ? (
          output.map((line, index) => <pre key={`${index}-${line}`}>{line}</pre>)
        ) : (
          <pre className="output-placeholder">Click “Run” to see output</pre>
        )}
      </div>
      <textarea
        className="sandbox-editor"
        name="lesson-code"
        autoComplete="off"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        spellCheck={false}
        aria-label="Edit code here"
      />
    </div>
  );
}

export function LessonPage({ lesson }: LessonPageProps) {
  const steps = useMemo(
    () => lesson.buildSteps(lesson.exampleValues),
    [lesson],
  );
  const Visualizer = lesson.Visualizer;
  const [traceStepIndex, setTraceStepIndex] = useState(0);
  const currentTraceStep = steps[traceStepIndex] ?? steps[0];

  useEffect(() => {
    setTraceStepIndex(0);
  }, [steps]);

  const scrollToLessonSection = useCallback((sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) {
      return;
    }

    const stickyOffset = window.matchMedia("(max-width: 980px)").matches ? 76 : 0;
    const top = Math.max(target.getBoundingClientRect().top + window.scrollY - stickyOffset, 0);
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="lesson-page">
      <a className="skip-link" href="#lesson-main">Skip to Lesson Content</a>
      <LessonNav lesson={lesson} />
      <nav className="lesson-jump-nav" aria-label="Lesson workspace sections">
        <button type="button" onClick={() => scrollToLessonSection("lesson-concept")}>Concept</button>
        <button type="button" onClick={() => scrollToLessonSection("lesson-visualizer")}>Visual</button>
        <button type="button" onClick={() => scrollToLessonSection("lesson-code")}>Code</button>
      </nav>
      <main className="lesson-layout" id="lesson-main">
        <div className="lesson-left" id="lesson-concept">
          <ConceptPanel lesson={lesson} />
        </div>
        <div className="lesson-right">
          <section id="lesson-visualizer" className="lesson-workspace-section">
            <Visualizer
              values={lesson.exampleValues}
              steps={steps}
              stepIndex={traceStepIndex}
              onStepIndexChange={setTraceStepIndex}
            />
          </section>
          <section id="lesson-code" className="lesson-workspace-section">
            <CodeSandbox starterCode={lesson.starterCode} traceStep={currentTraceStep} />
          </section>
        </div>
      </main>
    </div>
  );
}
