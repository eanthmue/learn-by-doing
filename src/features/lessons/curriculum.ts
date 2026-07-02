import type { LessonCardEntry } from "./types";

export type CurriculumLessonMetadata = Omit<LessonCardEntry, "available">;

export interface CurriculumModule {
  slug: string;
  title: string;
  order: number;
  summary: string;
  lessons: CurriculumLessonMetadata[];
}

export interface CurriculumStage {
  slug: string;
  title: string;
  number: number;
  summary: string;
  modules: CurriculumModule[];
}

function lesson(
  metadata: Omit<CurriculumLessonMetadata, "stage" | "stageNumber" | "module" | "moduleSlug" | "moduleOrder">,
  stage: Pick<CurriculumStage, "title" | "number">,
  module: Pick<CurriculumModule, "title" | "slug" | "order">,
): CurriculumLessonMetadata {
  return {
    ...metadata,
    stage: stage.title,
    stageNumber: stage.number,
    module: module.title,
    moduleSlug: module.slug,
    moduleOrder: module.order,
  };
}

function module(
  stage: Pick<CurriculumStage, "title" | "number">,
  moduleInfo: Omit<CurriculumModule, "lessons">,
  lessons: Array<Omit<CurriculumLessonMetadata, "stage" | "stageNumber" | "module" | "moduleSlug" | "moduleOrder">>,
): CurriculumModule {
  return {
    ...moduleInfo,
    lessons: lessons.map((entry) => lesson(entry, stage, moduleInfo)),
  };
}

const foundations = { title: "The Foundations", number: 1 };
const linearDataStructures = { title: "Linear Data Structures", number: 2 };
const sortingSearchingHashing = { title: "Sorting, Searching, and Hashing", number: 3 };
const nonLinearDataStructures = { title: "Non-Linear Data Structures", number: 4 };
const advancedPatterns = { title: "Advanced Algorithmic Patterns", number: 5 };

