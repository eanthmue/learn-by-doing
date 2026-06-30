import { describe, expect, test } from "bun:test";
import {
  buildSlidingWindowWordFrequencySteps,
  slidingWindowWordFrequencyLesson,
} from "./slidingWindowWordFrequency";

describe("slidingWindowWordFrequencyLesson", () => {
  test("lesson definition attributes", () => {
    expect(slidingWindowWordFrequencyLesson.slug).toBe("sliding-window-word-frequency");
    expect(slidingWindowWordFrequencyLesson.available).toBe(true);
    expect(slidingWindowWordFrequencyLesson.exampleValues).toEqual({
      stream: "paylogadmseelogadmpay",
      bundle: ["pay", "log", "adm"],
    });
  });

  test("buildSteps finds suspicious bundles in the example stream", () => {
    const steps = slidingWindowWordFrequencyLesson.buildSteps({
      stream: "paylogadmseelogadmpay",
      bundle: ["pay", "log", "adm"],
    });

    const finalStep = steps.at(-1);
    expect(finalStep?.wordWindow?.matchedStarts).toEqual([0, 12]);
    expect(finalStep?.variables?.result).toBe("[0, 12]");
    expect(steps.some((step) => step.description.includes("see is not on the suspicious checklist"))).toBe(true);
    expect(steps.some((step) => step.description.includes("index 0 is recorded"))).toBe(true);
    expect(steps.some((step) => step.description.includes("index 12 is recorded"))).toBe(true);
  });

  test("buildSteps handles duplicate required words", () => {
    const steps = buildSlidingWindowWordFrequencySteps({
      stream: "logpaypayadm",
      bundle: ["pay", "pay", "log"],
    });

    expect(steps.at(-1)?.wordWindow?.matchedStarts).toEqual([0]);
    expect(steps.at(-1)?.variables?.result).toBe("[0]");
  });

  test("buildSteps returns one validation step for invalid bundles", () => {
    const steps = buildSlidingWindowWordFrequencySteps({
      stream: "paylogadm",
      bundle: ["pay", "login"],
    });

    expect(steps).toHaveLength(1);
    expect(steps[0]?.variables?.result).toBe("[]");
  });
});