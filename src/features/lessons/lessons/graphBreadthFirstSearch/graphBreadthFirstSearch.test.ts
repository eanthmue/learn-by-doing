import { describe, expect, test } from "bun:test";
import {
  buildGraphBreadthFirstSearchSteps,
  graphBreadthFirstSearchLesson,
} from "./graphBreadthFirstSearch";

describe("graphBreadthFirstSearchLesson", () => {
  test("lesson definition attributes", () => {
    expect(graphBreadthFirstSearchLesson.slug).toBe("graph-breadth-first-search");
    expect(graphBreadthFirstSearchLesson.available).toBe(true);
    expect(graphBreadthFirstSearchLesson.number).toBe(31);
    expect(graphBreadthFirstSearchLesson.stage).toBe("Non-Linear Data Structures");
    expect(graphBreadthFirstSearchLesson.module).toBe("Graphs");
  });

  test("buildSteps follows deterministic level-order BFS", () => {
    const steps = buildGraphBreadthFirstSearchSteps(graphBreadthFirstSearchLesson.exampleValues);
    const finalStep = steps.at(-1);

    expect(finalStep?.variables?.order).toBe("[0, 1, 2, 3, 4, 5]");
    expect(finalStep?.variables?.visited).toBe("[0, 1, 2, 3, 4, 5]");
    expect(finalStep?.variables?.levels).toBe("[0:0, 1:1, 2:1, 3:2, 4:2, 5:3]");
    expect(finalStep?.total).toBe(6);
    expect(finalStep?.description).toContain("BFS is complete");
  });

  test("buildSteps records skip steps for already visited neighbors", () => {
    const input = [3, 0, 1, 1, 2, 2, 0];
    const steps = buildGraphBreadthFirstSearchSteps(input);

    expect(steps.some((step) => step.description.includes("already has a place"))).toBe(true);
    expect(steps.at(-1)?.variables?.order).toBe("[0, 1, 2]");
  });

  test("buildSteps handles an empty graph", () => {
    const steps = buildGraphBreadthFirstSearchSteps([0]);

    expect(steps).toHaveLength(1);
    expect(steps[0]?.activeIndex).toBeNull();
    expect(steps[0]?.total).toBe(0);
    expect(steps[0]?.description).toContain("empty graph");
  });

  test("buildSteps handles a single isolated node", () => {
    const steps = buildGraphBreadthFirstSearchSteps([1]);

    expect(steps.at(-1)?.variables?.order).toBe("[0]");
    expect(steps.some((step) => step.description.includes("no neighbors"))).toBe(true);
  });
});
