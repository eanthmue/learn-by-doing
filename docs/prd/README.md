# Product Requirements Document: LearnByDoing

## 1. Product Overview

LearnByDoing is a free, interactive engineering learning platform that combines text explanations, live code sandboxes, and dynamic visualizations to teach technical concepts. The MVP focuses on Data Structures & Algorithms (DSA), with a reusable lesson engine that can support other engineering domains later.

## 2. Goals & Objectives

- Provide completely free, interactive lessons to learners to help them master technical concepts without financial barriers
- Provide an engaging, multi-modal learning experience (read → code → see)
- Build a reusable lesson engine that decouples content from platform
- Enable rapid addition of new topics as self-contained modules
- Keep learners in a single context: no switching between docs, editor, and visualization tools

## 3. Target Audience

- CS students preparing for interviews
- Self-taught engineers filling knowledge gaps
- Educators looking for interactive teaching aids

## 4. Core Architecture

Every lesson is composed of three pluggable buckets:

```
Lesson {
  text:   Markdown/rich content  →  any topic
  code:   Editable sandbox       →  JS/TS-first runner interface
  visual: Interactive component  →  topic-specific React component
}
```

The platform provides the **shell** (routing, layout, progress). Each **topic** registers:
- A lesson manifest (ordered list of lessons)
- A Visualizer React component (optional, per-lesson or shared)
- A default code runner language + template

## 5. MVP Scope

The first product release is DSA-focused and must prove the core lesson loop:

- Read a concept explanation
- Edit and run example code
- Inspect a synchronized visualization
- Navigate between lessons in a topic
- Persist local progress

Non-DSA topic modules, user accounts, cloud sync, community lesson publishing, AI assistance, and achievement systems are out of scope for the MVP.

## 6. Features

### 6.1 Lesson Shell
- Split-pane layout: text (left) | code + visual (right)
- Markdown rendering with inline diagrams / LaTeX
- Lesson navigation (prev/next, table of contents)
- Local progress tracking (completion state)

### 6.2 Code Sandbox
- In-browser code editor (CodeMirror / Monaco)
- Run button with output console
- Pre-populated templates; user can edit freely
- MVP runner support for JavaScript/TypeScript examples
- Python support may be added after the core DSA loop is stable

### 6.3 Interactive Visualizer
- Pluggable per-lesson React component
- Step-by-step animation with play/pause/step/speed controls
- Color-coded state transitions
- Code line highlighting synced to visual step

### 6.4 Topic Modules

| Module | Text Topics | Code | Visual |
|---|---|---|---|
| DSA | arrays, sorting, graphs, trees, DP | JS/TS first | step-through animation |

## 7. User Stories

- **As a learner**, I want to read a concept and immediately run code to test my understanding.
- **As a learner**, I want to watch an algorithm execute step-by-step so I can internalize the logic.
- **As a learner**, I want to edit the example code and see my changes reflected in the visualizer.
- **As a platform maintainer**, I want to add a new topic by dropping a folder with markdown + components, without touching core code.

## 8. Technical Requirements

- **Frontend**: React 19 + TypeScript
- **Runtime and tooling**: Bun dev server, Bun bundler, Bun server routes
- **Code runner**: Browser-isolated JS/TS runner for MVP; optional WASM-based runtimes after MVP
- **Visualization**: Canvas API or custom SVG (no heavy 3D libs initially)
- **State management**: React context or lightweight store for lesson state + progress
- **Routing**: React Router with nested routes per topic
- **Persistence**: localStorage for MVP; optional backend sync later

## 9. Non-Functional Requirements

- Fast initial load (<2s), progressive enhancement for visualizers
- Visualizer must support at least 30fps animation
- Offline-capable for read + code sections (service worker)
- Mobile-responsive layout (stack panes vertically on small screens)

## 10. Future Scope

- User accounts & cloud sync
- Community-contributed lessons
- AI-powered "Explain this" assistant
- Multi-language code sandbox (Rust, Go, C++)
- Achievement system based on topic mastery

## 11. Success Metrics

- Completion rate per lesson (>60% target)
- Average time spent per lesson (>10 min)
- Number of topics/modules added (community or internal)
- User retention (week-1, week-4)
