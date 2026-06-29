import { LessonPage } from "../../LessonPage";
import { parseLessonMarkdown } from "../../markdown/parseLessonMarkdown";
import type { LessonDefinition, VisualizerStep } from "../../types";
import graphDepthFirstSearchMarkdown from "./graphDepthFirstSearch.md" with { type: "text" };
import { GraphDepthFirstSearchVisualizer } from "./GraphDepthFirstSearchVisualizer";

type Edge = [number, number];

const graphDepthFirstSearchTraceCode = `function graphDfs(adjList, start) {
  const visited = new Set();
  const order = [];

  function visit(node) {
    if (visited.has(node)) return;

    visited.add(node);
    order.push(node);

    for (const neighbor of adjList[node]) {
      visit(neighbor);
    }
  }

  visit(start);
  return order;
}`;

const graphDepthFirstSearchStarterCode = `function graphDfs(adjList, start) {
  if (start < 0 || start >= adjList.length) {
    return [];
  }

  const visited = new Set();
  const order = [];

  function visit(node) {
    if (visited.has(node)) return;

    visited.add(node);
    order.push(node);

    for (const neighbor of adjList[node]) {
      visit(neighbor);
    }
  }

  visit(start);
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

console.log(graphDfs(graph, 0));`;

const graphDepthFirstSearchContent = parseLessonMarkdown(graphDepthFirstSearchMarkdown);

function formatList(values: number[]): string {
  return `[${values.join(", ")}]`;
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
  callStack,
}: {
  current: number | null;
  neighbor?: number;
  edge?: Edge;
  visited: Set<number>;
  order: number[];
  callStack: number[];
}): Record<string, string | number | boolean | null> {
  return {
    current,
    neighbor: neighbor ?? null,
    edge: edge ? formatList(edge) : "none",
    visited: formatList(Array.from(visited)),
    order: formatList(order),
    callStack: formatList(callStack),
  };
}

export function buildGraphDepthFirstSearchSteps(values: number[]): VisualizerStep[] {
  const { numNodes, edges } = decodeGraph(values);
  const adjList = buildAdjList(numNodes, edges);
  const start = numNodes > 0 ? 0 : null;
  const visited = new Set<number>();
  const order: number[] = [];
  const callStack: number[] = [];
  const steps: VisualizerStep[] = [
    {
      activeIndex: start,
      total: 0,
      description: start === null
        ? "Start with an empty graph. There is no node to visit."
        : `Start DFS at node ${start}. The visited set and output order are empty.`,
      codeLine: 2,
      variables: makeVariables({
        current: start,
        visited,
        order,
        callStack,
      }),
    },
  ];

  if (start === null) {
    return steps;
  }

  steps.push({
    activeIndex: start,
    total: 0,
    description: `Call visit(${start}) from the starting node.`,
    codeLine: 16,
    variables: makeVariables({
      current: start,
      visited,
      order,
      callStack: [start],
    }),
  });

  function visit(node: number) {
    callStack.push(node);

    if (visited.has(node)) {
      steps.push({
        activeIndex: node,
        total: order.length,
        description: `Node ${node} is already visited, so this branch stops here.`,
        codeLine: 6,
        variables: makeVariables({
          current: node,
          visited,
          order,
          callStack,
        }),
      });
      callStack.pop();
      return;
    }

    visited.add(node);
    order.push(node);
    steps.push({
      activeIndex: node,
      total: order.length,
      description: `Visit node ${node}: mark it visited and append it to the DFS order.`,
      codeLine: 8,
      variables: makeVariables({
        current: node,
        visited,
        order,
        callStack,
      }),
    });

    const neighbors = adjList[node] ?? [];
    if (neighbors.length === 0) {
      steps.push({
        activeIndex: node,
        total: order.length,
        description: `Node ${node} has no neighbors, so DFS backs up immediately.`,
        codeLine: 11,
        variables: makeVariables({
          current: node,
          visited,
          order,
          callStack,
        }),
      });
    }

    neighbors.forEach((neighbor) => {
      const edge: Edge = [node, neighbor];
      steps.push({
        activeIndex: node,
        total: order.length,
        description: `From node ${node}, inspect neighbor ${neighbor}.`,
        codeLine: 11,
        variables: makeVariables({
          current: node,
          neighbor,
          edge,
          visited,
          order,
          callStack,
        }),
      });

      if (visited.has(neighbor)) {
        steps.push({
          activeIndex: neighbor,
          total: order.length,
          description: `Neighbor ${neighbor} is already visited, so DFS skips that loop edge.`,
          codeLine: 6,
          variables: makeVariables({
            current: neighbor,
            neighbor,
            edge,
            visited,
            order,
            callStack,
          }),
        });
        return;
      }

      steps.push({
        activeIndex: neighbor,
        total: order.length,
        description: `Neighbor ${neighbor} is new, so DFS goes deeper from ${node} to ${neighbor}.`,
        codeLine: 12,
        variables: makeVariables({
          current: neighbor,
          neighbor,
          edge,
          visited,
          order,
          callStack: [...callStack, neighbor],
        }),
      });
      visit(neighbor);
    });

    callStack.pop();
    steps.push({
      activeIndex: node,
      total: order.length,
      description: `All neighbors of node ${node} are handled. Back up to the previous call.`,
      codeLine: 13,
      variables: makeVariables({
        current: node,
        visited,
        order,
        callStack,
      }),
    });
  }

  visit(start);

  steps.push({
    activeIndex: null,
    total: order.length,
    description: `DFS is complete. The visit order is ${formatList(order)}.`,
    codeLine: 17,
    variables: {
      current: null,
      visited: formatList(Array.from(visited)),
      order: formatList(order),
      callStack: "[]",
    },
  });

  return steps;
}

export const graphDepthFirstSearchLesson: LessonDefinition = {
  slug: "graph-depth-first-search",
  title: "Graph Depth-First Search (DFS)",
  stage: "Non-Linear Data Structures",
  stageNumber: 4,
  module: "Graphs",
  moduleSlug: "graphs",
  moduleOrder: 2,
  number: 28,
  lessonOrder: 2,
  description: "Explore reachable nodes using Depth-First Search (DFS) while maintaining a visited set.",
  tags: ["DFS", "visited", "components"],
  available: true,
  routePath: "/lessons/graph-depth-first-search",
  traceCode: graphDepthFirstSearchTraceCode,
  starterCode: graphDepthFirstSearchStarterCode,
  exampleValues: [6, 0, 1, 0, 2, 1, 3, 1, 4, 2, 4, 3, 5, 4, 5],
  content: graphDepthFirstSearchContent,
  buildSteps: buildGraphDepthFirstSearchSteps,
  Visualizer: GraphDepthFirstSearchVisualizer,
  PageComponent: LessonPage,
};
