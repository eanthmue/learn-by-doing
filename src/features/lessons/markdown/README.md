# Lesson Markdown Format

Lesson Markdown is an authoring format. The app parses it into `LessonContent` and still renders through `LessonPage`.

Supported top-level sections:

- `# Learning Goals`
- `# Concept`
- `# Complexity`
- `# Common Mistakes`
- `# Practice`
- `# Reflection`

Supported inline marks:

- `` `code` ``
- `**strong**`
- `_emphasis_`

Supported concept directives:

```md
::: array-diagram
:::
```

```md
::: pattern
for each item:
    update result
:::
```

The format intentionally does not support raw HTML. Add new directives only when the lesson renderer has a corresponding typed UI behavior.
