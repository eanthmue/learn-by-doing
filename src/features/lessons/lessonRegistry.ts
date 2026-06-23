import { arrayTraversalLesson } from "./lessons/arrayTraversal";
import { prefixSumsLesson } from "./lessons/prefixSums";
import type { LessonCardEntry, LessonDefinition } from "./types";

const comingSoonLessons: LessonCardEntry[] = [
  {
    slug: "sliding-window",
    title: "Sliding Window",
    module: "Arrays & Strings",
    number: 3,
    description: "Expand and shrink a window over contiguous elements to find optimal subranges.",
    tags: ["O(n)", "two bounds", "max sum"],
    available: false,
  },
  {
    slug: "two-pointers",
    title: "Two Pointers",
    module: "Arrays & Strings",
    number: 4,
    description: "Converge two pointers from opposite ends to solve pair-based problems.",
    tags: ["O(n)", "sorted input", "pair sum"],
    available: false,
  },
  {
    slug: "string-frequency",
    title: "String Frequency Maps",
    module: "Arrays & Strings",
    number: 5,
    description: "Count character frequencies to solve anagram and uniqueness problems.",
    tags: ["O(n)", "hash map", "counting"],
    available: false,
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    module: "Sorting & Searching",
    number: 6,
    description: "Halve the search space each step to find values in logarithmic time.",
    tags: ["O(log n)", "sorted", "divide"],
    available: false,
  },
  {
    slug: "stack-basics",
    title: "Stack Basics",
    module: "Stacks & Queues",
    number: 7,
    description: "Push, pop, and match - use a stack for parsing, history, and balanced structures.",
    tags: ["LIFO", "O(n)", "parentheses"],
    available: false,
  },
];

export const availableLessons: LessonDefinition[] = [
  arrayTraversalLesson,
  prefixSumsLesson,
];

export const lessonCards: LessonCardEntry[] = [
  ...availableLessons,
  ...comingSoonLessons,
].sort((a, b) => a.number - b.number);

export function getLessonByPath(path: string): LessonDefinition | undefined {
  return availableLessons.find((lesson) => lesson.routePath === path);
}