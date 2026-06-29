import { Suspense, useEffect } from "react";
import "./index.css";
import {
  LessonComponents,
  curriculumStages,
  getLessonSlugByPath,
  lessonCards,
  type LessonCardEntry,
} from "./features/lessons";
import { useRoute } from "./useRoute";

interface AvailableTrackEntry {
  slug: string;
  title: string;
  topic: string;
  summary: string;
  lessons: LessonCardEntry[];
}

const availableLessons = lessonCards.filter((lesson) => lesson.available);
const featuredLesson = availableLessons.find((lesson) => lesson.slug === "prefix-sums") ?? availableLessons[0];

const moduleMetadataBySlug = new Map(
  curriculumStages.flatMap((stage) =>
    stage.modules.map((module) => [
      module.slug,
      {
        stageTitle: stage.title,
        summary: module.summary,
        title: module.title,
      },
    ] as const),
  ),
);

const availableTracks = Array.from(
  availableLessons.reduce((groups, lesson) => {
    const moduleLessons = groups.get(lesson.moduleSlug) ?? [];
    moduleLessons.push(lesson);
    groups.set(lesson.moduleSlug, moduleLessons);
    return groups;
  }, new Map<string, LessonCardEntry[]>()),
).map(([moduleSlug, lessons]): AvailableTrackEntry => {
  const metadata = moduleMetadataBySlug.get(moduleSlug);
  const firstLesson = lessons[0];

  if (!firstLesson) {
    throw new Error(`Available track ${moduleSlug} has no lessons.`);
  }

  return {
    slug: moduleSlug,
    title: metadata?.title ?? firstLesson.module,
    topic: metadata?.stageTitle ?? firstLesson.stage,
    summary: metadata?.summary ?? `Hands-on lessons for ${firstLesson.module}.`,
    lessons,
  };
});

const topicFilters = ["All", ...availableTracks.map((track) => track.title)];

const lessonLoop = [
  {
    label: "Read",
    title: "Start with a concrete idea",
    body: "Every lesson opens like a technical article: one concept, a small example, and the why behind the pattern.",
  },
  {
    label: "Code",
    title: "Edit a runnable starter",
    body: "The code pane stays close to the explanation so learners can test the idea while it is still in working memory.",
  },
  {
    label: "Visualize",
    title: "Trace the moving parts",
    body: "Visualizers render from explicit lesson steps, keeping the state deterministic instead of guessing from arbitrary code.",
  },
];

function LessonBadges() {
  return (
    <div className="lesson-badges" aria-label="Lesson format">
      <span>Read</span>
      <span>Code</span>
      <span>Visualize</span>
    </div>
  );
}

