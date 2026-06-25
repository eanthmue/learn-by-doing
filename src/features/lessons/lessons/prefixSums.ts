import { LessonPage } from "../LessonPage";
import type { LessonContent, LessonDefinition, VisualizerStep } from "../types";
import { PrefixSumsVisualizer } from "../visualizers/PrefixSumsVisualizer";

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

const prefixSumsContent: LessonContent = {
  learningGoals: [
    "Build a prefix sum array from left to right using a running total.",
    "Explain why prefix sums include an extra leading zero.",
    "Answer inclusive range-sum queries with one subtraction.",
    "Choose prefix sums when many queries reuse the same input array.",
  ],
  conceptSections: [
    {
      title: "What is a Prefix Sum?",
      paragraphs: [
        [
          "Think of a prefix sum array as a running total of your numbers, but shifted by one position."
        ],
        [
          "If your input array is ",
          { code: "nums = [3, -2, 5, 1, 6]" },
          ":"
        ],
        [
          "• Before you look at any numbers, your total is ",
          { code: "0" },
          "."
        ],
        [
          "• After adding ",
          { code: "3" },
          ", your total is ",
          { code: "3" },
          "."
        ],
        [
          "• After adding ",
          { code: "-2" },
          ", your total is ",
          { code: "1" },
          " (",
          { code: "3 + (-2)" },
          ")."
        ],
        [
          "• After adding ",
          { code: "5" },
          ", your total is ",
          { code: "6" },
          " (",
          { code: "1 + 5" },
          "), and so on."
        ],
        [
          "When you build the prefix array, you store these running totals. It looks like this:"
        ],
        [
          { code: "prefix = [0, 3, 1, 6, 7, 13]" }
        ],
      ],
      showArrayDiagram: true,
    },
    {
      title: "Why the Leading Zero is Necessary",
      paragraphs: [
        [
          "The extra ",
          { code: "0" },
          " at the very beginning is a clever design choice to prevent your code from crashing or needing extra if/else statements when querying ranges."
        ],
        [
          "Notice the mapping between the arrays:"
        ],
        [
          "• ", { code: "prefix[0]" }, " = Sum of the first 0 elements (always 0)"
        ],
        [
          "• ", { code: "prefix[1]" }, " = Sum of the first 1 element (3)"
        ],
        [
          "• ", { code: "prefix[2]" }, " = Sum of the first 2 elements (3 + -2 = 1)"
        ],
        [
          "• ", { code: "prefix[5]" }, " = Sum of the first 5 elements (the whole array = 13)"
        ],
        [
          "Because of this shift, ",
          { code: "prefix[i]" },
          " always represents the sum of everything before index ",
          { code: "i" },
          ". The sum from ",
          { code: "left" },
          " to ",
          { code: "right" },
          " is ",
          { code: "prefix[right + 1] - prefix[left]" },
          "."
        ],
      ],
      pattern: `prefix = [0]
for each index i from 0 to length - 1:
    prefix[i + 1] = prefix[i] + nums[i]

sum(left, right) = prefix[right + 1] - prefix[left]`,
    },
    {
      title: "The Problem It Solves",
      paragraphs: [
        [
          "Imagine you have an array of 1,000,000 numbers, and you are asked to find the sum of elements from index 100,000 to 800,000."
        ],
        [
          { strong: "The Naive Way" },
          ": You run a for loop from 100,000 to 800,000 and add them up. If you only have to do this once, a loop is fine."
        ],
        [
          { strong: "The Scalability Issue" },
          ": What if your application needs to answer 100,000 different range queries on that same array? Running a loop every single time means your code will slow down to a crawl."
        ],
      ],
    },
    {
      title: "The Tradeoff (Time vs. Space)",
      paragraphs: [
        [
          { strong: "Upfront Cost" },
          ": You loop through the array exactly once to build the prefix array. This takes ",
          { code: "O(n)" },
          " time and ",
          { code: "O(n)" },
          " extra space to store the results."
        ],
        [
          { strong: "The Payoff" },
          ": Once that prefix array is built, you throw away the loops entirely. For every future query, you just look up two numbers in the array and subtract them (",
          { code: "prefix[right + 1] - prefix[left]" },
          ")."
        ],
        [
          "Because array lookups and subtraction take a constant fraction of a second, every single query now runs in ",
          { code: "O(1)" },
          " constant time."
        ],
      ],
    },
    {
      title: "A Quick Rule of Thumb",
      paragraphs: [
        [
          "You should use a prefix sum if your scenario meets these two conditions:"
        ],
        [
          "• ",
          { strong: "The data is static" },
          ": The numbers in the original array aren't changing (if elements change constantly, your prefix array becomes outdated and you have to rebuild it)."
        ],
        [
          "• ",
          { strong: "High query volume" },
          ": You need to ask \"what is the sum of this sub-range?\" multiple times."
        ],
        [
          "If you are only asking for a sum once, just use a normal loop. If you are asking many times, prefix sum is the clear winner."
        ],
      ],
    },
  ],
  complexity: {
    time: "O(n + q)",
    timeReason: [
      "Building the prefix array visits ",
      { code: "n" },
      " values once, then each of the ",
      { code: "q" },
      " range queries takes constant time.",
    ],
    space: "O(n)",
    spaceReason: ["The prefix array stores one number for each input position, plus an extra leading ", { code: "0" }, "."],
  },
  commonMistakes: [
    {
      title: "Forgetting the extra leading zero",
      badCode: "prefix[0] = nums[0];",
      goodCode: "const prefix = [0];",
    },
    {
      title: "Using right instead of right + 1",
      badCode: "return prefix[right] - prefix[left];",
      goodCode: "return prefix[right + 1] - prefix[left];",
    },
    {
      title: "Rebuilding prefix for every query",
      badCode: "queries.map((query) => rangeSum(buildPrefixSums(nums), query[0], query[1]))",
      goodCode: "const prefix = buildPrefixSums(nums);",
    },
  ],
  practice: {
    title: "Answer many range-sum queries",
    description: [
      "Write a function ",
      { code: "rangeSums(nums, queries)" },
      " that returns an array of sums. Each query is a pair ",
      { code: "[left, right]" },
      " and both endpoints are included.",
    ],
    examples: [
      { input: "rangeSums([3, -2, 5, 1, 6], [[1, 3]])", output: "[4]" },
      { input: "rangeSums([2, 4, 6], [[0, 2], [1, 1]])", output: "[12, 4]" },
      { input: "rangeSums([], [])", output: "[]" },
      { input: "rangeSums([5], [[0, 0]])", output: "[5]" },
    ],
  },
  reflectionPrompt: [
    "Why does ",
    { code: "prefix[right + 1] - prefix[left]" },
    " remove exactly the values before ",
    { code: "left" },
    " while keeping the values through ",
    { code: "right" },
    "?",
  ],
};

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
export const prefixSumsLesson: LessonDefinition = {
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
