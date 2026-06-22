import "./index.css";
import { getLessonByPath, lessonCards } from "./features/lessons/lessonRegistry";
import type { LessonCardEntry } from "./features/lessons/types";
import { useRoute } from "./useRoute";

const outcomes = [
  { value: "Free", label: "for learners" },
  { value: "3", label: "learning modes" },
  { value: "DSA", label: "practice path" },
];

const learningFlow = [
  {
    step: "Read",
    title: "Start with the idea",
    body: "Each lesson explains the mental model, the useful invariants, and the small details that make an algorithm click.",
  },
  {
    step: "Code",
    title: "Practice beside the explanation",
    body: "Editable examples let learners change the code, reset it, and try the pattern while the concept is still fresh.",
  },
  {
    step: "See",
    title: "Watch the state change",
    body: "Visualizers make pointers, queues, swaps, and visited sets visible so learners can connect code to behavior.",
  },
];

const features = [
  "Free access for learners",
  "Local progress that stays on the device",
  "JS and TS examples with resettable templates",
  "Responsive study mode for desktop and mobile",
];

function LessonCard({ lesson }: { lesson: LessonCardEntry }) {
  const inner = (
    <>
      <div className="lcard-header">
        <span className="lcard-module">{lesson.module}</span>
        <span className="lcard-number">#{lesson.number}</span>
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

/* ------------------------------------------------------------------ */
/*  Landing page                                                       */
/* ------------------------------------------------------------------ */

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
            <a href="#flow">Flow</a>
            <a href="#modules">Modules</a>
            <a href="#free">Free</a>
          </div>
          <a className="nav-action" href="#modules">Browse lessons</a>
        </nav>

        <div className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Free interactive DSA learning</p>
            <h1 id="hero-title">Learn algorithms by reading, coding, and seeing them run.</h1>
            <p className="hero-lede">
              A focused learning workspace for students and self-taught engineers who want to understand data structures and algorithms by doing.
            </p>
            <div className="hero-actions" aria-label="Primary page links">
              <a className="button primary" href="#modules">Start learning</a>
              <a className="button secondary" href="#flow">See how it works</a>
            </div>
            <dl className="outcome-strip" aria-label="Platform highlights">
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
              <strong>Two Pointer Search</strong>
            </div>
            <div className="preview-layout">
              <section className="lesson-notes" aria-label="Lesson notes preview">
                <p className="section-label">Concept</p>
                <h2>Remove impossible pairs with each comparison.</h2>
                <p>Move the left pointer when the sum is too small. Move the right pointer when it is too large.</p>
                <ul>
                  <li>Sorted input</li>
                  <li>Linear traversal</li>
                  <li>Pointer invariants</li>
                </ul>
              </section>
              <section className="code-window" aria-label="Code preview">
                <span>function hasPair(values, target) {`{`}</span>
                <span>  let left = 0;</span>
                <span>  let right = values.length - 1;</span>
                <span className="active-line">  while (left &lt; right) {`{`}</span>
                <span>    const sum = values[left] + values[right];</span>
                <span>  {`}`}</span>
                <span>{`}`}</span>
              </section>
              <section className="visualizer" aria-label="Visualizer preview">
                {[1, 3, 4, 7, 9, 12].map((value, index) => (
                  <div className={index === 1 || index === 4 ? "node active" : "node"} key={value}>
                    {value}
                  </div>
                ))}
              </section>
            </div>
          </aside>
        </div>
      </section>

      <section className="logo-band" aria-label="Audience groups">
        <span>CS students</span>
        <span>Self-taught engineers</span>
        <span>Interview practice</span>
        <span>Classroom-friendly</span>
      </section>

      <section className="section-shell" id="flow" aria-labelledby="flow-title">
        <div className="section-heading">
          <p className="eyebrow">The lesson loop</p>
          <h2 id="flow-title">One place to read, practice, and visualize.</h2>
          <p>No switching between notes, editors, and animation tools. LearnByDoing keeps the explanation, sandbox, and visualizer together.</p>
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

      <section className="section-shell" id="modules" aria-labelledby="modules-title">
        <div className="section-heading">
          <p className="eyebrow">Current curriculum</p>
          <h2 id="modules-title">DSA foundations, one concept at a time.</h2>
          <p>Start with common algorithm patterns and build understanding through short lessons, editable code, and visual feedback.</p>
        </div>
        <div className="lessons-grid" aria-label="Available lessons">
          {lessonCards.map((lesson) => (
            <LessonCard key={lesson.slug} lesson={lesson} />
          ))}
        </div>
      </section>

      <section className="section-shell split-section" aria-labelledby="platform-title">
        <div className="section-heading align-left">
          <p className="eyebrow">Learning space</p>
          <h2 id="platform-title">Built for steady practice.</h2>
          <p>Fast, calm, and focused enough for daily study, with lessons that stay close to the code and the visual state learners need to reason about.</p>
        </div>
        <div className="feature-list">
          {features.map((feature) => (
            <div className="feature-row" key={feature}>
              <span aria-hidden="true">+</span>
              <p>{feature}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section" id="free" aria-labelledby="free-title">
        <div>
          <p className="eyebrow">Always free</p>
          <h2 id="free-title">Open learning for anyone practicing DSA.</h2>
          <p>No payment or account required. Pick a topic, study the idea, edit the code, and watch the algorithm move.</p>
        </div>
        <a className="button primary" href="#modules">Choose a module</a>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Router wrapper                                                     */
/* ------------------------------------------------------------------ */

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

