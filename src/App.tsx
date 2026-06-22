import "./index.css";

const outcomes = [
  { value: "3", label: "learning modes" },
  { value: "42", label: "planned DSA labs" },
  { value: "60%+", label: "completion target" },
];

const learningFlow = [
  {
    step: "Read",
    title: "Dense concepts, made scannable",
    body: "Every lesson opens with crisp mental models, interview framing, and the exact invariants learners need to keep in view.",
  },
  {
    step: "Code",
    title: "Edit the algorithm in place",
    body: "A focused sandbox keeps examples live, recoverable, and close to the explanation so practice starts immediately.",
  },
  {
    step: "See",
    title: "Watch state move step by step",
    body: "Visualizers sync pointers, queues, swaps, and visited sets with code so invisible algorithm state becomes obvious.",
  },
];

const modules = ["Arrays", "Sorting", "Graphs", "Trees", "Dynamic programming", "Interview drills"];

const features = [
  "Reusable lesson engine for new topic packs",
  "Local progress that survives every practice session",
  "JS and TS first examples with resettable templates",
  "Responsive study mode for desktop and mobile",
];

export function App() {
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
            <a href="#pricing">Access</a>
          </div>
          <a className="nav-action" href="#pricing">Start learning</a>
        </nav>

        <div className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Interactive DSA mastery</p>
            <h1 id="hero-title">Learn algorithms by reading, coding, and seeing them run.</h1>
            <p className="hero-lede">
              A premium learning workspace for students, self-taught engineers, and interview prep cohorts who need more than static notes.
            </p>
            <div className="hero-actions" aria-label="Primary calls to action">
              <a className="button primary" href="#pricing">Get early access</a>
              <a className="button secondary" href="#flow">Explore the method</a>
            </div>
            <dl className="outcome-strip" aria-label="Platform outcomes">
              {outcomes.map((outcome) => (
                <div key={outcome.label}>
                  <dt>{outcome.value}</dt>
                  <dd>{outcome.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="product-preview" aria-label="LearnByDoing product preview">
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
        <span>Built for CS students</span>
        <span>Self-taught engineers</span>
        <span>Interview cohorts</span>
        <span>Teaching teams</span>
      </section>

      <section className="section-shell" id="flow" aria-labelledby="flow-title">
        <div className="section-heading">
          <p className="eyebrow">The lesson loop</p>
          <h2 id="flow-title">One workspace for the full learning motion.</h2>
          <p>No context switching between docs, editors, and animation tools. LearnByDoing keeps the explanation, sandbox, and visualization in sync.</p>
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

      <section className="module-band" id="modules" aria-labelledby="modules-title">
        <div>
          <p className="eyebrow">Launch curriculum</p>
          <h2 id="modules-title">DSA foundations with room to grow.</h2>
          <p>The first release proves the core lesson engine with algorithm topics learners actually need. The same system can power new engineering domains later.</p>
        </div>
        <div className="module-list" aria-label="Available modules">
          {modules.map((module) => <span key={module}>{module}</span>)}
        </div>
      </section>

      <section className="section-shell split-section" aria-labelledby="platform-title">
        <div className="section-heading align-left">
          <p className="eyebrow">Platform quality</p>
          <h2 id="platform-title">Designed like a serious study tool, not a toy demo.</h2>
          <p>Fast, calm, and focused enough for daily practice, with the structure maintainers need to add lessons without rebuilding the shell.</p>
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

      <section className="cta-section" id="pricing" aria-labelledby="cta-title">
        <div>
          <p className="eyebrow">Early access</p>
          <h2 id="cta-title">Start with the DSA lab. Expand into a full engineering academy.</h2>
          <p>Get the premium landing experience ready for product validation, waitlist collection, and investor demos.</p>
        </div>
        <a className="button primary" href="mailto:hello@learnbydoing.dev">Request access</a>
      </section>
    </main>
  );
}

export default App;


