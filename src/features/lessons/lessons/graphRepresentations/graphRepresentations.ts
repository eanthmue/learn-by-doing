import { LessonPage } from "../../LessonPage";
import { parseLessonMarkdown } from "../../markdown/parseLessonMarkdown";
import type { LessonDefinition, VisualizerStep } from "../../types";
import graphRepresentationsMarkdown from "./graphRepresentations.md" with { type: "text" };
import { GraphRepresentationsVisualizer } from "./GraphRepresentationsVisualizer";


const graphRepresentationsTraceCode = `function buildAdjList(numNodes, edges) {
  const adj = Array.from({ length: numNodes }, () => []);

  for (let i = 0; i < edges.length; i++) {
    const [a, b] = edges[i];
    adj[a].push(b);
    adj[b].push(a);
  }

  return adj;
}

function buildMatrix(numNodes, edges) {
  const matrix = Array.from({ length: numNodes },
    () => Array(numNodes).fill(0)
  );

  for (let i = 0; i < edges.length; i++) {
    const [a, b] = edges[i];
    matrix[a][b] = 1;
    matrix[b][a] = 1;
  }

  return matrix;
}`;

const graphRepresentationsStarterCode = `function buildAdjList(numNodes, edges) {
  const adj = Array.from({ length: numNodes }, () => []);

  for (let i = 0; i < edges.length; i++) {
    const [a, b] = edges[i];
    adj[a].push(b);
    adj[b].push(a);
  }

  return adj;
}

function buildMatrix(numNodes, edges) {
  const matrix = Array.from({ length: numNodes },
    () => Array(numNodes).fill(0)
  );

  for (let i = 0; i < edges.length; i++) {
    const [a, b] = edges[i];
    matrix[a][b] = 1;
    matrix[b][a] = 1;
  }

  return matrix;
}

function buildGraphRepresentations(numNodes, edges) {
  return {
    adjList: buildAdjList(numNodes, edges),
    matrix: buildMatrix(numNodes, edges),
  };
}

// Try it out
const edges = [[0,1], [0,2], [1,2], [1,3], [2,4], [3,4]];
const { adjList, matrix } = buildGraphRepresentations(5, edges);

console.log("Adjacency List:");
adjList.forEach((neighbors, node) =>
  console.log("  Node " + node + " ->", neighbors)
);

console.log("\\nAdjacency Matrix:");
matrix.forEach((row) => console.log("  " + JSON.stringify(row)));`;

const graphRepresentationsContent = parseLessonMarkdown(graphRepresentationsMarkdown);

/**
 * Edge type for graph step builder. Each edge is [nodeA, nodeB].
 */
type Edge = [number, number];

/**
 * Builds deterministic visualizer steps showing the edge-by-edge construction
 * of an adjacency list and adjacency matrix for a small undirected graph.
 *
 * The `values` parameter is repurposed as a flat encoding of edges:
 * [numNodes, a0, b0, a1, b1, ...] where each pair (a_i, b_i) is an edge.
 */
export function buildGraphRepresentationSteps(values: number[]): VisualizerStep[] {
  const numNodes = values[0] ?? 0;
  const edges: Edge[] = [];
  for (let i = 1; i + 1 < values.length; i += 2) {
    edges.push([values[i]!, values[i + 1]!]);
  }

  // Build adjacency list & matrix alongside step generation
  const adjList: number[][] = Array.from({ length: numNodes }, () => []);
  const matrix: number[][] = Array.from({ length: numNodes }, () =>
    Array(numNodes).fill(0) as number[],
  );

  const steps: VisualizerStep[] = [];

  // Step 0: initial state
  steps.push({
    activeIndex: null,
    total: 0,
    description: `Start with ${numNodes} node${numNodes !== 1 ? "s" : ""} and ${edges.length} edge${edges.length !== 1 ? "s" : ""} to process.`,
    codeLine: 2,
    variables: {
      numNodes,
      edges: edges.length,
      adjList: JSON.stringify(adjList),
    },
  });

  // One step per edge
  edges.forEach(([a, b], edgeIndex) => {
    adjList[a]!.push(b);
    adjList[b]!.push(a);
    matrix[a]![b] = 1;
    matrix[b]![a] = 1;

    steps.push({
      activeIndex: edgeIndex,
      total: edgeIndex + 1,
      description: `Edge [${a}, ${b}]: add ${b} to node ${a}'s list and ${a} to node ${b}'s list. Set matrix[${a}][${b}] = 1 and matrix[${b}][${a}] = 1.`,
      codeLine: 5,
      variables: {
        edge: `[${a}, ${b}]`,
        [`adj[${a}]`]: JSON.stringify(adjList[a]),
        [`adj[${b}]`]: JSON.stringify(adjList[b]),
        [`matrix[${a}][${b}]`]: 1,
        [`matrix[${b}][${a}]`]: 1,
      },
    });
  });

  // Final step: completion summary
  steps.push({
    activeIndex: null,
    total: edges.length,
    description: `Done. Built adjacency list (${numNodes} entries) and ${numNodes}×${numNodes} matrix from ${edges.length} edge${edges.length !== 1 ? "s" : ""}.`,
    codeLine: 10,
    variables: {
      adjListSize: numNodes,
      matrixSize: `${numNodes}×${numNodes}`,
      edgesProcessed: edges.length,
    },
  });

  return steps;
}

export const graphRepresentationsLesson: LessonDefinition = {
  slug: "graph-representations",
  title: "Graph Representations",
  stage: "Non-Linear Data Structures",
  stageNumber: 4,
  module: "Graphs",
  moduleSlug: "graphs",
  moduleOrder: 2,
  number: 27,
  lessonOrder: 1,
  description: "Convert edges into adjacency lists and matrices for traversal.",
  tags: ["nodes", "edges", "adjacency"],
  available: true,
  routePath: "/lessons/graph-representations",
  traceCode: graphRepresentationsTraceCode,
  starterCode: graphRepresentationsStarterCode,
  // Flat encoding: [numNodes, a0, b0, a1, b1, ...]
  // 5 nodes, edges: [0,1], [0,2], [1,2], [1,3], [2,4], [3,4]
  exampleValues: [5, 0, 1, 0, 2, 1, 2, 1, 3, 2, 4, 3, 4],
  content: graphRepresentationsContent,
  buildSteps: buildGraphRepresentationSteps,
  Visualizer: GraphRepresentationsVisualizer,
  PageComponent: LessonPage,
};
