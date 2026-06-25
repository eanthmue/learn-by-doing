import { describe, expect, test } from "bun:test";
import {
  curriculumStages,
  curriculumLessonMetadata,
  getCurriculumLessonMetadata,
} from "./curriculum";

describe("curriculum", () => {
  test("should have a valid and non-empty curriculumStages structure", () => {
    expect(curriculumStages.length).toBeGreaterThan(0);
    for (const stage of curriculumStages) {
      expect(stage.slug).toBeTruthy();
      expect(stage.title).toBeTruthy();
      expect(stage.number).toBeGreaterThan(0);
      expect(stage.modules.length).toBeGreaterThan(0);
    }
  });

  test("should have unique stage slugs and stage numbers", () => {
    const stageSlugs = new Set<string>();
    const stageNumbers = new Set<number>();

    for (const stage of curriculumStages) {
      expect(stageSlugs.has(stage.slug)).toBe(false);
      expect(stageNumbers.has(stage.number)).toBe(false);
      stageSlugs.add(stage.slug);
      stageNumbers.add(stage.number);
    }
  });

  test("should have unique module slugs globally or at least stage-scoped, and proper module order", () => {
    const moduleSlugs = new Set<string>();

    for (const stage of curriculumStages) {
      const moduleOrders = new Set<number>();
      for (const module of stage.modules) {
        // Module slugs should be globally unique
        expect(moduleSlugs.has(module.slug)).toBe(false);
        moduleSlugs.add(module.slug);

        // Module orders should be unique within a stage
        expect(moduleOrders.has(module.order)).toBe(false);
        moduleOrders.add(module.order);

        expect(module.title).toBeTruthy();
        expect(module.summary).toBeTruthy();
        expect(module.lessons.length).toBeGreaterThan(0);
      }
    }
  });

  test("should have unique lesson slugs and numbers, and correct sequential relationships", () => {
    const lessonSlugs = new Set<string>();
    const lessonNumbers = new Set<number>();

    for (const stage of curriculumStages) {
      for (const module of stage.modules) {
        const lessonOrders = new Set<number>();
        for (const lesson of module.lessons) {
          // Lesson slugs should be globally unique
          expect(lessonSlugs.has(lesson.slug)).toBe(false);
          lessonSlugs.add(lesson.slug);

          // Lesson numbers should be globally unique
          expect(lessonNumbers.has(lesson.number)).toBe(false);
          lessonNumbers.add(lesson.number);

          // Lesson orders should be unique within the module
          expect(lessonOrders.has(lesson.lessonOrder)).toBe(false);
          lessonOrders.add(lesson.lessonOrder);

          // Parent relationships should be correct
          expect(lesson.stage).toBe(stage.title);
          expect(lesson.stageNumber).toBe(stage.number);
          expect(lesson.module).toBe(module.title);
          expect(lesson.moduleSlug).toBe(module.slug);
          expect(lesson.moduleOrder).toBe(module.order);
        }
      }
    }
  });

  test("should retrieve lesson metadata by slug", () => {
    const metadata = getCurriculumLessonMetadata("array-traversal");
    expect(metadata).toBeDefined();
    expect(metadata?.title).toBe("Array Traversal and Indexing");
    expect(metadata?.slug).toBe("array-traversal");
    expect(metadata?.stageNumber).toBe(2);

    const nonExistent = getCurriculumLessonMetadata("non-existent-lesson-slug");
    expect(nonExistent).toBeUndefined();
  });

  test("curriculumLessonMetadata is computed correctly", () => {
    const totalLessonsFromStages = curriculumStages.reduce(
      (acc, stage) => acc + stage.modules.reduce((accM, m) => accM + m.lessons.length, 0),
      0
    );
    expect(curriculumLessonMetadata.length).toBe(totalLessonsFromStages);
  });
});
