import type { ComponentType, ReactNode } from "react";

export interface LessonCardEntry {
  slug: string;
  title: string;
  module: string;
  number: number;
  description: string;
  tags: string[];
  available: boolean;
}

export interface VisualizerStep {
  activeIndex: number | null;
  total: number;
  description: string;
  prefixValues?: Array<number | null>;
  prefixIndex?: number | null;
  queryRange?: {
    left: number;
    right: number;
    startPrefixIndex: number;
    endPrefixIndex: number;
    result?: number;
  };
}

export interface LessonVisualizerProps {
  values: number[];
  steps: VisualizerStep[];
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

export interface LessonPageProps {
  lesson: LessonDefinition;
}

export interface LessonDefinition extends LessonCardEntry {
  routePath: string;
  starterCode: string;
  exampleValues: number[];
  content: LessonContent;
  buildSteps: (values: number[]) => VisualizerStep[];
  Visualizer: ComponentType<LessonVisualizerProps>;
  PageComponent: ComponentType<LessonPageProps>;
}

export type RichTextRenderer = (content: RichText) => ReactNode;
