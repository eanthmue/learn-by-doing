import "./index.css";
import { curriculumStages, type CurriculumModule, type CurriculumStage } from "./features/lessons/curriculum";
import { getLessonByPath, lessonCards } from "./features/lessons/lessonRegistry";
import type { LessonCardEntry } from "./features/lessons/types";
import { useRoute } from "./useRoute";

const lessonCardBySlug = new Map(lessonCards.map((lesson) => [lesson.slug, lesson]));
const availableLessonCount = lessonCards.filter((lesson) => lesson.available).length;
const moduleCount = curriculumStages.reduce((total, stage) => total + stage.modules.length, 0);

const outcomes = [
  { value: String(curriculumStages.length), label: "DSA stages" },
  { value: String(moduleCount), label: "topic modules" },
  { value: String(lessonCards.length), label: "planned lessons" },
];

const learningFlow = [
  {
    step: "Read",
    title: "Start with the idea",
    body: "Each lesson explains the mental model, invariant, and boundary cases before asking learners to edit code.",
  },
  {
    step: "Code",
    title: "Practice beside the explanation",
    body: "Runnable starter code stays next to the lesson so learners can change inputs while the concept is still fresh.",
  },
  {
    step: "See",
    title: "Watch state change",
    body: "Deterministic visualizers show indexes, stacks, queues, trees, graphs, and tables from explicit step data.",
  },
];

const practiceStrategy = [
  "Implement core structures from scratch once before leaning on built-ins.",
  "Name the pattern behind each problem instead of memorizing individual solutions.",
  "Trace a small input by hand before optimizing the implementation.",
  "Use complexity notes to connect each code path to time and space cost.",
];

function getCardForLesson(slug: string): LessonCardEntry {
  const card = lessonCardBySlug.get(slug);

  if (!card) {
    throw new Error(`Missing lesson card metadata for ${slug}`);
  }

  return card;
}

