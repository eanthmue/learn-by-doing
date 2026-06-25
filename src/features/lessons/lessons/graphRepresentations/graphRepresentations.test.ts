import { describe, expect, test } from "bun:test";
import { graphRepresentationsLesson, buildGraphRepresentationSteps } from "./graphRepresentations";

describe("graphRepresentationsLesson", () => {
  test("lesson definition attributes", () => {
    expect(graphRepresentationsLesson.slug).toBe("graph-representations");
    expect(graphRepresentationsLesson.available).toBe(true);
    expect(graphRepresentationsLesson.number).toBe(27);
    expect(graphRepresentationsLesson.stage).toBe("Non-Linear Data Structures");
    expect(graphRepresentationsLesson.module).toBe("Graphs");
  });

  test("buildSteps constructs steps correctly for standard graph", () => {
    // Encoding: [numNodes, a0, b0, a1, b1, ...]
    // 4 nodes, edges: [0,1], [1,2], [2,3]
    const input = [4, 0, 1, 1, 2, 2, 3];
    const steps = buildGraphRepresentationSteps(input);

    // Initial step + 3 edge steps + final step = 5
    expect(steps).toHaveLength(5);

    // Step 0: Initial state
    expect(steps[0]?.activeIndex).toBeNull();
    expect(steps[0]?.total).toBe(0);
    expect(steps[0]?.variables?.numNodes).toBe(4);

    // Step 1: Edge [0,1]
    expect(steps[1]?.activeIndex).toBe(0);
    expect(steps[1]?.total).toBe(1);
    expect(steps[1]?.variables?.edge).toBe("[0, 1]");

    // Step 2: Edge [1,2]
    expect(steps[2]?.activeIndex).toBe(1);
    expect(steps[2]?.total).toBe(2);
    expect(steps[2]?.variables?.edge).toBe("[1, 2]");

    // Step 3: Edge [2,3]
    expect(steps[3]?.activeIndex).toBe(2);
    expect(steps[3]?.total).toBe(3);
    expect(steps[3]?.variables?.edge).toBe("[2, 3]");

    // Step 4: Final summary
    expect(steps[4]?.activeIndex).toBeNull();
    expect(steps[4]?.total).toBe(3);
    expect(steps[4]?.variables?.edgesProcessed).toBe(3);
  });

  test("buildSteps handles graph with no edges", () => {
    // 3 nodes, no edges
    const input = [3];
    const steps = buildGraphRepresentationSteps(input);

    // Initial step + final step = 2
    expect(steps).toHaveLength(2);
    expect(steps[0]?.variables?.numNodes).toBe(3);
    expect(steps[0]?.variables?.edges).toBe(0);
    expect(steps[1]?.total).toBe(0);
    expect(steps[1]?.variables?.edgesProcessed).toBe(0);
  });

  test("buildSteps handles single-node graph", () => {
    const input = [1];
    const steps = buildGraphRepresentationSteps(input);

    expect(steps).toHaveLength(2);
    expect(steps[0]?.description).toContain("1 node");
    expect(steps[0]?.description).toContain("0 edges");
  });

  test("buildSteps description references both nodes for each edge", () => {
    const input = [3, 0, 2, 1, 2];
    const steps = buildGraphRepresentationSteps(input);

    // Edge step descriptions should mention both nodes
    expect(steps[1]?.description).toContain("0");
    expect(steps[1]?.description).toContain("2");
    expect(steps[2]?.description).toContain("1");
    expect(steps[2]?.description).toContain("2");
  });

  test("exampleValues encodes the documented 5-node graph", () => {
    const vals = graphRepresentationsLesson.exampleValues;
    // [5, 0,1, 0,2, 1,2, 1,3, 2,4, 3,4]
    expect(vals[0]).toBe(5); // 5 nodes
    expect(vals.length).toBe(13); // 1 + 6*2
  });
});