export const curriculumStages: CurriculumStage[] = [
  {
    slug: "foundations",
    title: foundations.title,
    number: foundations.number,
    summary: "Measure efficiency, reason about growth, and understand recursive control flow before using bigger structures.",
    modules: [
      module(
        foundations,
        {
          slug: "complexity-and-recursion",
          title: "Complexity and Recursion",
          order: 1,
          summary: "Big O, space usage, call stacks, base cases, and recursive cases.",
        },
        [
          {
            slug: "asymptotic-analysis",
            title: "Asymptotic Analysis",
            number: 1,
            lessonOrder: 1,
            description: "Compare algorithms by time and space growth across best, average, and worst cases.",
            tags: ["Big O", "time", "space"],
          },
          {
            slug: "recursion-fundamentals",
            title: "Recursion Fundamentals",
            number: 2,
            lessonOrder: 2,
            description: "Trace stack frames, base cases, recursive cases, and tail-recursive shape.",
            tags: ["stack", "base case", "call tree"],
          },
        ],
      ),
    ],
  },
  {
    slug: "linear-data-structures",
    title: linearDataStructures.title,
    number: linearDataStructures.number,
    summary: "Work with data stored in sequence, where indexes, neighbors, and pointer movement matter.",
    modules: [
      module(
        linearDataStructures,
        {
          slug: "arrays-and-strings",
          title: "Arrays and Strings",
          order: 1,
          summary: "Indexed data, 2D arrays, strings, scanning, two pointers, sliding windows, and prefix sums.",
        },
        [
          {
            slug: "array-traversal",
            title: "Array Traversal and Indexing",
            number: 3,
            lessonOrder: 1,
            description: "Visit every element, track a running result, and read index/value relationships clearly.",
            tags: ["O(n)", "for loop", "accumulator"],
          },
          {
            slug: "prefix-sums",
            title: "Prefix Sums",
            number: 4,
            lessonOrder: 2,
            description: "Build a running total array and answer range-sum queries in constant time.",
            tags: ["O(n)", "precompute", "range query"],
          },
          {
            slug: "sliding-window",
            title: "Sliding Window",
            number: 5,
            lessonOrder: 3,
            description: "Expand and shrink a contiguous window to solve subarray and substring problems.",
            tags: ["O(n)", "bounds", "subarray"],
          },
          {
            slug: "sliding-window-word-frequency",
            title: "Sliding Window with Word Frequencies",
            number: 6,
            lessonOrder: 4,
            description: "Scan a fixed-width event stream for a required bundle of words using window frequency counts.",
            tags: ["O(n)", "hash map", "substring"],
          },
          {
            slug: "two-pointers",
            title: "Two Pointers",
            number: 7,
            lessonOrder: 5,
            description: "Move two indexes together to remove impossible pairs and converge on an answer.",
            tags: ["O(n)", "sorted input", "pair sum"],
          },
          {
            slug: "string-frequency",
            title: "String Frequency Maps",
            number: 8,
            lessonOrder: 6,
            description: "Count characters to solve anagram, uniqueness, and first-occurrence questions.",
            tags: ["O(n)", "hash map", "counting"],
          },
          {
            slug: "map-reduce",
            title: "Map and Reduce",
            number: 9,
            lessonOrder: 7,
            description: "Transform each value, then combine the transformed values into one answer.",
            tags: ["O(n)", "transform", "accumulator", "aggregation"],
          },
        ],
      ),
      module(
        linearDataStructures,
        {
          slug: "linked-lists",
          title: "Linked Lists",
          order: 2,
          summary: "Singly, doubly, and circular linked lists with insertion, deletion, reversal, and cycle checks.",
        },
        [
          {
            slug: "linked-list-traversal",
            title: "Singly Linked List Traversal",
            number: 10,
            lessonOrder: 1,
            description: "Advance a current pointer through nodes while preserving traversal safety.",
            tags: ["nodes", "next", "O(n)"],
          },
          {
            slug: "linked-list-insert-delete",
            title: "Insert and Delete Nodes",
            number: 11,
            lessonOrder: 2,
            description: "Rewire next pointers in the right order for insertion and deletion operations.",
            tags: ["pointers", "mutation", "references"],
          },
          {
            slug: "fast-slow-pointers",
            title: "Fast and Slow Pointers",
            number: 12,
            lessonOrder: 3,
            description: "Use two moving references to find middles and detect cycles.",
            tags: ["cycle", "middle", "tortoise hare"],
          },
        ],
      ),
      module(
        linearDataStructures,
        {
          slug: "stacks-and-queues",
          title: "Stacks and Queues",
          order: 3,
          summary: "LIFO and FIFO structures for parsing, history, backtracking, and breadth-first processing.",
        },
        [
          {
            slug: "stack-basics",
            title: "Stack Basics",
            number: 13,
            lessonOrder: 1,
            description: "Push, pop, and peek values from the same end to model nested state.",
            tags: ["LIFO", "parsing", "backtracking"],
          },
          {
            slug: "queue-basics",
            title: "Queue Basics",
            number: 14,
            lessonOrder: 2,
            description: "Enqueue at the back and dequeue from the front to process work in arrival order.",
            tags: ["FIFO", "deque", "simulation"],
          },
          {
            slug: "priority-queue-basics",
            title: "Priority Queue Basics",
            number: 15,
            lessonOrder: 3,
            description: "Select the next item by priority instead of insertion order.",
            tags: ["priority", "heap", "selection"],
          },
        ],
      ),
    ],
  },
  {
    slug: "sorting-searching-hashing",
    title: sortingSearchingHashing.title,
    number: sortingSearchingHashing.number,
    summary: "Use search, ordering, and hashing as utility mechanisms for larger algorithms.",
    modules: [
      module(
        sortingSearchingHashing,
        {
          slug: "searching",
          title: "Searching",
          order: 1,
          summary: "Linear search, binary search, and searching over a sorted answer space.",
        },
        [
          {
            slug: "linear-search",
            title: "Linear Search",
            number: 16,
            lessonOrder: 1,
            description: "Scan each candidate when the data has no searchable structure yet.",
            tags: ["O(n)", "scan", "predicate"],
          },
          {
            slug: "binary-search",
            title: "Binary Search",
            number: 17,
            lessonOrder: 2,
            description: "Halve a sorted search space until the target or boundary condition is found.",
            tags: ["O(log n)", "sorted", "bounds"],
          },
        ],
      ),
      module(
        sortingSearchingHashing,
        {
          slug: "sorting",
          title: "Sorting",
          order: 2,
          summary: "Compare quadratic basics with O(n log n) sorting strategies.",
        },
        [
          {
            slug: "bubble-selection-insertion-sort",
            title: "Quadratic Sorting Basics",
            number: 18,
            lessonOrder: 1,
            description: "Use bubble, selection, and insertion sort as visual baselines for comparison sorting.",
            tags: ["O(n^2)", "swaps", "comparison"],
          },
          {
            slug: "merge-sort",
            title: "Merge Sort",
            number: 19,
            lessonOrder: 2,
            description: "Split arrays, sort halves, and merge results in stable O(n log n) time.",
            tags: ["O(n log n)", "merge", "divide"],
          },
          {
            slug: "quick-sort",
            title: "Quick Sort Partitioning",
            number: 20,
            lessonOrder: 3,
            description: "Partition around a pivot and recursively sort the remaining ranges.",
            tags: ["pivot", "partition", "divide"],
          },
          {
            slug: "heap-sort",
            title: "Heap Sort",
            number: 21,
            lessonOrder: 4,
            description: "Use heap ordering to repeatedly select the next largest or smallest value.",
            tags: ["heap", "O(n log n)", "in-place"],
          },
        ],
      ),
      module(
        sortingSearchingHashing,
        {
          slug: "hashing",
          title: "Hashing",
          order: 3,
          summary: "Hash functions, collision handling, sets, maps, counting, and complement lookup.",
        },
        [
          {
            slug: "hash-table-collisions",
            title: "Hash Tables and Collisions",
            number: 22,
            lessonOrder: 1,
            description: "Store keys by hash and handle collisions with chaining or open addressing.",
            tags: ["hash", "collision", "amortized"],
          },
          {
            slug: "set-membership",
            title: "Set Membership",
            number: 23,
            lessonOrder: 2,
            description: "Trade space for fast lookup when checking duplicates or intersections.",
            tags: ["set", "O(1)", "lookup"],
          },
          {
            slug: "hash-map-counting",
            title: "Hash Map Counting",
            number: 24,
            lessonOrder: 3,
            description: "Track frequencies for anagrams, majorities, and grouped values.",
            tags: ["map", "frequency", "counting"],
          },
        ],
      ),
    ],
  },
  {
    slug: "non-linear-data-structures",
    title: nonLinearDataStructures.title,
    number: nonLinearDataStructures.number,
    summary: "Model hierarchical and interconnected data with explicit traversal state.",
    modules: [
      module(
        nonLinearDataStructures,
        {
          slug: "trees",
          title: "Trees",
          order: 1,
          summary: "Binary trees, depth-first traversals, level-order traversal, BSTs, and heaps.",
        },
        [
          {
            slug: "binary-tree-anatomy",
            title: "Binary Tree Anatomy",
            number: 25,
            lessonOrder: 1,
            description: "Name roots, children, leaves, height, and tree representations.",
            tags: ["root", "children", "height"],
          },
          {
            slug: "tree-depth-first-traversal",
            title: "Tree Depth-First Traversal",
            number: 26,
            lessonOrder: 2,
            description: "Compare preorder, inorder, and postorder recursive visit order.",
            tags: ["DFS", "recursion", "order"],
          },
          {
            slug: "tree-breadth-first-traversal",
            title: "Tree Breadth-First Traversal",
            number: 27,
            lessonOrder: 3,
            description: "Use a queue to visit tree nodes level by level.",
            tags: ["BFS", "queue", "levels"],
          },
          {
            slug: "binary-search-trees",
            title: "Binary Search Trees",
            number: 28,
            lessonOrder: 4,
            description: "Search, insert, and delete by preserving left/right ordering rules.",
            tags: ["BST", "search", "ordering"],
          },
        ],
      ),
      module(
        nonLinearDataStructures,
        {
          slug: "graphs",
          title: "Graphs",
          order: 2,
          summary: "Adjacency matrices, adjacency lists, graph traversal, shortest paths, and spanning trees.",
        },
        [
          {
            slug: "graph-representations",
            title: "Graph Representations",
            number: 29,
            lessonOrder: 1,
            description: "Convert edges into adjacency lists and matrices for traversal.",
            tags: ["nodes", "edges", "adjacency"],
          },
          {
            slug: "graph-depth-first-search",
            title: "Graph Depth-First Search (DFS)",
            number: 30,
            lessonOrder: 2,
            description: "Explore reachable nodes using Depth-First Search (DFS) while maintaining a visited set.",
            tags: ["DFS", "visited", "components"],
          },
          {
            slug: "graph-breadth-first-search",
            title: "Graph Breadth-First Search (BFS)",
            number: 31,
            lessonOrder: 3,
            description: "Expand graph nodes level by level with a queue for unweighted shortest paths.",
            tags: ["BFS", "queue", "shortest path"],
          },
          {
            slug: "weighted-graph-algorithms",
            title: "Weighted Graph Algorithms",
            number: 32,
            lessonOrder: 4,
            description: "Use Dijkstra, Bellman-Ford, Prim, and Kruskal when edges carry cost.",
            tags: ["Dijkstra", "MST", "weights"],
          },
        ],
      ),
      module(
        nonLinearDataStructures,
        {
          slug: "heaps-and-priority-queues",
          title: "Heaps and Priority Queues",
          order: 3,
          summary: "Min-heaps, max-heaps, heapify, and repeated priority selection.",
        },
        [
          {
            slug: "heap-shape-ordering",
            title: "Heap Shape and Ordering",
            number: 33,
            lessonOrder: 1,
            description: "Connect the binary heap tree shape to its backing array representation.",
            tags: ["heap", "array", "priority"],
          },
          {
            slug: "heap-push-pop",
            title: "Heap Push and Pop",
            number: 34,
            lessonOrder: 2,
            description: "Bubble up and sink down to keep heap order after updates.",
            tags: ["heapify", "bubble", "sink"],
          },
        ],
      ),
    ],
  },
  {
    slug: "advanced-algorithmic-patterns",
    title: advancedPatterns.title,
    number: advancedPatterns.number,
    summary: "Choose problem-solving strategies for optimization, enumeration, and overlapping subproblems.",
    modules: [
      module(
        advancedPatterns,
        {
          slug: "algorithmic-strategies",
          title: "Algorithmic Strategies",
          order: 1,
          summary: "Greedy, divide and conquer, backtracking, and dynamic programming.",
        },
        [
          {
            slug: "greedy-method",
            title: "Greedy Method",
            number: 35,
            lessonOrder: 1,
            description: "Make locally optimal choices when an exchange argument makes them safe.",
            tags: ["greedy", "choice", "optimization"],
          },
          {
            slug: "divide-and-conquer",
            title: "Divide and Conquer",
            number: 36,
            lessonOrder: 2,
            description: "Break a problem into independent subproblems and combine their answers.",
            tags: ["divide", "merge", "recursion"],
          },
          {
            slug: "backtracking-choices",
            title: "Backtracking Choices",
            number: 37,
            lessonOrder: 3,
            description: "Choose, explore, and unchoose while pruning impossible branches.",
            tags: ["backtracking", "pruning", "search"],
          },
          {
            slug: "dynamic-programming-memoization",
            title: "Dynamic Programming: Memoization",
            number: 38,
            lessonOrder: 4,
            description: "Cache repeated recursive answers to collapse duplicated work.",
            tags: ["DP", "memo", "cache"],
          },
          {
            slug: "dynamic-programming-tabulation",
            title: "Dynamic Programming: Tabulation",
            number: 39,
            lessonOrder: 5,
            description: "Fill a table from base cases toward the final answer.",
            tags: ["DP", "table", "bottom-up"],
          },
          {
            slug: "two-dimensional-dp",
            title: "Two-Dimensional DP",
            number: 40,
            lessonOrder: 6,
            description: "Represent subproblem dependencies across rows and columns.",
            tags: ["DP", "grid", "LCS"],
          },
        ],
      ),
    ],
  },
];

export const curriculumLessonMetadata: CurriculumLessonMetadata[] = curriculumStages.flatMap((stage) =>
  stage.modules.flatMap((curriculumModule) => curriculumModule.lessons),
);

export function getCurriculumLessonMetadata(slug: string): CurriculumLessonMetadata | undefined {
  return curriculumLessonMetadata.find((entry) => entry.slug === slug);
}
