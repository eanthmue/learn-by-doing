import { Fragment, useEffect, useMemo, useState, type ReactNode } from "react";
import type { LessonDefinition, LessonPageProps, RichText, TextSegment, VisualizerStep } from "./types";

type LessonTab = "explanation" | "practice";

function renderSegment(segment: TextSegment, index: number): ReactNode {
  if (typeof segment === "string") {
    return <Fragment key={index}>{segment}</Fragment>;
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

function isNumberArray(values: unknown): values is number[] {
  return Array.isArray(values) && values.every((value) => typeof value === "number");
}

function LessonNav<TExampleValues>({ lesson }: { lesson: LessonDefinition<TExampleValues> }) {
  const STAGE_SLUGS: Record<number, string> = {
    1: "foundations",
    2: "linear-data-structures",
    3: "sorting-searching-hashing",
    4: "non-linear-data-structures",
    5: "advanced-algorithmic-patterns",
  };

  return (
    <nav className="lesson-nav" aria-label="Lesson navigation">
      <a className="lesson-nav-brand" href="#/" aria-label="Back to home">
        <span className="brand-mark">LB</span>
        <span>LearnByDoing</span>
      </a>
      <div className="lesson-nav-trail">
        <a href="#/">Home</a>
        <span aria-hidden="true">&gt;</span>
        <a href={`#stage-${STAGE_SLUGS[lesson.stageNumber] || "foundations"}`}>{lesson.stage}</a>
        <span aria-hidden="true">&gt;</span>
        <a href={`#module-${lesson.moduleSlug}`}>{lesson.module}</a>
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

function decodeGraph(values: number[]) {
  const numNodes = values[0] ?? 0;
  const edges: [number, number][] = [];
  for (let i = 1; i + 1 < values.length; i += 2) {
    edges.push([values[i]!, values[i + 1]!]);
  }
  return { numNodes, edges };
}

function circleLayout(numNodes: number, cx: number, cy: number, radius: number) {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < numNodes; i++) {
    const angle = (2 * Math.PI * i) / numNodes - Math.PI / 2;
    positions.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return positions;
}

function GraphDiagram({ values }: { values: number[] }) {
  const { numNodes, edges } = decodeGraph(values);
  const svgSize = 220;
  const center = svgSize / 2;
  const radius = 80;
  const positions = circleLayout(numNodes, center, center, radius);

  return (
    <div className="concept-diagram graph-viz-diagram" aria-label="Graph diagram">
      <svg
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        width={svgSize}
        height={svgSize}
        className="graph-viz-svg"
      >
        {edges.map(([a, b], i) => {
          const pa = positions[a];
          const pb = positions[b];
          if (!pa || !pb) return null;
          return (
            <line
              key={`edge-${i}`}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              className="graph-viz-edge processed"
            />
          );
        })}
        {positions.map((pos, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={18}
              className="graph-viz-node touched"
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="graph-viz-node-label"
            >
              {i}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ConceptPanel<TExampleValues>({ lesson }: { lesson: LessonDefinition<TExampleValues> }) {
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
            {section.showArrayDiagram && isNumberArray(lesson.exampleValues) ? <ArrayDiagram values={lesson.exampleValues} /> : null}
            {section.showGraphDiagram && isNumberArray(lesson.exampleValues) ? <GraphDiagram values={lesson.exampleValues} /> : null}
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

function TraceCodePanel({ traceCode, traceStep }: { traceCode: string; traceStep: VisualizerStep | undefined }) {
  const traceVariables = traceStep?.variables ? Object.entries(traceStep.variables) : [];

  return (
    <div className="sandbox-panel" aria-label="Synchronized trace code">
      <div className="sandbox-toolbar">
        <span className="sandbox-title">Trace Code</span>
        <span className="sandbox-mode">Read-only</span>
      </div>
      {traceStep ? (
        <div className="trace-sync-panel" aria-label="Synchronized trace state">
          <div className="trace-sync-header">
            <span>Trace Sync</span>
            {traceStep.codeLine ? <code>line {traceStep.codeLine}</code> : null}
          </div>
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
      <div className="code-trace-container" tabIndex={0} aria-label="Read-only code matched to the visualizer">
        <div className="code-highlight-overlay code-trace-lines">
          {traceCode.split("\n").map((line, i) => {
            const isActive = traceStep?.codeLine === i + 1;
            return (
              <div className={`code-line ${isActive ? "code-line-active" : ""}`} aria-current={isActive ? "step" : undefined} key={i}>
                <span className="line-gutter">
                  {isActive && <span className="debug-arrow">&gt;</span>}
                  <span className="line-number">{i + 1}</span>
                </span>
                <span className="line-content">{line || " "}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function LessonPage<TExampleValues>({ lesson }: LessonPageProps<TExampleValues>) {
  const steps = useMemo(
    () => lesson.buildSteps(lesson.exampleValues),
    [lesson],
  );
  const Visualizer = lesson.Visualizer;
  const [activeTab, setActiveTab] = useState<LessonTab>("explanation");
  const [traceStepIndex, setTraceStepIndex] = useState(0);
  const currentTraceStep = steps[traceStepIndex] ?? steps[0];

  useEffect(() => {
    setTraceStepIndex(0);
  }, [steps]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="lesson-page">
      <a className="skip-link" href="#lesson-main">Skip to Lesson Content</a>
      <LessonNav lesson={lesson} />
      <nav className="lesson-tab-nav" aria-label="Lesson views" role="tablist">
        <button
          type="button"
          id="lesson-tab-explanation"
          role="tab"
          aria-selected={activeTab === "explanation"}
          aria-controls="lesson-explanation-panel"
          className={activeTab === "explanation" ? "active" : ""}
          onClick={() => setActiveTab("explanation")}
        >
          Explanation
        </button>
        <button
          type="button"
          id="lesson-tab-practice"
          role="tab"
          aria-selected={activeTab === "practice"}
          aria-controls="lesson-practice-panel"
          className={activeTab === "practice" ? "active" : ""}
          onClick={() => setActiveTab("practice")}
        >
          Code + Visualizer
        </button>
      </nav>
      <main className="lesson-layout" id="lesson-main">
        <section
          className={`lesson-tab-panel lesson-concept-top ${activeTab === "explanation" ? "active" : ""}`}
          id="lesson-explanation-panel"
          role="tabpanel"
          aria-labelledby="lesson-tab-explanation"
          hidden={activeTab !== "explanation"}
        >
          <ConceptPanel lesson={lesson} />
        </section>
        <section
          className={`lesson-tab-panel lesson-practice-panel ${activeTab === "practice" ? "active" : ""}`}
          id="lesson-practice-panel"
          role="tabpanel"
          aria-labelledby="lesson-tab-practice"
          hidden={activeTab !== "practice"}
        >
          <div className="lesson-workspace-split">
            <section id="lesson-code" className="lesson-workspace-section">
              <TraceCodePanel traceCode={lesson.traceCode} traceStep={currentTraceStep} />
            </section>
            <section id="lesson-visualizer" className="lesson-workspace-section">
              <Visualizer
                values={lesson.exampleValues}
                steps={steps}
                stepIndex={traceStepIndex}
                onStepIndexChange={setTraceStepIndex}
              />
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