function LessonArticleCard({ lesson }: { lesson: LessonCardEntry }) {
  return (
    <a className="article-card linked" href={`#/lessons/${lesson.slug}`}>
      <div className="article-card-meta">
        <span>{lesson.module}</span>
        <LessonBadges />
      </div>
      <h3>{lesson.title}</h3>
      <p>{lesson.description}</p>
      <div className="article-tags">
        {lesson.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </a>
  );
}

function FeaturedLessonCard({ lesson }: { lesson: LessonCardEntry }) {
  return (
    <a className="featured-lesson-card" href={`#/lessons/${lesson.slug}`}>
      <span className="featured-kicker">Start here</span>
      <h3>{lesson.title}</h3>
      <p>{lesson.description}</p>
      <div className="featured-footer">
        <span>{lesson.module}</span>
        <LessonBadges />
      </div>
    </a>
  );
}

function TrackCard({ track }: { track: AvailableTrackEntry }) {
  return (
    <article className="track-card" id={`track-${track.slug}`}>
      <span className="track-topic">{track.topic}</span>
      <h3>{track.title}</h3>
      <p>{track.summary}</p>
      <ul>
        {track.lessons.map((lesson) => (
          <li key={lesson.slug}>
            <a href={`#/lessons/${lesson.slug}`}>{lesson.title}</a>
          </li>
        ))}
      </ul>
    </article>
  );
}

function LandingPage() {
  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      return undefined;
    }

    const id = hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to Main Content</a>
      <main className="landing-page technical-home" id="main-content">
        <section className="hero-section technical-hero" aria-labelledby="hero-title">
          <nav className="top-nav technical-nav" aria-label="Main navigation">
            <a className="brand" href="#top" aria-label="LearnByDoing home">
              <span className="brand-mark">LB</span>
              <span>LearnByDoing</span>
            </a>
            <div className="nav-links" aria-label="Page sections">
              <a href="#lessons">Lessons</a>
              <a href="#tracks">Tracks</a>
              <a href="#topics">Topics</a>
            </div>
            <a className="nav-action" href="#lessons">Browse Lessons</a>
          </nav>

          <div className="technical-hero-layout" id="top">
            <div className="hero-copy technical-hero-copy">
              <p className="eyebrow">Interactive technical lessons</p>
              <h1 id="hero-title">Technical lessons you can run.</h1>
              <p className="hero-lede">
                Browse the lessons that are ready today, then open each one as a focused lab with editable code and a synchronized visual trace.
              </p>
              <div className="topic-filter-row" aria-label="Available lesson topics">
                {topicFilters.map((topic) => (
                  <a key={topic} href={topic === "All" ? "#lessons" : "#topics"}>{topic}</a>
                ))}
              </div>
            </div>

            {featuredLesson ? <FeaturedLessonCard lesson={featuredLesson} /> : null}
          </div>
        </section>

        <section className="section-shell technical-loop-section" aria-labelledby="loop-title">
          <div className="section-heading align-left">
            <p className="eyebrow">One lesson shape</p>
            <h2 id="loop-title">Every available lesson follows the same read, code, visualize loop.</h2>
            <p>
              The catalog can grow into more engineering topics later without changing the core lesson contract or showing unfinished work early.
            </p>
          </div>
          <div className="flow-grid technical-flow-grid">
            {lessonLoop.map((item) => (
              <article className="flow-card" key={item.label}>
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell lesson-publication-section" id="lessons" aria-labelledby="lessons-title">
          <div className="publication-layout">
            <div className="section-heading align-left">
              <p className="eyebrow">Available lessons</p>
              <h2 id="lessons-title">Browse real lessons like articles, then open the lab.</h2>
              <p>
                This page only lists lessons with a built lesson page, starter code, and visualizer already wired into the app.
              </p>
            </div>
            <aside className="topic-sidebar" id="topics" aria-label="Topic index">
              <h2>Topics</h2>
              <div>
                {availableTracks.map((track) => (
                  <a key={track.slug} href={`#track-${track.slug}`}>{track.title}</a>
                ))}
              </div>
            </aside>
          </div>

          <div className="article-feed">
            {availableLessons.map((lesson) => (
              <LessonArticleCard key={lesson.slug} lesson={lesson} />
            ))}
          </div>
        </section>

        <section className="section-shell tracks-section" id="tracks" aria-labelledby="tracks-title">
          <div className="section-heading align-left">
            <p className="eyebrow">Learning tracks</p>
            <h2 id="tracks-title">Group the current catalog by real lesson modules.</h2>
            <p>
              Each track below is built from lessons that are already created, so navigation stays clean and trustworthy.
            </p>
          </div>
          <div className="track-grid">
            {availableTracks.map((track) => (
              <TrackCard key={track.slug} track={track} />
            ))}
          </div>
        </section>

        <section className="cta-section technical-cta" aria-labelledby="free-title">
          <div>
            <p className="eyebrow">Free and lesson-first</p>
            <h2 id="free-title">Start with a lesson that is ready to run.</h2>
            <p>New topics can join the publication when their reading, starter code, and visualizer are complete.</p>
          </div>
          {featuredLesson ? <a className="button primary" href={`#/lessons/${featuredLesson.slug}`}>Open First Lesson</a> : null}
        </section>
      </main>
    </>
  );
}

export function App() {
  const route = useRoute();
  const slug = getLessonSlugByPath(route);

  if (slug && LessonComponents[slug]) {
    const LazyPage = LessonComponents[slug];
    return (
      <Suspense fallback={<div className="lesson-loading" style={{ padding: "2rem", color: "var(--text-secondary)" }}>Loading lesson...</div>}>
        <LazyPage />
      </Suspense>
    );
  }

  return <LandingPage />;
}

export default App;
