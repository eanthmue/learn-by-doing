# LearnByDoing Agent Guardrails

These guardrails describe how agents should change this project.

## Product Direction

- Build LearnByDoing as a free interactive engineering learning platform.
- Keep the MVP focused on DSA lessons that combine reading, editable code, and synchronized visualization.
- Preserve the core lesson contract: text content, starter code, and visualizer state should be separable.
- Do not add accounts, cloud sync, community publishing, AI tutoring, achievements, or multi-language runtimes until the MVP lesson loop is stable.

## Architecture

- Treat `src/features/lessons` as the lesson engine boundary.
- Register lessons through typed metadata instead of hardcoding lesson lists and route branches in app components.
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
- Worked example.
- Starter code that runs without edits.
- Visualizer states or a deterministic step builder.
- Complexity note.
- Common mistakes.
- Practice task with expected behavior.
- Reflection prompt.

Lesson content should stay programming-language-neutral:

- Do not include programming-language-specific concepts, syntax explanations, idioms, standard library details, or ecosystem references in lesson prose.

Pedagogical Tone and Style (Crucial):

- **Use Conversational Hooks:** Start explanations with intuitive, real-world analogies (e.g., "Think of X as Y...").
- **Concrete Over Abstract:** Introduce a concrete example array/dataset with numbers immediately, rather than starting with abstract formulas or math variables.
- **Step-by-Step Tracing:** Walk through the example step-by-step using bullet points, showing how the data changes explicitly at each step.
- **Explain the "Why":** Demystify confusing patterns (like "why is there a leading zero?" or "why do we use two pointers?") in plain English, explaining what would happen if we didn't use them (e.g., "to prevent your code from crashing").
- **Avoid Academic Jargon:** Do not use terms like "invariant" or "monotonic" as a crutch. If you must introduce a formal term, define it using the concrete example first.

## UI and UX

- Keep the learning workspace calm, readable, and responsive.
- On desktop, preserve the split-pane read/code/visual workflow.
- On small screens, stack panes without clipping controls or code.
- Prefer accessible labels for icon-style controls.
- Do not introduce heavy visual libraries for MVP DSA visualizers unless a lesson truly needs them.

## Verification

- Run `bun run build` after architecture or frontend changes.
- Add tests when shared lesson logic, sandbox behavior, or progress persistence grows beyond a single lesson.
- Keep generated build output out of commits unless the deployment setup explicitly requires it.
