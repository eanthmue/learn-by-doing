import { LessonPage } from "../LessonPage";
import type { LessonContent, LessonDefinition, VisualizerStep } from "../types";
import { ArrayTraversalVisualizer } from "../visualizers/ArrayTraversalVisualizer";

const arrayTraversalStarterCode = `function sum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}

function max(arr) {
  let best = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > best) {
      best = arr[i];
    }
  }
  return best;
}

function countByPredicate(arr, predicate) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) {
      count += 1;
    }
  }
  return count;
}

// Try it out
const numbers = [4, 7, 2, 9, 1];

console.log("Sum:", sum(numbers));
console.log("Max:", max(numbers));
console.log("Evens:", countByPredicate(
  numbers, (value) => value % 2 === 0
));`;

const arrayTraversalContent: LessonContent = {
  learningGoals: [
    "Explain what an array index is and how it maps to a position.",
    "Traverse an array from start to end using a for loop and track a running result.",
    "Apply a predicate function during traversal to count or filter values.",
    "Predict the output of a traversal given a specific input array.",
  ],
  conceptSections: [
    {
      paragraphs: [
        [
          "An ",
          { strong: "array" },
          " is an ordered list of values. Each value sits at a numbered position called an ",
          { strong: "index" },
          ". In JavaScript, the first index is ",
          { code: "0" },
          ", the second is ",
          { code: "1" },
          ", and so on up to ",
          { code: "length - 1" },
          ".",
        ],
      ],
      showArrayDiagram: true,
    },
    {
      paragraphs: [
        [
          { strong: "Traversal" },
          " means visiting every element exactly once, usually from index ",
          { code: "0" },
          " to the last index. During the visit you can read each value and combine it into a result: a sum, a maximum, a count, or a new array.",
        ],
      ],
      pattern: `let result = <initial value>
for each index i from 0 to length - 1:
    update result using array[i]
return result`,
    },
    {
      title: "When to use it",
      paragraphs: [
        [
          "Use a single-pass traversal whenever the answer depends on ",
          { emphasis: "every element" },
          " and each element can be processed independently. If you only need part of the array or elements depend on far-away positions, a different pattern such as sliding window or two pointers may be more efficient, but traversal is almost always the first tool to reach for.",
        ],
      ],
    },
    {
      title: "The invariant",
      paragraphs: [
        [
          "At the end of iteration ",
          { code: "i" },
          ", ",
          { code: "result" },
          " reflects the correct answer for the sub-array ",
          { code: "array[0..i]" },
          ". When ",
          { code: "i" },
          " reaches ",
          { code: "length - 1" },
          ", ",
          { code: "result" },
          " holds the answer for the entire array.",
        ],
      ],
    },
  ],
  complexity: {
    time: "O(n)",
    timeReason: ["The loop visits each of the ", { code: "n" }, " elements exactly once."],
    space: "O(1)",
    spaceReason: ["Only a single accumulator variable is stored regardless of input size."],
  },
  commonMistakes: [
    {
      title: "Off-by-one on the loop bound",
      badCode: "for (let i = 0; i < arr.length - 1; i++)",
      goodCode: "for (let i = 0; i < arr.length; i++)",
    },
    {
      title: "Wrong initial value for max",
      badCode: "let best = 0; // stays 0 if all values are negative",
      goodCode: "let best = -Infinity;",
    },
    {
      title: "Using index when you mean value",
      badCode: "total += i; // adds indices, not values",
      goodCode: "total += arr[i];",
    },
  ],
  practice: {
    title: "Count values greater than a threshold",
    description: [
      "Write a function ",
      { code: "countAbove(arr, threshold)" },
      " that returns how many values are ",
      { strong: "strictly greater than" },
      " ",
      { code: "threshold" },
      ".",
    ],
    examples: [
      { input: "countAbove([3, 8, 1, 10, 5], 4)", output: "3" },
      { input: "countAbove([1, 2, 3], 10)", output: "0" },
      { input: "countAbove([], 5)", output: "0" },
      { input: "countAbove([7, 7, 7], 7)", output: "0" },
    ],
  },
  reflectionPrompt: [
    "In your own words, explain why the initial value of the accumulator matters. What would go wrong if you initialized ",
    { code: "max" },
    " to ",
    { code: "0" },
    " and the input array contained only negative numbers?",
  ],
};

function buildArrayTraversalSteps(values: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = [
    { activeIndex: null, total: 0, description: "Initialize total = 0" },
  ];
  let running = 0;

  values.forEach((value, index) => {
    running += value;
    steps.push({
      activeIndex: index,
      total: running,
      description: `total += arr[${index}] (${value}) -> ${running}`,
    });
  });

  steps.push({
    activeIndex: null,
    total: running,
    description: `Done. Sum = ${running}`,
  });

  return steps;
}

export const arrayTraversalLesson: LessonDefinition = {
  slug: "array-traversal",
  title: "Array Traversal and Indexing",
  stage: "Linear Data Structures",
  stageNumber: 2,
  module: "Arrays and Strings",
  moduleSlug: "arrays-and-strings",
  moduleOrder: 1,
  number: 3,
  lessonOrder: 1,
  description:
    "Learn to visit every element in an array, track a running result, and apply predicates during traversal.",
  tags: ["O(n)", "for loop", "accumulator"],
  available: true,
  routePath: "/lessons/array-traversal",
  starterCode: arrayTraversalStarterCode,
  exampleValues: [4, 7, 2, 9, 1],
  content: arrayTraversalContent,
  buildSteps: buildArrayTraversalSteps,
  Visualizer: ArrayTraversalVisualizer,
  PageComponent: LessonPage,
};