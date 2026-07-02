import { describe, expect, test } from "bun:test";
import {
  buildGraphDepthFirstSearchSteps,
  graphDepthFirstSearchLesson,
} from "./graphDepthFirstSearch";

describe("graphDepthFirstSearchLesson", () => {
  test("lesson definition attributes", () => {
    expect(graphDepthFirstSearchLesson.slug).toBe("graph-depth-first-search");
    expect(graphDepthFirstSearchLesson.available).toBe(true);
    expect(graphDepthFirstSearchLesson.number).toBe(30);
    expect(graphDepthFirstSearchLesson.stage).toBe("Non-Linear Data Structures");
    expect(graphDepthFirstSearchLesson.module).toBe("Graphs");
  });

  test("buildSteps follows deterministic recursive DFS order", () => {
    const steps = buildGraphDepthFirstSearchSteps(graphDepthFirstSearchLesson.exampleValues);
    const finalStep = steps.at(-1);

    expect(finalStep?.variables?.order).toBe("[0, 1, 3, 5, 4, 2]");
    expect(finalStep?.variables?.visited).toBe("[0, 1, 3, 5, 4, 2]");
    expect(finalStep?.total).toBe(6);
    expect(finalStep?.description).toContain("DFS is complete");
  });

  test("buildSteps records skip steps for already visited neighbors", () => {
    const input = [3, 0, 1, 1, 2, 2, 0];
    const steps = buildGraphDepthFirstSearchSteps(input);

    expect(steps.some((step) => step.description.includes("already visited"))).toBe(true);
    expect(steps.at(-1)?.variables?.order).toBe("[0, 1, 2]");
  });

  test("buildSteps handles an empty graph", () => {
    const steps = buildGraphDepthFirstSearchSteps([0]);

    expect(steps).toHaveLength(1);
    expect(steps[0]?.activeIndex).toBeNull();
    expect(steps[0]?.total).toBe(0);
    expect(steps[0]?.description).toContain("empty graph");
  });

  test("buildSteps handles a single isolated node", () => {
    const steps = buildGraphDepthFirstSearchSteps([1]);

    expect(steps.at(-1)?.variables?.order).toBe("[0]");
    expect(steps.some((step) => step.description.includes("no neighbors"))).toBe(true);
  });
});
