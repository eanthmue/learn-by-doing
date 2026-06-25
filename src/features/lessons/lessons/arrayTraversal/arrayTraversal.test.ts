import { describe, expect, test } from "bun:test";
import { arrayTraversalLesson } from "./arrayTraversal";

describe("arrayTraversalLesson", () => {
  test("lesson definition attributes", () => {
    expect(arrayTraversalLesson.slug).toBe("array-traversal");
    expect(arrayTraversalLesson.available).toBe(true);
    expect(arrayTraversalLesson.exampleValues).toEqual([4, 7, 2, 9, 1]);
  });

  test("buildSteps constructs steps correctly for non-empty array", () => {
    const input = [2, 5];
    const steps = arrayTraversalLesson.buildSteps(input);

    // Initial step + one per element + final step = input.length + 2
    expect(steps).toHaveLength(4);

    // Step 0: Initialize
    expect(steps[0]?.activeIndex).toBeNull();
    expect(steps[0]?.total).toBe(0);
    expect(steps[0]?.variables?.total).toBe(0);

    // Step 1: Processing input[0] (2)
    expect(steps[1]?.activeIndex).toBe(0);
    expect(steps[1]?.total).toBe(2);
    expect(steps[1]?.variables?.i).toBe(0);
    expect(steps[1]?.variables?.["arr[i]"]).toBe(2);
    expect(steps[1]?.variables?.total).toBe(2);

    // Step 2: Processing input[1] (5)
    expect(steps[2]?.activeIndex).toBe(1);
    expect(steps[2]?.total).toBe(7);
    expect(steps[2]?.variables?.i).toBe(1);
    expect(steps[2]?.variables?.["arr[i]"]).toBe(5);
    expect(steps[2]?.variables?.total).toBe(7);

    // Step 3: Final step
    expect(steps[3]?.activeIndex).toBeNull();
    expect(steps[3]?.total).toBe(7);
    expect(steps[3]?.variables?.total).toBe(7);
  });

  test("buildSteps constructs steps correctly for empty array", () => {
    const input: number[] = [];
    const steps = arrayTraversalLesson.buildSteps(input);

    expect(steps).toHaveLength(2);
    expect(steps[0]?.total).toBe(0);
    expect(steps[1]?.total).toBe(0);
  });
});
