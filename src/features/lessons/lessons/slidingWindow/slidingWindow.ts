import { LessonPage } from "../../LessonPage";
import { parseLessonMarkdown } from "../../markdown/parseLessonMarkdown";
import type { TraceLessonDefinition, VisualizerStep } from "../../types";
import { SlidingWindowVisualizer } from "./SlidingWindowVisualizer";
import slidingWindowMarkdown from "./slidingWindow.md" with { type: "text" };

const WINDOW_SIZE = 3;

const slidingWindowTraceCode = `function maxFixedWindowSum(nums, k) {
  if (k <= 0 || k > nums.length) {
    return null;
  }
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }
  let best = windowSum;
  for (let right = k; right < nums.length; right++) {
    windowSum += nums[right];
    windowSum -= nums[right - k];
    if (windowSum > best) {
      best = windowSum;
    }
  }
  return best;
}`;

const slidingWindowStarterCode = `function maxFixedWindowSum(nums, k) {
  if (k <= 0 || k > nums.length) {
    return null;
  }

  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }

  let best = windowSum;
  for (let right = k; right < nums.length; right++) {
    windowSum += nums[right];
    windowSum -= nums[right - k];

    if (windowSum > best) {
      best = windowSum;
    }
  }

  return best;
}

// Try it out
console.log(maxFixedWindowSum([2, 1, 5, 1, 3, 2, 6], 3));
console.log(maxFixedWindowSum([4, -1, 2, 10], 2));
console.log(maxFixedWindowSum([-5, -2, -8], 2));
console.log(maxFixedWindowSum([5], 2));`;

const slidingWindowContent = parseLessonMarkdown(slidingWindowMarkdown);

function buildSlidingWindowSteps(values: number[]): VisualizerStep[] {
  const k = WINDOW_SIZE;

  if (k <= 0 || k > values.length) {
    return [
      {
        activeIndex: null,
        total: 0,
        description: `A window of size ${k} does not fit in ${values.length} value(s), so the answer is null.`,
        codeLine: 2,
        variables: {
          k,
          length: values.length,
          result: null,
        },
        windowRange: {
          left: 0,
          right: -1,
          size: k,
          bestLeft: null,
          bestRight: null,
        },
      },
    ];
  }

  const steps: VisualizerStep[] = [
    {
      activeIndex: null,
      total: 0,
      description: `Start with windowSum = 0 before building the first size-${k} window.`,
      codeLine: 5,
      variables: {
        k,
        windowSum: 0,
      },
      windowRange: {
        left: 0,
        right: -1,
        size: k,
        bestLeft: null,
        bestRight: null,
      },
    },
  ];

  let windowSum = 0;
  for (let index = 0; index < k; index += 1) {
    const value = values[index] ?? 0;
    windowSum += value;
    steps.push({
      activeIndex: index,
      total: windowSum,
      description: `Add nums[${index}] (${value}) to build the first window: windowSum = ${windowSum}.`,
      codeLine: 7,
      variables: {
        i: index,
        "nums[i]": value,
        windowSum,
      },
      windowRange: {
        left: 0,
        right: index,
        size: k,
        enteringIndex: index,
        bestLeft: null,
        bestRight: null,
      },
    });
  }

  let best = windowSum;
  let bestLeft = 0;
  let bestRight = k - 1;
  let left = 0;

  steps.push({
    activeIndex: null,
    total: windowSum,
    description: `The first complete window has sum ${windowSum}, so best starts at ${best}.`,
    codeLine: 9,
    variables: {
      windowSum,
      best,
    },
    windowRange: {
      left,
      right: k - 1,
      size: k,
      bestLeft,
      bestRight,
    },
  });

  for (let right = k; right < values.length; right += 1) {
    const leavingIndex = right - k;
    const enteringValue = values[right] ?? 0;
    const leavingValue = values[leavingIndex] ?? 0;

    windowSum += enteringValue;
    steps.push({
      activeIndex: right,
      total: windowSum,
      description: `Slide right: add nums[${right}] (${enteringValue}) before removing the old left edge.`,
      codeLine: 11,
      variables: {
        right,
        "nums[right]": enteringValue,
        windowSum,
        best,
      },
      windowRange: {
        left,
        right,
        size: k,
        enteringIndex: right,
        leavingIndex,
        bestLeft,
        bestRight,
      },
    });

    windowSum -= leavingValue;
    left += 1;
    steps.push({
      activeIndex: leavingIndex,
      total: windowSum,
      description: `Remove nums[${leavingIndex}] (${leavingValue}); the current window is nums[${left}..${right}] with sum ${windowSum}.`,
      codeLine: 12,
      variables: {
        right,
        "right - k": leavingIndex,
        "nums[right - k]": leavingValue,
        windowSum,
        best,
      },
      windowRange: {
        left,
        right,
        size: k,
        leavingIndex,
        bestLeft,
        bestRight,
      },
    });

    if (windowSum > best) {
      best = windowSum;
      bestLeft = left;
      bestRight = right;
      steps.push({
        activeIndex: null,
        total: windowSum,
        description: `This window beats the previous best, so best becomes ${best}.`,
        codeLine: 14,
        variables: {
          right,
          windowSum,
          best,
        },
        windowRange: {
          left,
          right,
          size: k,
          bestLeft,
          bestRight,
        },
      });
    } else {
      steps.push({
        activeIndex: null,
        total: windowSum,
        description: `This window sum is ${windowSum}, so best stays ${best}.`,
        codeLine: 13,
        variables: {
          right,
          windowSum,
          best,
        },
        windowRange: {
          left,
          right,
          size: k,
          bestLeft,
          bestRight,
        },
      });
    }
  }

  steps.push({
    activeIndex: null,
    total: best,
    description: `Done. The best size-${k} window is nums[${bestLeft}..${bestRight}] with sum ${best}.`,
    codeLine: 17,
    variables: {
      best,
    },
    windowRange: {
      left: bestLeft,
      right: bestRight,
      size: k,
      bestLeft,
      bestRight,
    },
  });

  return steps;
}

export const slidingWindowLesson: TraceLessonDefinition = {
  slug: "sliding-window",
  title: "Sliding Window",
  stage: "Linear Data Structures",
  stageNumber: 2,
  module: "Arrays and Strings",
  moduleSlug: "arrays-and-strings",
  moduleOrder: 1,
  number: 5,
  lessonOrder: 3,
  description: "Expand and shrink a contiguous window to solve subarray and substring problems.",
  tags: ["O(n)", "bounds", "subarray"],
  available: true,
  routePath: "/lessons/sliding-window",
  traceCode: slidingWindowTraceCode,
  starterCode: slidingWindowStarterCode,
  exampleValues: [2, 1, 5, 1, 3, 2, 6],
  content: slidingWindowContent,
  buildSteps: buildSlidingWindowSteps,
  Visualizer: SlidingWindowVisualizer,
  PageComponent: LessonPage,
};