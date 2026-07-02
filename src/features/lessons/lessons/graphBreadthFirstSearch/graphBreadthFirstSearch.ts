import { LessonPage } from "../../LessonPage";
import { parseLessonMarkdown } from "../../markdown/parseLessonMarkdown";
import type { TraceLessonDefinition, VisualizerStep } from "../../types";
import graphBreadthFirstSearchMarkdown from "./graphBreadthFirstSearch.md" with { type: "text" };
import { GraphBreadthFirstSearchVisualizer } from "./GraphBreadthFirstSearchVisualizer";

type Edge = [number, number];

const graphBreadthFirstSearchTraceCode = `function graphBfs(adjList, start) {
  if (start < 0 || start >= adjList.length) {
    return [];
  }

  const visited = new Set();
  const queue = [];
  const order = [];
  let head = 0;

  visited.add(start);
  queue.push(start);

  while (head < queue.length) {
    const node = queue[head];
    head += 1;
    order.push(node);

    for (const neighbor of adjList[node]) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      queue.push(neighbor);
    }
  }

  return order;
}`;

const graphBreadthFirstSearchStarterCode = `function graphBfs(adjList, start) {
  if (start < 0 || start >= adjList.length) {
    return [];
  }

  const visited = new Set();
  const queue = [];
  const order = [];
  let head = 0;

  visited.add(start);
  queue.push(start);

  while (head < queue.length) {
    const node = queue[head];
    head += 1;
    order.push(node);

    for (const neighbor of adjList[node]) {
      if (visited.has(neighbor)) continue;
      visited.add(neighbor);
      queue.push(neighbor);
    }
  }

  return order;
}

// Try it out
const graph = [
  [1, 2],
  [0, 3, 4],
  [0, 4],
  [1, 5],
  [1, 2, 5],
  [3, 4],
];

console.log(graphBfs(graph, 0));`;

const graphBreadthFirstSearchContent = parseLessonMarkdown(graphBreadthFirstSearchMarkdown);

function formatList(values: number[]): string {
  return `[${values.join(", ")}]`;
}

function formatLevels(levels: Map<number, number>): string {
  return `[${Array.from(levels.entries()).map(([node, level]) => `${node}:${level}`).join(", ")}]`;
}

function decodeGraph(values: number[]) {
  const numNodes = values[0] ?? 0;
  const edges: Edge[] = [];
  for (let i = 1; i + 1 < values.length; i += 2) {
    edges.push([values[i]!, values[i + 1]!]);
  }
  return { numNodes, edges };
}

function buildAdjList(numNodes: number, edges: Edge[]): number[][] {
  const adjList: number[][] = Array.from({ length: numNodes }, () => []);

  edges.forEach(([a, b]) => {
    if (a < 0 || b < 0 || a >= numNodes || b >= numNodes) {
      return;
    }

    adjList[a]!.push(b);
    adjList[b]!.push(a);
  });

  return adjList;
}

function makeVariables({
  current,
  neighbor,
  edge,
  visited,
  order,
  queue,
  levels,
  head,
}: {
  current: number | null;
  neighbor?: number;
  edge?: Edge;
  visited: Set<number>;
  order: number[];
  queue: number[];
  levels: Map<number, number>;
  head: number;
}): Record<string, string | number | boolean | null> {
  return {
    current,
    neighbor: neighbor ?? null,
    edge: edge ? formatList(edge) : "none",
    visited: formatList(Array.from(visited)),
    order: formatList(order),
    queue: formatList(queue),
    levels: formatLevels(levels),
    head,
  };
}

