import React, { lazy } from "react";
import { curriculumLessonMetadata } from "./curriculum";
import type { LessonCardEntry } from "./types";

const availableSlugs = new Set([
  "array-traversal",
  "prefix-sums",
  "sliding-window",
  "sliding-window-word-frequency",
  "map-reduce",
  "graph-representations",
  "graph-depth-first-search",
  "graph-breadth-first-search",
]);

export const lessonCards: LessonCardEntry[] = curriculumLessonMetadata.map((metadata) => {
  return {
    ...metadata,
    available: availableSlugs.has(metadata.slug),
  };
});

const lazyLessonLoaders: Record<string, () => Promise<{ default: React.ComponentType }>> = {
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
  "sliding-window": () => import("./lessons/slidingWindow/slidingWindow").then((m) => ({
    default: () => {
      const Page = m.slidingWindowLesson.PageComponent;
      return React.createElement(Page, { lesson: m.slidingWindowLesson });
    }
  })),
  "sliding-window-word-frequency": () => import("./lessons/slidingWindowWordFrequency/slidingWindowWordFrequency").then((m) => ({
    default: () => {
      const Page = m.slidingWindowWordFrequencyLesson.PageComponent;
      return React.createElement(Page, { lesson: m.slidingWindowWordFrequencyLesson });
    }
  })),
  "map-reduce": () => import("./lessons/mapReduce/mapReduce").then((m) => ({
    default: () => {
      const Page = m.mapReduceLesson.PageComponent;
      return React.createElement(Page, { lesson: m.mapReduceLesson });
    }
  })),
  "graph-representations": () => import("./lessons/graphRepresentations/graphRepresentations").then((m) => ({
    default: () => {
      const Page = m.graphRepresentationsLesson.PageComponent;
      return React.createElement(Page, { lesson: m.graphRepresentationsLesson });
    }
  })),
  "graph-depth-first-search": () => import("./lessons/graphDepthFirstSearch/graphDepthFirstSearch").then((m) => ({
    default: () => {
      const Page = m.graphDepthFirstSearchLesson.PageComponent;
      return React.createElement(Page, { lesson: m.graphDepthFirstSearchLesson });
    }
  })),
  "graph-breadth-first-search": () => import("./lessons/graphBreadthFirstSearch/graphBreadthFirstSearch").then((m) => ({
    default: () => {
      const Page = m.graphBreadthFirstSearchLesson.PageComponent;
      return React.createElement(Page, { lesson: m.graphBreadthFirstSearchLesson });
    }
  })),
};

export const LessonComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {};
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
