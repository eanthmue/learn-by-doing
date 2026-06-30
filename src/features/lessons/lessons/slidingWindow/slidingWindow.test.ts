import { describe, expect, test } from "bun:test";
import { slidingWindowLesson } from "./slidingWindow";

describe("slidingWindowLesson", () => {
  test("lesson definition attributes", () => {
    expect(slidingWindowLesson.slug).toBe("sliding-window");
    expect(slidingWindowLesson.available).toBe(true);
    expect(slidingWindowLesson.exampleValues).toEqual([2, 1, 5, 1, 3, 2, 6]);
  });

  test("buildSteps traces a fixed-size sliding window", () => {
    const steps = slidingWindowLesson.buildSteps([2, 1, 5, 1, 3]);

    expect(steps).toHaveLength(12);
    expect(steps[0]?.total).toBe(0);
    expect(steps[0]?.windowRange).toMatchObject({ left: 0, right: -1, size: 3 });

    expect(steps[1]?.activeIndex).toBe(0);
    expect(steps[1]?.total).toBe(2);
    expect(steps[1]?.windowRange).toMatchObject({ left: 0, right: 0 });
    expect(steps[3]?.activeIndex).toBe(2);
    expect(steps[3]?.total).toBe(8);
    expect(steps[3]?.windowRange).toMatchObject({ left: 0, right: 2 });

    expect(steps[4]?.variables?.best).toBe(8);
    expect(steps[4]?.windowRange).toMatchObject({ left: 0, right: 2, bestLeft: 0, bestRight: 2 });

    expect(steps[5]?.activeIndex).toBe(3);
    expect(steps[5]?.total).toBe(9);
    expect(steps[5]?.windowRange).toMatchObject({ left: 0, right: 3, enteringIndex: 3, leavingIndex: 0 });

    expect(steps[6]?.activeIndex).toBe(0);
    expect(steps[6]?.total).toBe(7);
    expect(steps[6]?.windowRange).toMatchObject({ left: 1, right: 3, leavingIndex: 0 });

    expect(steps[8]?.activeIndex).toBe(4);
    expect(steps[8]?.total).toBe(10);
    expect(steps[9]?.total).toBe(9);
    expect(steps[10]?.variables?.best).toBe(9);
    expect(steps[10]?.windowRange).toMatchObject({ left: 2, right: 4, bestLeft: 2, bestRight: 4 });

    expect(steps[11]?.total).toBe(9);
    expect(steps[11]?.codeLine).toBe(17);
  });

  test("buildSteps handles arrays shorter than the fixed visual window", () => {
    const steps = slidingWindowLesson.buildSteps([5]);

    expect(steps).toHaveLength(1);
    expect(steps[0]?.variables?.result).toBeNull();
    expect(steps[0]?.windowRange).toMatchObject({ left: 0, right: -1, size: 3 });
  });
});