export function buildGraphBreadthFirstSearchSteps(values: number[]): VisualizerStep[] {
  const { numNodes, edges } = decodeGraph(values);
  const adjList = buildAdjList(numNodes, edges);
  const start = numNodes > 0 ? 0 : null;
  const visited = new Set<number>();
  const order: number[] = [];
  const queue: number[] = [];
  const levels = new Map<number, number>();
  let head = 0;

  const steps: VisualizerStep[] = [
    {
      activeIndex: start,
      total: 0,
      description: start === null
        ? "Start with an empty graph. There is no node to enqueue."
        : `Start BFS at node ${start}. The queue and output order are empty.`,
      codeLine: 6,
      variables: makeVariables({
        current: start,
        visited,
        order,
        queue: [],
        levels,
        head,
      }),
    },
  ];

  if (start === null) {
    return steps;
  }

  visited.add(start);
  levels.set(start, 0);
  steps.push({
    activeIndex: start,
    total: 0,
    description: `Mark node ${start} visited as soon as it is discovered.`,
    codeLine: 11,
    variables: makeVariables({
      current: start,
      visited,
      order,
      queue: [],
      levels,
      head,
    }),
  });

  queue.push(start);
  steps.push({
    activeIndex: start,
    total: 0,
    description: `Put node ${start} at the back of the queue.`,
    codeLine: 12,
    variables: makeVariables({
      current: start,
      visited,
      order,
      queue: queue.slice(head),
      levels,
      head,
    }),
  });

  while (head < queue.length) {
    const front = queue[head]!;
    steps.push({
      activeIndex: front,
      total: order.length,
      description: `The front of the queue is node ${front}, so BFS processes it next.`,
      codeLine: 14,
      variables: makeVariables({
        current: front,
        visited,
        order,
        queue: queue.slice(head),
        levels,
        head,
      }),
    });

    const node = queue[head]!;
    head += 1;
    steps.push({
      activeIndex: node,
      total: order.length,
      description: `Remove node ${node} from the front by moving the queue head forward.`,
      codeLine: 16,
      variables: makeVariables({
        current: node,
        visited,
        order,
        queue: queue.slice(head),
        levels,
        head,
      }),
    });

    order.push(node);
    steps.push({
      activeIndex: node,
      total: order.length,
      description: `Add node ${node} to the BFS order.`,
      codeLine: 17,
      variables: makeVariables({
        current: node,
        visited,
        order,
        queue: queue.slice(head),
        levels,
        head,
      }),
    });

    const neighbors = adjList[node] ?? [];
    if (neighbors.length === 0) {
      steps.push({
        activeIndex: node,
        total: order.length,
        description: `Node ${node} has no neighbors, so the queue decides what comes next.`,
        codeLine: 19,
        variables: makeVariables({
          current: node,
          visited,
          order,
          queue: queue.slice(head),
          levels,
          head,
        }),
      });
    }

    neighbors.forEach((neighbor) => {
      const edge: Edge = [node, neighbor];
      steps.push({
        activeIndex: node,
        total: order.length,
        description: `From node ${node}, inspect neighbor ${neighbor}.`,
        codeLine: 19,
        variables: makeVariables({
          current: node,
          neighbor,
          edge,
          visited,
          order,
          queue: queue.slice(head),
          levels,
          head,
        }),
      });

      if (visited.has(neighbor)) {
        steps.push({
          activeIndex: neighbor,
          total: order.length,
          description: `Neighbor ${neighbor} already has a place in the BFS line, so skip it.`,
          codeLine: 20,
          variables: makeVariables({
            current: neighbor,
            neighbor,
            edge,
            visited,
            order,
            queue: queue.slice(head),
            levels,
            head,
          }),
        });
        return;
      }

      visited.add(neighbor);
      levels.set(neighbor, (levels.get(node) ?? 0) + 1);
      steps.push({
        activeIndex: neighbor,
        total: order.length,
        description: `Neighbor ${neighbor} is new. Mark it visited at level ${levels.get(neighbor)}.`,
        codeLine: 21,
        variables: makeVariables({
          current: neighbor,
          neighbor,
          edge,
          visited,
          order,
          queue: queue.slice(head),
          levels,
          head,
        }),
      });

      queue.push(neighbor);
      steps.push({
        activeIndex: neighbor,
        total: order.length,
        description: `Add node ${neighbor} to the back of the queue so it waits behind earlier discoveries.`,
        codeLine: 22,
        variables: makeVariables({
          current: neighbor,
          neighbor,
          edge,
          visited,
          order,
          queue: queue.slice(head),
          levels,
          head,
        }),
      });
    });
  }

  steps.push({
    activeIndex: null,
    total: order.length,
    description: `BFS is complete. The visit order is ${formatList(order)}.`,
    codeLine: 26,
    variables: {
      current: null,
      neighbor: null,
      edge: "none",
      visited: formatList(Array.from(visited)),
      order: formatList(order),
      queue: "[]",
      levels: formatLevels(levels),
      head,
    },
  });

  return steps;
}

export const graphBreadthFirstSearchLesson: TraceLessonDefinition = {
  slug: "graph-breadth-first-search",
  title: "Graph Breadth-First Search (BFS)",
  stage: "Non-Linear Data Structures",
  stageNumber: 4,
  module: "Graphs",
  moduleSlug: "graphs",
  moduleOrder: 2,
  number: 31,
  lessonOrder: 3,
  description: "Expand graph nodes level by level with a queue for unweighted shortest paths.",
  tags: ["BFS", "queue", "shortest path"],
  available: true,
  routePath: "/lessons/graph-breadth-first-search",
  traceCode: graphBreadthFirstSearchTraceCode,
  starterCode: graphBreadthFirstSearchStarterCode,
  exampleValues: [6, 0, 1, 0, 2, 1, 3, 1, 4, 2, 4, 3, 5, 4, 5],
  content: graphBreadthFirstSearchContent,
  buildSteps: buildGraphBreadthFirstSearchSteps,
  Visualizer: GraphBreadthFirstSearchVisualizer,
  PageComponent: LessonPage,
};
