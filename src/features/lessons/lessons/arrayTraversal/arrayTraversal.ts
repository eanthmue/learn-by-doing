import { LessonPage } from "../../LessonPage";
import { parseLessonMarkdown } from "../../markdown/parseLessonMarkdown";
import type { LessonDefinition, VisualizerStep } from "../../types";
import { ArrayTraversalVisualizer } from "./ArrayTraversalVisualizer";
import arrayTraversalMarkdown from "./arrayTraversal.md" with { type: "text" };


const arrayTraversalTraceCode = `function sum(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    total += arr[i];
  }
  return total;
}`;

const arrayTraversalStarterCode = `// Note: The visualizer panel to the right traces the execution of this sum function step-by-step.
function sum(arr) {
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

const arrayTraversalContent = parseLessonMarkdown(arrayTraversalMarkdown);

function buildArrayTraversalSteps(values: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = [
    {
      activeIndex: null,
      total: 0,
      description: "Initialize total = 0",
      codeLine: 2,
      variables: { total: 0 },
    },
  ];
  let running = 0;

  values.forEach((value, index) => {
    running += value;
    steps.push({
      activeIndex: index,
      total: running,
      description: `total += arr[${index}] (${value}) -> ${running}`,
      codeLine: 4,
      variables: {
        i: index,
        "arr[i]": value,
        total: running,
      },
    });
  });

  steps.push({
    activeIndex: null,
    total: running,
    description: `Done. Sum = ${running}`,
    codeLine: 6,
    variables: { total: running },
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
  traceCode: arrayTraversalTraceCode,
  starterCode: arrayTraversalStarterCode,
  exampleValues: [4, 7, 2, 9, 1],
  content: arrayTraversalContent,
  buildSteps: buildArrayTraversalSteps,
  Visualizer: ArrayTraversalVisualizer,
  PageComponent: LessonPage,
};
