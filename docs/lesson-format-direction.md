# Lesson Format Direction

LearnByDoing lessons are no longer assumed to be DSA visualizer lessons. The shared lesson contract should describe the learning object, while activity-specific data should live in typed activity blocks.

## Core Lesson Shape

Use `LessonDefinition` for general lessons. It owns metadata, content, and an optional `activities` list.

Universal fields:

- title, slug, module, order, tags, and availability metadata
- learning goals
- concept sections
- practice task
- reflection prompt
- optional complexity analysis
- typed activities

`complexity` is optional because non-algorithm lessons may not have time/space analysis.

## Activity Blocks

Activities are discriminated unions under `LessonActivity`:

- `trace-visualizer`: synchronized code trace plus deterministic visualizer state
- `code-lab`: editable starter code with optional expected output
- `diagram`: typed diagram data such as arrays, graphs, memory, request flows, or component trees
- `quiz`: multiple-choice checks with explanations
- `reflection`: standalone reflection prompts
- `reading`: additional structured reading sections

This keeps a Git, HTTP, React, database, testing, or architecture lesson from needing fake `exampleValues` just to satisfy a DSA visualizer contract.

## DSA Trace Lessons

Existing DSA lessons should use `TraceLessonDefinition`. It keeps these fields required:

- `traceCode`
- `starterCode`
- `exampleValues`
- `buildSteps`
- `Visualizer`

The main `LessonPage` accepts both shapes. It first looks for a `trace-visualizer` activity. If none exists, it falls back to the legacy trace fields used by current DSA lessons.

## Markdown Parser

`parseLessonMarkdown` currently returns `AlgorithmLessonContent`, so Markdown-authored DSA lessons still require a `# Complexity` table. A future broader Markdown parser should parse activity directives instead of hardcoding array/graph-specific directives.
