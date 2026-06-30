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

export interface LessonContent {
  learningGoals: string[];
  conceptSections: LessonConceptSection[];
  complexity: {
    time: string;
    timeReason: RichText;
    space: string;
    spaceReason: RichText;
  };
  commonMistakes: LessonMistake[];
  practice: {
    title: string;
    description: RichText;
    examples: LessonPracticeExample[];
  };
  reflectionPrompt: RichText;
}

export interface LessonPageProps<TExampleValues = unknown> {
  lesson: LessonDefinition<TExampleValues>;
}

export interface LessonDefinition<TExampleValues = number[]> extends LessonCardEntry {
  routePath: string;
  traceCode: string;
  starterCode: string;
  exampleValues: TExampleValues;
  content: LessonContent;
  buildSteps: (values: TExampleValues) => VisualizerStep[];
  Visualizer: ComponentType<LessonVisualizerProps<TExampleValues>>;
  PageComponent: ComponentType<LessonPageProps<TExampleValues>>;
}

export type RichTextRenderer = (content: RichText) => ReactNode;

