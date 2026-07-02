import { LessonPage } from "../../LessonPage";
import { parseLessonMarkdown } from "../../markdown/parseLessonMarkdown";
import type { LessonDefinition, VisualizerStep } from "../../types";
import { MapReduceVisualizer } from "./MapReduceVisualizer";
import mapReduceMarkdown from "./mapReduce.md" with { type: "text" };

const mapReduceTraceCode = `function map(arr, transform) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(transform(arr[i]));
  }
  return result;
}

function reduce(arr, accumulate, initialValue) {
  let accumulator = initialValue;
  for (let i = 0; i < arr.length; i++) {
    accumulator = accumulate(accumulator, arr[i]);
  }
  return accumulator;
}`;

const mapReduceStarterCode = `// Trace how map() and reduce() are built under the hood.
function map(arr, transform) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(transform(arr[i]));
  }
  return result;
}

function reduce(arr, accumulate, initialValue) {
  let accumulator = initialValue;
  for (let i = 0; i < arr.length; i++) {
    accumulator = accumulate(accumulator, arr[i]);
  }
  return accumulator;
}

// Try it out
const numbers = [3, 1, 4];
const doubled = map(numbers, (x) => x * 2);
const totalSum = reduce(doubled, (sum, x) => sum + x, 0);

console.log("Original:", numbers);
console.log("Doubled:", doubled);
console.log("Sum of doubled:", totalSum);
`;

const mapReduceContent = parseLessonMarkdown(mapReduceMarkdown);

export function buildMapReduceSteps(values: number[]): VisualizerStep[] {
  const steps: VisualizerStep[] = [];
  const mappedValues: Array<number | null> = Array(values.length).fill(null);

  // 1. Initial Map Step
  steps.push({
    activeIndex: null,
    total: 0,
    description: "Start the mapping phase to transform each element by doubling it.",
    codeLine: 2,
    variables: {
      result: "[]",
    },
    mapReduce: {
      phase: "map",
      mappedValues: [...mappedValues],
      accumulator: null,
      activeMappedIndex: null,
    },
  });

  // 2. Map Loop Steps
  values.forEach((value, index) => {
    const transformed = value * 2;
    mappedValues[index] = transformed;
    steps.push({
      activeIndex: index,
      total: 0,
      description: `Transform element arr[${index}] (${value}) using x * 2 -> ${transformed}.`,
      codeLine: 4,
      variables: {
        i: index,
        "arr[i]": value,
        "transform(arr[i])": transformed,
        result: `[${mappedValues.slice(0, index + 1).join(", ")}]`,
      },
      mapReduce: {
        phase: "map",
        mappedValues: [...mappedValues],
        accumulator: null,
        activeMappedIndex: null,
      },
    });
  });

  // 3. Transition to Reduce Step
  steps.push({
    activeIndex: null,
    total: 0,
    description: "Mapping complete. Initialize reduce with starting accumulator value 0.",
    codeLine: 10,
    variables: {
      accumulator: 0,
      initialValue: 0,
    },
    mapReduce: {
      phase: "reduce",
      mappedValues: [...mappedValues],
      accumulator: 0,
      activeMappedIndex: null,
    },
  });

  // 4. Reduce Loop Steps
  let runningTotal = 0;
  mappedValues.forEach((val, index) => {
    if (val === null) return;
    const prev = runningTotal;
    runningTotal += val;
    steps.push({
      activeIndex: null,
      total: runningTotal,
      description: `Add mapped[${index}] (${val}) to the accumulator (${prev}) -> ${runningTotal}.`,
      codeLine: 12,
      variables: {
        i: index,
        "mapped[i]": val,
        previousAccumulator: prev,
        accumulator: runningTotal,
      },
      mapReduce: {
        phase: "reduce",
        mappedValues: [...mappedValues],
        accumulator: runningTotal,
        activeMappedIndex: index,
      },
    });
  });

  // 5. Final Step
  steps.push({
    activeIndex: null,
    total: runningTotal,
    description: `Done! Sum of all doubled values is ${runningTotal}.`,
    codeLine: 14,
    variables: {
      total: runningTotal,
    },
    mapReduce: {
      phase: "done",
      mappedValues: [...mappedValues],
      accumulator: runningTotal,
      activeMappedIndex: null,
    },
  });

  return steps;
}

export const mapReduceLesson: LessonDefinition = {
  slug: "map-reduce",
  title: "Map and Reduce",
  stage: "Linear Data Structures",
  stageNumber: 2,
  module: "Arrays and Strings",
  moduleSlug: "arrays-and-strings",
  moduleOrder: 1,
  number: 9,
  lessonOrder: 7,
  description: "Transform each value, then combine the transformed values into one answer.",
  tags: ["O(n)", "transform", "accumulator", "aggregation"],
  available: true,
  routePath: "/lessons/map-reduce",
  traceCode: mapReduceTraceCode,
  starterCode: mapReduceStarterCode,
  exampleValues: [3, 1, 4],
  content: mapReduceContent,
  buildSteps: buildMapReduceSteps,
  Visualizer: MapReduceVisualizer,
  PageComponent: LessonPage,
};
