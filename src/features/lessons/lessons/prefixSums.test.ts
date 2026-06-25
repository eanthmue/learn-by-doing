import { describe, expect, test } from "bun:test";
import { prefixSumsLesson } from "./prefixSums";

describe("prefixSumsLesson", () => {
  test("lesson definition attributes", () => {
    expect(prefixSumsLesson.slug).toBe("prefix-sums");
    expect(prefixSumsLesson.available).toBe(true);
    expect(prefixSumsLesson.exampleValues).toEqual([3, -2, 5, 1, 6]);
  });

  test("buildSteps constructs steps correctly for non-empty array", () => {
    const input = [3, -2, 5];
    const steps = prefixSumsLesson.buildSteps(input);

    // Initial step + one per element + query explanation step + query result step = input.length + 3
    expect(steps).toHaveLength(6);

    // Step 0: Initial prefix[0] = 0
    expect(steps[0]?.prefixIndex).toBe(0);
    expect(steps[0]?.prefixValues).toEqual([0, null, null, null]);

    // Step 1: index = 0, value = 3, prefix[1] = 3
    expect(steps[1]?.activeIndex).toBe(0);
    expect(steps[1]?.prefixIndex).toBe(1);
    expect(steps[1]?.prefixValues).toEqual([0, 3, null, null]);
    expect(steps[1]?.variables?.["nums[i]"]).toBe(3);

    // Step 2: index = 1, value = -2, prefix[2] = 1
    expect(steps[2]?.activeIndex).toBe(1);
    expect(steps[2]?.prefixIndex).toBe(2);
    expect(steps[2]?.prefixValues).toEqual([0, 3, 1, null]);

    // Step 3: index = 2, value = 5, prefix[3] = 6
    expect(steps[3]?.activeIndex).toBe(2);
    expect(steps[3]?.prefixIndex).toBe(3);
    expect(steps[3]?.prefixValues).toEqual([0, 3, 1, 6]);

    // Step 4: Query ranges explanation (subtracting)
    expect(steps[4]?.activeIndex).toBeNull();
    expect(steps[4]?.queryRange).toBeDefined();
    expect(steps[4]?.queryRange?.left).toBe(0); // Since input length is 3 (<= 3), left is 0, right is 2
    expect(steps[4]?.queryRange?.right).toBe(2);
    expect(steps[4]?.queryRange?.result).toBeUndefined();

    // Step 5: Query result step
    expect(steps[5]?.activeIndex).toBeNull();
    expect(steps[5]?.queryRange?.result).toBe(6); // sum from 0 to 2 is 3 + (-2) + 5 = 6
    expect(steps[5]?.total).toBe(6);
  });

  test("buildSteps constructs steps correctly for empty array", () => {
    const input: number[] = [];
    const steps = prefixSumsLesson.buildSteps(input);

    // Initial step + empty array warning step = 2 steps
    expect(steps).toHaveLength(2);
    expect(steps[0]?.prefixValues).toEqual([0]);
    expect(steps[1]?.prefixValues).toEqual([0]);
    expect(steps[1]?.prefixIndex).toBeNull();
  });
});
