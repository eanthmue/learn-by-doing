import type { ComponentType, ReactNode } from "react";

export interface LessonCardEntry {
  slug: string;
  title: string;
  stage: string;
  stageNumber: number;
  module: string;
  moduleSlug: string;
  moduleOrder: number;
  number: number;
  lessonOrder: number;
  description: string;
  tags: string[];
  available: boolean;
}

export interface VisualizerStep {
  activeIndex: number | null;
  total: number;
  description: string;
  codeLine?: number;
  variables?: Record<string, string | number | boolean | null>;
  prefixValues?: Array<number | null>;
  prefixIndex?: number | null;
  queryRange?: {
    left: number;
    right: number;
    startPrefixIndex: number;
    endPrefixIndex: number;
    result?: number;
  };
  windowRange?: {
    left: number;
    right: number;
    size: number;
    enteringIndex?: number | null;
    leavingIndex?: number | null;
    bestLeft?: number | null;
    bestRight?: number | null;
  };
  wordWindow?: {
    chunks: Array<{
      index: number;
      start: number;
      value: string;
    }>;
    requiredCounts: Record<string, number>;
    windowCounts: Record<string, number>;
    offset: number;
    wordLength: number;
    leftStart: number;
    rightStart: number;
    matchedStarts: number[];
    activeStart?: number | null | undefined;
    enteringStart?: number | null | undefined;
    leavingStart?: number | null | undefined;
  };
  mapReduce?: {
    phase: "map" | "reduce" | "done";
    mappedValues: Array<number | null>;
    accumulator: number | null;
    activeMappedIndex: number | null;
  };
}

export interface LessonVisualizerProps<TExampleValues = number[]> {
  values: TExampleValues;
  steps: VisualizerStep[];
  stepIndex?: number;
  onStepIndexChange?: (index: number) => void;
}

export type TextSegment =
  | string
  | { code: string }
  | { strong: string }
  | { emphasis: string };

export type RichText = TextSegment[];

export interface LessonConceptSection {
  title?: string;
  paragraphs: RichText[];
  showArrayDiagram?: boolean;
  showGraphDiagram?: boolean;
  pattern?: string;
}

export interface LessonMistake {
  title: string;
  badCode: string;
  goodCode: string;
}

export interface LessonPracticeExample {
  input: string;
  output: string;
}

export interface LessonComplexity {
  time: string;
  timeReason: RichText;
  space: string;
  spaceReason: RichText;
}

export interface LessonContent {
  learningGoals: string[];
  conceptSections: LessonConceptSection[];
  complexity?: LessonComplexity;
  commonMistakes: LessonMistake[];
  practice: {
    title: string;
    description: RichText;
    examples: LessonPracticeExample[];
  };
  reflectionPrompt: RichText;
}

export interface AlgorithmLessonContent extends LessonContent {
  complexity: LessonComplexity;
}

export interface LessonPageProps<TExampleValues = unknown> {
  lesson: LessonDefinition<TExampleValues>;
}

export interface TraceVisualizerActivity<TExampleValues = unknown> {
  kind: "trace-visualizer";
  title?: string;
  traceCode: string;
  example: TExampleValues;
  buildSteps: (example: TExampleValues) => VisualizerStep[];
  Visualizer: ComponentType<LessonVisualizerProps<TExampleValues>>;
}

export interface CodeLabActivity {
  kind: "code-lab";
  title: string;
  starterCode: string;
  expectedOutput?: string[];
}

export interface DiagramActivity<TData = unknown> {
  kind: "diagram";
  title: string;
  diagramType: "array" | "graph" | "memory" | "request-flow" | "component-tree" | "custom";
  data: TData;
}

export interface QuizActivity {
  kind: "quiz";
  title: string;
  questions: Array<{
    prompt: RichText;
    choices: string[];
    correctChoiceIndex: number;
    explanation?: RichText;
  }>;
}

export interface ReflectionActivity {
  kind: "reflection";
  title: string;
  prompt: RichText;
}

export interface ReadingActivity {
  kind: "reading";
  title: string;
  sections: LessonConceptSection[];
}

export type LessonActivity<TExampleValues = unknown> =
  | TraceVisualizerActivity<TExampleValues>
  | CodeLabActivity
  | DiagramActivity
  | QuizActivity
  | ReflectionActivity
  | ReadingActivity;

export interface LessonDefinition<TExampleValues = number[]> extends LessonCardEntry {
  routePath: string;
  activities?: LessonActivity<TExampleValues>[];
  traceCode?: string;
  starterCode?: string;
  exampleValues?: TExampleValues;
  content: LessonContent;
  buildSteps?: (values: TExampleValues) => VisualizerStep[];
  Visualizer?: ComponentType<LessonVisualizerProps<TExampleValues>>;
  PageComponent: ComponentType<LessonPageProps<TExampleValues>>;
}

export interface TraceLessonDefinition<TExampleValues = number[]> extends LessonDefinition<TExampleValues> {
  traceCode: string;
  starterCode: string;
  exampleValues: TExampleValues;
  buildSteps: (values: TExampleValues) => VisualizerStep[];
  Visualizer: ComponentType<LessonVisualizerProps<TExampleValues>>;
}

export type RichTextRenderer = (content: RichText) => ReactNode;


