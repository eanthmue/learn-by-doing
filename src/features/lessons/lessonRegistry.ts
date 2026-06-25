import React, { lazy } from "react";
import { curriculumLessonMetadata } from "./curriculum";
import type { LessonCardEntry } from "./types";

const availableSlugs = new Set([
  "array-traversal",
  "prefix-sums",
  "graph-representations",
]);

export const lessonCards: LessonCardEntry[] = curriculumLessonMetadata.map((metadata) => {
  return {
    ...metadata,
    available: availableSlugs.has(metadata.slug),
  };
});

const lazyLessonLoaders: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  "array-traversal": () => import("./lessons/arrayTraversal/arrayTraversal").then((m) => ({
    default: () => {
      const Page = m.arrayTraversalLesson.PageComponent;
      return React.createElement(Page, { lesson: m.arrayTraversalLesson });
    }
  })),
  "prefix-sums": () => import("./lessons/prefixSums/prefixSums").then((m) => ({
    default: () => {
      const Page = m.prefixSumsLesson.PageComponent;
      return React.createElement(Page, { lesson: m.prefixSumsLesson });
    }
  })),
  "graph-representations": () => import("./lessons/graphRepresentations/graphRepresentations").then((m) => ({
    default: () => {
      const Page = m.graphRepresentationsLesson.PageComponent;
      return React.createElement(Page, { lesson: m.graphRepresentationsLesson });
    }
  })),
};

export const LessonComponents: Record<string, React.LazyExoticComponent<any>> = {};
for (const slug of availableSlugs) {
  if (lazyLessonLoaders[slug]) {
    LessonComponents[slug] = lazy(lazyLessonLoaders[slug]);
  }
}

export function getLessonSlugByPath(path: string): string | undefined {
  if (path.startsWith("/lessons/")) {
    return path.replace("/lessons/", "");
  }
  return undefined;
}