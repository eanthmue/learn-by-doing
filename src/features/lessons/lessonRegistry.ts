import { curriculumLessonMetadata } from "./curriculum";
import { arrayTraversalLesson } from "./lessons/arrayTraversal";
import { prefixSumsLesson } from "./lessons/prefixSums";
import type { LessonCardEntry, LessonDefinition } from "./types";

export const availableLessons: LessonDefinition[] = [
  arrayTraversalLesson,
  prefixSumsLesson,
];

const availableLessonsBySlug = new Map(availableLessons.map((lesson) => [lesson.slug, lesson]));

export const lessonCards: LessonCardEntry[] = curriculumLessonMetadata.map((metadata) => {
  const availableLesson = availableLessonsBySlug.get(metadata.slug);

  if (!availableLesson) {
    return {
      ...metadata,
      available: false,
    };
  }

  return {
    ...metadata,
    description: availableLesson.description,
    tags: availableLesson.tags,
    available: true,
  };
});

export function getLessonByPath(path: string): LessonDefinition | undefined {
  return availableLessons.find((lesson) => lesson.routePath === path);
}