function LessonCard({ lesson }: { lesson: LessonCardEntry }) {
  const inner = (
    <>
      <div className="lcard-header">
        <span className="lcard-module">{lesson.module}</span>
        <span className="lcard-number">S{lesson.stageNumber}.{lesson.lessonOrder}</span>
      </div>
      <h3 className="lcard-title">{lesson.title}</h3>
      <p className="lcard-description">{lesson.description}</p>
      <div className="lcard-tags">
        {lesson.tags.map((tag) => (
          <span key={tag} className="lcard-tag">{tag}</span>
        ))}
      </div>
      <span className={`lcard-action ${lesson.available ? "" : "locked"}`}>
        {lesson.available ? "Start lesson ->" : "Coming soon"}
      </span>
    </>
  );

  if (lesson.available) {
    return (
      <a
        href={`#/lessons/${lesson.slug}`}
        className="lesson-card available"
        id={`lesson-${lesson.slug}`}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="lesson-card locked" id={`lesson-${lesson.slug}`}>
      {inner}
    </div>
  );
}

function CurriculumModuleGroup({ module }: { module: CurriculumModule }) {
  const lessons = module.lessons.map((lesson) => getCardForLesson(lesson.slug));
  const availableCount = lessons.filter((lesson) => lesson.available).length;

  return (
    <section className="module-group" id={`module-${module.slug}`} aria-labelledby={`module-title-${module.slug}`}>
      <div className="module-heading">
        <div>
          <span className="module-kicker">Module {module.order}</span>
          <h3 id={`module-title-${module.slug}`}>{module.title}</h3>
          <p>{module.summary}</p>
        </div>
        <span className="module-status">{availableCount}/{lessons.length} live</span>
      </div>
      <div className="lessons-grid" aria-label={`${module.title} lessons`}>
        {lessons.map((lesson) => (
          <LessonCard key={lesson.slug} lesson={lesson} />
        ))}
      </div>
    </section>
  );
}

function CurriculumStageSection({ stage }: { stage: CurriculumStage }) {
  const stageLessons = stage.modules.flatMap((module) => module.lessons.map((lesson) => getCardForLesson(lesson.slug)));
  const availableCount = stageLessons.filter((lesson) => lesson.available).length;

  return (
    <article className="curriculum-stage" id={`stage-${stage.slug}`} aria-labelledby={`stage-title-${stage.slug}`}>
      <header className="stage-heading">
        <div>
          <span className="stage-kicker">Stage {stage.number}</span>
          <h2 id={`stage-title-${stage.slug}`}>{stage.title}</h2>
          <p>{stage.summary}</p>
        </div>
        <span className="stage-status">{availableCount}/{stageLessons.length} lessons live</span>
      </header>
      <div className="module-stack">
        {stage.modules.map((module) => (
          <CurriculumModuleGroup key={module.slug} module={module} />
        ))}
      </div>
    </article>
  );
}

function LandingPage() {
  return (
    <main className="landing-page">
      <section className="hero-section" aria-labelledby="hero-title">
        <nav className="top-nav" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="LearnByDoing home">
            <span className="brand-mark">LB</span>
            <span>LearnByDoing</span>
          </a>
          <div className="nav-links" aria-label="Page sections">
            <a href="#flow">Loop</a>
            <a href="#path">Path</a>
            <a href="#practice">Practice</a>
          </div>
          <a className="nav-action" href="#path">Browse path</a>
        </nav>

        <div className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Free interactive DSA learning</p>
            <h1 id="hero-title">A structured DSA path for reading, coding, and seeing algorithms run.</h1>
            <p className="hero-lede">
              LearnByDoing now follows the full DSA roadmap: foundations, linear structures, sorting and hashing, trees and graphs, then advanced patterns.
            </p>
            <div className="hero-actions" aria-label="Primary page links">
              <a className="button primary" href="#path">Start the path</a>
              <a className="button secondary" href="#flow">See the lesson loop</a>
            </div>
            <dl className="outcome-strip" aria-label="Curriculum highlights">
              {outcomes.map((outcome) => (
                <div key={outcome.label}>
                  <dt>{outcome.value}</dt>
                  <dd>{outcome.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="product-preview" aria-label="LearnByDoing lesson preview">
            <div className="preview-toolbar">
              <span />
              <span />
              <span />
              <strong>Stage 2: Arrays and Strings</strong>
            </div>
            <div className="preview-layout">
              <section className="lesson-notes" aria-label="Lesson notes preview">
                <p className="section-label">Concept</p>
                <h2>Keep the lesson contract simple.</h2>
                <p>Text content, starter code, and visualizer steps stay separate so each concept can grow without tangling the engine.</p>
                <ul>
                  <li>Read the invariant</li>
                  <li>Edit runnable code</li>
                  <li>Trace explicit state</li>
                </ul>
              </section>
              <section className="code-window" aria-label="Code preview">
                <span>function rangeSum(prefix, left, right) {`{`}</span>
                <span className="active-line">  return prefix[right + 1] - prefix[left];</span>
                <span>{`}`}</span>
                <span />
                <span>const nums = [3, -2, 5, 1, 6];</span>
                <span>const prefix = buildPrefixSums(nums);</span>
              </section>
              <section className="visualizer" aria-label="Visualizer preview">
                {[0, 3, 1, 6, 7, 13].map((value, index) => (
                  <div className={index === 2 || index === 5 ? "node active" : "node"} key={`${value}-${index}`}>
                    {value}
                  </div>
                ))}
              </section>
            </div>
          </aside>
        </div>
      </section>

      <section className="logo-band" aria-label="Curriculum stages">
        {curriculumStages.map((stage) => (
          <a key={stage.slug} href={`#stage-${stage.slug}`}>Stage {stage.number}: {stage.title}</a>
        ))}
      </section>

      <section className="section-shell" id="flow" aria-labelledby="flow-title">
        <div className="section-heading">
          <p className="eyebrow">The lesson loop</p>
          <h2 id="flow-title">Each topic keeps reading, code, and visualization together.</h2>
          <p>The roadmap can be broad, but every individual lesson stays focused on one concept, one runnable starter, and one deterministic visual trace.</p>
        </div>
        <div className="flow-grid">
          {learningFlow.map((item) => (
            <article className="flow-card" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell curriculum-section" id="path" aria-labelledby="path-title">
        <div className="section-heading">
          <p className="eyebrow">DSA roadmap</p>
          <h2 id="path-title">Lessons follow the outline from foundations to advanced patterns.</h2>
          <p>{availableLessonCount} lessons are live now. The remaining cards show the planned sequence so the site navigation matches the curriculum path.</p>
        </div>
        <nav className="stage-pill-nav" aria-label="Curriculum stage shortcuts">
          {curriculumStages.map((stage) => (
            <a key={stage.slug} href={`#stage-${stage.slug}`}>Stage {stage.number}</a>
          ))}
        </nav>
        <div className="curriculum-stack">
          {curriculumStages.map((stage) => (
            <CurriculumStageSection key={stage.slug} stage={stage} />
          ))}
        </div>
      </section>

      <section className="section-shell split-section" id="practice" aria-labelledby="practice-title">
        <div className="section-heading align-left">
          <p className="eyebrow">Practice strategy</p>
          <h2 id="practice-title">Study patterns without turning the roadmap into memorization.</h2>
          <p>The outline is long on purpose, but the MVP keeps the learning loop steady: implement, trace, name the pattern, and explain the complexity.</p>
        </div>
        <div className="feature-list">
          {practiceStrategy.map((feature) => (
            <div className="feature-row" key={feature}>
              <span aria-hidden="true">+</span>
              <p>{feature}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section" aria-labelledby="free-title">
        <div>
          <p className="eyebrow">Always free</p>
          <h2 id="free-title">Pick the first live lesson and keep moving through the path.</h2>
          <p>No payment or account required. Start with arrays today, then the navigation already shows where the curriculum grows next.</p>
        </div>
        <a className="button primary" href="#lesson-array-traversal">Start arrays</a>
      </section>
    </main>
  );
}

export function App() {
  const route = useRoute();
  const lesson = getLessonByPath(route);

  if (lesson) {
    const LessonPage = lesson.PageComponent;
    return <LessonPage lesson={lesson} />;
  }

  return <LandingPage />;
}

export default App;