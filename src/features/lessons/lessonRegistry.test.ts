import { describe, expect, test } from "bun:test";
import {
  LessonComponents,
  lessonCards,
  getLessonSlugByPath,
} from "./lessonRegistry";

describe("lessonRegistry", () => {
  test("LessonComponents list is correctly populated", () => {
    expect(Object.keys(LessonComponents).length).toBeGreaterThan(0);
    expect(LessonComponents["array-traversal"]).toBeDefined();
  });

  test("lessonCards correctly reflects available vs unavailable lessons", () => {
    expect(lessonCards.length).toBeGreaterThan(0);
    
    // Find some known available lessons (e.g. array-traversal)
    const arrayTraversalCard = lessonCards.find((card) => card.slug === "array-traversal");
    expect(arrayTraversalCard).toBeDefined();
    expect(arrayTraversalCard?.available).toBe(true);

    // Find some lesson that is defined in curriculum but not available in registry
    // e.g. "sliding-window" is in curriculum but not in availableLessons
    const slidingWindowCard = lessonCards.find((card) => card.slug === "sliding-window");
    expect(slidingWindowCard).toBeDefined();
    expect(slidingWindowCard?.available).toBe(false);
  });

  test("getLessonSlugByPath extracts slugs correctly", () => {
    const slug = getLessonSlugByPath("/lessons/array-traversal");
    expect(slug).toBe("array-traversal");

    const nonExistent = getLessonSlugByPath("/lessons/non-existent");
    expect(nonExistent).toBe("non-existent"); // It still parses the slug, validity is checked elsewhere

    const notALessonRoute = getLessonSlugByPath("/");
    expect(notALessonRoute).toBeUndefined();
  });
});
