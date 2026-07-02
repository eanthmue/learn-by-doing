# LearnByDoing Agent Guardrails

These guardrails describe how agents should change this project.

## Product Direction

- Build LearnByDoing as a free interactive engineering learning platform.
- Keep the MVP focused on a strong lesson loop: readable concept content, safe practice, and optional synchronized visualization or activity feedback.
- Support DSA first, but do not hardcode the lesson engine around DSA-only assumptions.
- Preserve the core lesson contract: lesson content, learner practice, and activity/visualizer state should be separable.
- Do not add accounts, cloud sync, community publishing, AI tutoring, achievements, or multi-language runtimes until the MVP lesson loop is stable.

## Architecture

- Treat `src/features/lessons` as the lesson engine boundary.
- Register lessons through typed metadata instead of hardcoding lesson lists and route branches in app components.
- Use `LessonDefinition` for general lessons and `TraceLessonDefinition` for trace-based DSA lessons that require `traceCode`, `starterCode`, `exampleValues`, `buildSteps`, and `Visualizer`.
- Model lesson interactions with typed `LessonActivity` blocks. Do not add fake `exampleValues`, fake complexity notes, or placeholder visualizers just to satisfy an unrelated lesson shape.
- Keep lesson content data-driven where practical. Avoid duplicating the same lesson prose in Markdown and JSX.
- Keep visualizers deterministic. They should render from explicit step data instead of inferring state from arbitrary user code.
- Prefer small feature folders over broad shared abstractions. Add shared code only after two or more real callers need it.

## Code Sandbox Safety

- Never execute learner code directly on the main UI thread.
- Run learner JavaScript in an isolated runner with a timeout and captured console output.
- Treat `new Function`, `eval`, dynamic import, network access, storage access, and DOM access as security-sensitive.
- If a stronger sandbox is needed, use a sandboxed iframe served from a separate origin. Do not combine `allow-scripts` and `allow-same-origin` for same-origin sandbox content.
- Keep learner code output text-only unless a lesson explicitly introduces structured output.

## Lesson Authoring

Each lesson should include:

- Title, slug, module, order, tags, and availability metadata.
- Learning goals.
- Concept explanation.
- Worked example or demonstration.
- At least one practice/check activity with expected behavior.
- Reflection prompt.

Add these only when the lesson type needs them:

- Starter code that runs without edits for code-lab or trace lessons.
- Visualizer states or a deterministic step builder for trace-visualizer lessons.
- Complexity notes for algorithmic lessons.
- Common mistakes with bad/good code only when code comparison is the clearest teaching tool.

Lesson content should stay programming-language-neutral unless the lesson is explicitly about a language, runtime, framework, or tool:

- For general concept prose, avoid language-specific syntax explanations, idioms, standard library details, or ecosystem references.
- Put tool-specific details in starter code, practice instructions, or activity data when they are necessary.

Pedagogical Tone and Style (Crucial):

- **Use Conversational Hooks:** Start explanations with intuitive, real-world analogies (e.g., "Think of X as Y...").
- **Concrete Over Abstract:** Introduce a concrete example immediately. Use arrays for array lessons, graphs for graph lessons, request flows for web lessons, component trees for React lessons, and so on.
- **Step-by-Step Tracing:** Walk through the example step-by-step using bullets, showing how the data, state, or decision changes explicitly.
- **Explain the "Why":** Demystify confusing patterns in plain English, including what breaks or becomes harder without the pattern.
- **Avoid Academic Jargon:** Do not use terms like "invariant" or "monotonic" as a crutch. If a formal term is useful, define it through the concrete example first.

## UI and UX

- Keep the learning workspace calm, readable, and responsive.
- On desktop, preserve the split-pane read/code/visual workflow for trace lessons, but allow non-trace lessons to use the layout their activity type needs.
- On small screens, stack panes without clipping controls or code.
- Prefer accessible labels for icon-style controls.
- Do not introduce heavy visual libraries for MVP visualizers unless a lesson truly needs them.

## Verification

- Run `bun run build` after architecture or frontend changes.
- Run `bun run typecheck` after type or lesson contract changes.
- Add tests when shared lesson logic, sandbox behavior, or progress persistence grows beyond a single lesson.
- Keep generated build output out of commits unless the deployment setup explicitly requires it.
