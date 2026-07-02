import { LessonPage } from "../../LessonPage";
import { parseLessonMarkdown } from "../../markdown/parseLessonMarkdown";
import type { TraceLessonDefinition, VisualizerStep } from "../../types";
import prefixSumsMarkdown from "./prefixSums.md" with { type: "text" };
import { PrefixSumsVisualizer } from "./PrefixSumsVisualizer";


const prefixSumsTraceCode = `function buildPrefixSums(nums) {
  const prefix = [0];

  for (let i = 0; i < nums.length; i++) {
    prefix.push(prefix[i] + nums[i]);
  }

  return prefix;
}

function rangeSum(prefix, left, right) {
  return prefix[right + 1] - prefix[left];
}`;

const prefixSumsStarterCode = `function buildPrefixSums(nums) {
  const prefix = [0];

  for (let i = 0; i < nums.length; i++) {
    prefix.push(prefix[i] + nums[i]);
  }

  return prefix;
}

function rangeSum(prefix, left, right) {
  return prefix[right + 1] - prefix[left];
}

function rangeSums(nums, queries) {
  const prefix = buildPrefixSums(nums);
  return queries.map(([left, right]) => rangeSum(prefix, left, right));
}

// Try it out
const nums = [3, -2, 5, 1, 6];
const prefix = buildPrefixSums(nums);

console.log("Prefix:", prefix);
console.log("Sum nums[1..3]:", rangeSum(prefix, 1, 3));
console.log("Queries:", rangeSums(nums, [[0, 2], [2, 4], [1, 1]]));`;

const prefixSumsContent = parseLessonMarkdown(prefixSumsMarkdown);

function buildPrefixSumSteps(values: number[]): VisualizerStep[] {
  const prefixValues: Array<number | null> = Array(values.length + 1).fill(null);
  prefixValues[0] = 0;
  const steps: VisualizerStep[] = [
    {
      activeIndex: null,
      total: 0,
      description: "Start with prefix[0] = 0 before reading any values.",
      codeLine: 2,
      variables: {
        prefix: "[0]",
        running: 0,
      },
      prefixValues: [...prefixValues],
      prefixIndex: 0,
    },
  ];
  let running = 0;

  values.forEach((value, index) => {
    const previous = running;
    running += value;
    prefixValues[index + 1] = running;
    steps.push({
      activeIndex: index,
      total: running,
      description: `prefix[${index + 1}] = prefix[${index}] (${previous}) + nums[${index}] (${value}) -> ${running}`,
      codeLine: 5,
      variables: {
        i: index,
        "nums[i]": value,
        "prefix[i]": previous,
        "prefix[i + 1]": running,
      },
      prefixValues: [...prefixValues],
      prefixIndex: index + 1,
    });
  });

  if (values.length === 0) {
    steps.push({
      activeIndex: null,
      total: 0,
      description: "No values means there is no valid inclusive range to query; the prefix array is [0].",
      variables: {
        prefix: "[0]",
        result: 0,
      },
      prefixValues: [...prefixValues],
      prefixIndex: null,
    });

    return steps;
  }

  const queryLeft = values.length > 3 ? 1 : 0;
  const queryRight = values.length > 3 ? 3 : values.length - 1;
  const query = {
    left: queryLeft,
    right: queryRight,
    startPrefixIndex: queryLeft,
    endPrefixIndex: queryRight + 1,
  };
  const result = (prefixValues[query.endPrefixIndex] ?? 0) - (prefixValues[query.startPrefixIndex] ?? 0);

  steps.push({
    activeIndex: null,
    total: running,
    description: `To sum nums[${query.left}..${query.right}], subtract the prefix before the range from the prefix after it.`,
    codeLine: 12,
    variables: {
      left: query.left,
      right: query.right,
      "prefix[left]": prefixValues[query.startPrefixIndex] ?? "?",
      "prefix[right + 1]": prefixValues[query.endPrefixIndex] ?? "?",
    },
    prefixValues: [...prefixValues],
    prefixIndex: null,
    queryRange: query,
  });

  steps.push({
    activeIndex: null,
    total: result,
    description: `prefix[${query.endPrefixIndex}] (${prefixValues[query.endPrefixIndex]}) - prefix[${query.startPrefixIndex}] (${prefixValues[query.startPrefixIndex]}) = ${result}.`,
    codeLine: 12,
    variables: {
      left: query.left,
      right: query.right,
      result,
    },
    prefixValues: [...prefixValues],
    prefixIndex: null,
    queryRange: { ...query, result },
  });

  return steps;
}
export const prefixSumsLesson: TraceLessonDefinition = {
  slug: "prefix-sums",
  title: "Prefix Sums",
  stage: "Linear Data Structures",
  stageNumber: 2,
  module: "Arrays and Strings",
  moduleSlug: "arrays-and-strings",
  moduleOrder: 1,
  number: 4,
  lessonOrder: 2,
  description: "Build a running total array and answer range-sum queries in constant time.",
  tags: ["O(n)", "precompute", "range query"],
  available: true,
  routePath: "/lessons/prefix-sums",
  traceCode: prefixSumsTraceCode,
  starterCode: prefixSumsStarterCode,
  exampleValues: [3, -2, 5, 1, 6],
  content: prefixSumsContent,
  buildSteps: buildPrefixSumSteps,
  Visualizer: PrefixSumsVisualizer,
  PageComponent: LessonPage,
};
