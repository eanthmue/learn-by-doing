import { describe, expect, test } from "bun:test";
import { mapReduceLesson } from "./mapReduce";

describe("mapReduceLesson", () => {
  test("lesson definition attributes", () => {
    expect(mapReduceLesson.slug).toBe("map-reduce");
    expect(mapReduceLesson.available).toBe(true);
    expect(mapReduceLesson.exampleValues).toEqual([3, 1, 4]);
  });

  test("buildSteps constructs steps correctly for non-empty array", () => {
    const input = [5, 2];
    const steps = mapReduceLesson.buildSteps(input);

    // Steps should be:
    // 1 (initial map step)
    // + input.length (map loop steps)
    // + 1 (transition to reduce step)
    // + input.length (reduce loop steps)
    // + 1 (final step)
    // Total = 1 + 2 + 1 + 2 + 1 = 7 steps
    expect(steps).toHaveLength(7);

    // Step 0: Initial Map Step
    expect(steps[0]?.mapReduce?.phase).toBe("map");
    expect(steps[0]?.activeIndex).toBeNull();
    expect(steps[0]?.mapReduce?.mappedValues).toEqual([null, null]);

    // Step 1: Map index 0
    expect(steps[1]?.mapReduce?.phase).toBe("map");
    expect(steps[1]?.activeIndex).toBe(0);
    expect(steps[1]?.mapReduce?.mappedValues).toEqual([10, null]);

    // Step 2: Map index 1
    expect(steps[2]?.mapReduce?.phase).toBe("map");
    expect(steps[2]?.activeIndex).toBe(1);
    expect(steps[2]?.mapReduce?.mappedValues).toEqual([10, 4]);

    // Step 3: Transition to Reduce
    expect(steps[3]?.mapReduce?.phase).toBe("reduce");
    expect(steps[3]?.mapReduce?.accumulator).toBe(0);
    expect(steps[3]?.mapReduce?.activeMappedIndex).toBeNull();

    // Step 4: Reduce index 0
    expect(steps[4]?.mapReduce?.phase).toBe("reduce");
    expect(steps[4]?.mapReduce?.accumulator).toBe(10);
    expect(steps[4]?.mapReduce?.activeMappedIndex).toBe(0);
    expect(steps[4]?.total).toBe(10);

    // Step 5: Reduce index 1
    expect(steps[5]?.mapReduce?.phase).toBe("reduce");
    expect(steps[5]?.mapReduce?.accumulator).toBe(14);
    expect(steps[5]?.mapReduce?.activeMappedIndex).toBe(1);
    expect(steps[5]?.total).toBe(14);

    // Step 6: Final step
    expect(steps[6]?.mapReduce?.phase).toBe("done");
    expect(steps[6]?.mapReduce?.accumulator).toBe(14);
    expect(steps[6]?.mapReduce?.activeMappedIndex).toBeNull();
    expect(steps[6]?.total).toBe(14);
  });

  test("buildSteps constructs steps correctly for empty array", () => {
    const input: number[] = [];
    const steps = mapReduceLesson.buildSteps(input);

    // Steps should be:
    // 1 (initial map step)
    // + 1 (transition to reduce step)
    // + 1 (final step)
    // Total = 3 steps
    expect(steps).toHaveLength(3);
    expect(steps[0]?.mapReduce?.phase).toBe("map");
    expect(steps[1]?.mapReduce?.phase).toBe("reduce");
    expect(steps[2]?.mapReduce?.phase).toBe("done");
    expect(steps[2]?.total).toBe(0);
  });
});
