import { LessonPage } from "../LessonPage";
import type { LessonContent, LessonDefinition, VisualizerStep } from "../types";
import { PrefixSumsVisualizer } from "../visualizers/PrefixSumsVisualizer";

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

function answerRangeQueries(nums, queries) {
  const prefix = buildPrefixSums(nums);
  return queries.map(([left, right]) => rangeSum(prefix, left, right));
}

// Try it out
const nums = [3, -2, 5, 1, 6];
const prefix = buildPrefixSums(nums);

console.log("Prefix:", prefix);
console.log("Sum nums[1..3]:", rangeSum(prefix, 1, 3));
console.log("Queries:", answerRangeQueries(nums, [[0, 2], [2, 4], [1, 1]]));`;

const prefixSumsContent: LessonContent = {
  learningGoals: [
    "Build a prefix sum array from left to right using a running total.",
    "Explain why prefix sums include an extra leading zero.",
    "Answer inclusive range-sum queries with one subtraction.",
    "Choose prefix sums when many queries reuse the same input array.",
  ],
  conceptSections: [
    {
      paragraphs: [
        [
          "A ",
          { strong: "prefix sum" },
          " array stores the total before each position. If ",
          { code: "prefix[i]" },
          " is the sum of everything before index ",
          { code: "i" },
          ", then ",
          { code: "prefix[i + 1]" },
          " becomes ",
          { code: "prefix[i] + nums[i]" },
          ".",
        ],
      ],
      showArrayDiagram: true,
    },
    {
      title: "Why the leading zero matters",
      paragraphs: [
        [
          "The extra ",
          { code: "0" },
          " at the front means every range can use the same formula, even ranges that start at index ",
          { code: "0" },
          ". The sum from ",
          { code: "left" },
          " to ",
          { code: "right" },
          " is ",
          { code: "prefix[right + 1] - prefix[left]" },
          ".",
        ],
      ],
      pattern: `prefix = [0]
for each index i from 0 to length - 1:
    prefix[i + 1] = prefix[i] + nums[i]

sum(left, right) = prefix[right + 1] - prefix[left]`,
    },
    {
      title: "When to use it",
      paragraphs: [
        [
          "Use prefix sums when the input array stays the same but you need to answer multiple range queries. You pay one ",
          { code: "O(n)" },
          " preprocessing pass, then each query is ",
          { code: "O(1)" },
          ".",
        ],
      ],
    },
    {
      title: "The invariant",
      paragraphs: [
        [
          "After processing index ",
          { code: "i" },
          ", ",
          { code: "prefix[i + 1]" },
          " equals the sum of ",
          { code: "nums[0..i]" },
          ". That invariant makes the difference between two prefix cells exactly equal to the values between them.",
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
    spaceReason: ["The prefix array stores one extra number for each input position plus the leading ", { code: "0" }, "."],
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
      prefixValues: [...prefixValues],
      prefixIndex: index + 1,
    });
  });

  const query = {
    left: 1,
    right: Math.min(3, Math.max(0, values.length - 1)),
    startPrefixIndex: 1,
    endPrefixIndex: Math.min(4, values.length),
  };
  const result = (prefixValues[query.endPrefixIndex] ?? 0) - (prefixValues[query.startPrefixIndex] ?? 0);

  steps.push({
    activeIndex: null,
    total: running,
    description: `To sum nums[${query.left}..${query.right}], subtract the prefix before the range from the prefix after it.`,
    prefixValues: [...prefixValues],
    prefixIndex: null,
    queryRange: query,
  });

  steps.push({
    activeIndex: null,
    total: result,
    description: `prefix[${query.endPrefixIndex}] (${prefixValues[query.endPrefixIndex]}) - prefix[${query.startPrefixIndex}] (${prefixValues[query.startPrefixIndex]}) = ${result}.`,
    prefixValues: [...prefixValues],
    prefixIndex: null,
    queryRange: { ...query, result },
  });

  return steps;
}

export const prefixSumsLesson: LessonDefinition = {
  slug: "prefix-sums",
  title: "Prefix Sums",
  module: "Arrays & Strings",
  number: 2,
  description: "Build a running total array and answer range-sum queries in constant time.",
  tags: ["O(n)", "precompute", "range query"],
  available: true,
  routePath: "/lessons/prefix-sums",
  starterCode: prefixSumsStarterCode,
  exampleValues: [3, -2, 5, 1, 6],
  content: prefixSumsContent,
  buildSteps: buildPrefixSumSteps,
  Visualizer: PrefixSumsVisualizer,
  PageComponent: LessonPage,
};