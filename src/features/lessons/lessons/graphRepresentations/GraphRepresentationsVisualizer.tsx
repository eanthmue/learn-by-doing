import { useEffect, useRef, useState } from "react";
import type { LessonVisualizerProps } from "../../types";

/**
 * Decodes the flat `values` encoding used by the graph lesson:
 * [numNodes, a0, b0, a1, b1, ...]
 */
function decodeGraph(values: number[]) {
  const numNodes = values[0] ?? 0;
  const edges: [number, number][] = [];
  for (let i = 1; i + 1 < values.length; i += 2) {
    edges.push([values[i]!, values[i + 1]!]);
  }
  return { numNodes, edges };
}

/**
 * Compute (x, y) positions for nodes arranged in a circle.
 */
function circleLayout(numNodes: number, cx: number, cy: number, radius: number) {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < numNodes; i++) {
    const angle = (2 * Math.PI * i) / numNodes - Math.PI / 2;
    positions.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return positions;
}

export function GraphRepresentationsVisualizer({
  values,
  steps,
  stepIndex,
  onStepIndexChange,
}: LessonVisualizerProps) {
  const [playing, setPlaying] = useState(false);
  const activeStepIndex = Math.max(0, Math.min(stepIndex ?? 0, steps.length - 1));
  const current = steps[activeStepIndex] ?? steps[0];

  const stepIndexRef = useRef(activeStepIndex);
  const onStepIndexChangeRef = useRef(onStepIndexChange);

  useEffect(() => {
    stepIndexRef.current = activeStepIndex;
  }, [activeStepIndex]);

  useEffect(() => {
    onStepIndexChangeRef.current = onStepIndexChange;
  }, [onStepIndexChange]);

  useEffect(() => {
    setPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!playing) return;

    const timer = window.setInterval(() => {
      const currentIdx = stepIndexRef.current;
      const nextIndex = currentIdx + 1;
      if (nextIndex >= steps.length) {
        setPlaying(false);
        return;
      }
      onStepIndexChangeRef.current?.(nextIndex);
    }, 900);

    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  const goTo = (index: number) => {
    setPlaying(false);
    onStepIndexChange?.(Math.max(0, Math.min(index, steps.length - 1)));
  };

  if (!current) return null;

  const { numNodes, edges } = decodeGraph(values);
  // Number of edges processed so far (activeIndex is the edge index, total is edges processed)
  const edgesProcessed = current.total;

  // Build current-state adjacency list and matrix
  const adjList: number[][] = Array.from({ length: numNodes }, () => []);
  const matrix: number[][] = Array.from({ length: numNodes }, () =>
    Array(numNodes).fill(0) as number[],
  );

  for (let i = 0; i < edgesProcessed; i++) {
    const edge = edges[i];
    if (!edge) continue;
    const [a, b] = edge;
    adjList[a]!.push(b);
    adjList[b]!.push(a);
    matrix[a]![b] = 1;
    matrix[b]![a] = 1;
  }

  // Node positions for the graph diagram
  const svgSize = 220;
  const center = svgSize / 2;
  const radius = 80;
  const positions = circleLayout(numNodes, center, center, radius);

  // Determine which edge is currently being highlighted
  const currentEdge = current.activeIndex !== null ? edges[current.activeIndex] : null;

  // Which nodes have been touched so far
  const touchedNodes = new Set<number>();
  for (let i = 0; i < edgesProcessed; i++) {
    const edge = edges[i];
    if (edge) {
      touchedNodes.add(edge[0]);
      touchedNodes.add(edge[1]);
    }
  }

  return (
    <div className="visualizer-panel graph-viz-panel" aria-label="Graph representations visualizer">
      <div className="viz-header">
        <div>
          <span className="viz-title">Visualizer</span>
          <span className="viz-step-count">
            Step {activeStepIndex + 1} of {steps.length}
          </span>
        </div>
        <span className="viz-subtitle">
          {numNodes} nodes, {edges.length} edges
        </span>
      </div>

      {/* Graph diagram */}
      <div className="graph-viz-diagram" aria-label="Graph node diagram">
        <svg
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          width={svgSize}
          height={svgSize}
          className="graph-viz-svg"
        >
          {/* Render edges */}
          {edges.map(([a, b], i) => {
            const pa = positions[a];
            const pb = positions[b];
            if (!pa || !pb) return null;
            const isProcessed = i < edgesProcessed;
            const isCurrent = currentEdge && currentEdge[0] === a && currentEdge[1] === b;
            return (
              <line
                key={`edge-${i}`}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                className={`graph-viz-edge${isProcessed ? " processed" : ""}${isCurrent ? " current" : ""}`}
              />
            );
          })}
          {positions.map((pos, i) => {
            const isTouched = touchedNodes.has(i);
            const isActive =
              currentEdge !== null && currentEdge !== undefined &&
              (currentEdge[0] === i || currentEdge[1] === i);
            return (
              <g key={`node-${i}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={18}
                  className={`graph-viz-node${isTouched ? " touched" : ""}${isActive ? " active" : ""}`}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="graph-viz-node-label"
                >
                  {i}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Adjacency list view */}
      <div className="graph-viz-repr" aria-label="Adjacency list">
        <span className="graph-viz-repr-title">Adjacency List</span>
        <div className="graph-viz-adj-list">
          {adjList.map((neighbors, node) => (
            <div
              key={`adj-${node}`}
              className={`graph-viz-adj-row${
                currentEdge && (currentEdge[0] === node || currentEdge[1] === node)
                  ? " highlight"
                  : ""
              }`}
            >
              <span className="graph-viz-adj-node">{node}</span>
              <span className="graph-viz-adj-arrow">→</span>
              <span className="graph-viz-adj-neighbors">
                [{neighbors.join(", ")}]
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Adjacency matrix view */}
      {numNodes <= 8 && (
        <div className="graph-viz-repr" aria-label="Adjacency matrix">
          <span className="graph-viz-repr-title">Adjacency Matrix</span>
          <div className="graph-viz-matrix">
            {/* Column headers */}
            <div className="graph-viz-matrix-row header">
              <span className="graph-viz-matrix-cell corner" />
              {Array.from({ length: numNodes }, (_, c) => (
                <span key={`col-${c}`} className="graph-viz-matrix-cell header-cell">
                  {c}
                </span>
              ))}
            </div>
            {/* Rows */}
            {matrix.map((row, r) => (
              <div key={`row-${r}`} className="graph-viz-matrix-row">
                <span className="graph-viz-matrix-cell header-cell">{r}</span>
                {row.map((val, c) => {
                  const isCellActive =
                    currentEdge !== null &&
                    currentEdge !== undefined &&
                    ((currentEdge[0] === r && currentEdge[1] === c) ||
                      (currentEdge[0] === c && currentEdge[1] === r));
                  return (
                    <span
                      key={`cell-${r}-${c}`}
                      className={`graph-viz-matrix-cell${val === 1 ? " filled" : ""}${
                        isCellActive ? " active" : ""
                      }`}
                    >
                      {val}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="viz-description">{current.description}</p>

      <div className="viz-controls">
        <button
          onClick={() => goTo(0)}
          aria-label="Go to start"
          title="Go to start"
          disabled={activeStepIndex === 0}
        >
          Start
        </button>
        <button
          onClick={() => goTo(activeStepIndex - 1)}
          aria-label="Previous step"
          title="Previous step"
          disabled={activeStepIndex === 0}
        >
          Back
        </button>
        <button
          className="viz-play-button"
          onClick={() => {
            if (activeStepIndex >= steps.length - 1) {
              onStepIndexChange?.(0);
            }
            setPlaying((wasPlaying) => !wasPlaying);
          }}
          aria-label={playing ? "Pause" : "Play"}
          title={playing ? "Pause" : "Play"}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => goTo(activeStepIndex + 1)}
          aria-label="Next step"
          title="Next step"
          disabled={activeStepIndex >= steps.length - 1}
        >
          Next
        </button>
        <button
          onClick={() => goTo(steps.length - 1)}
          aria-label="Go to end"
          title="Go to end"
          disabled={activeStepIndex >= steps.length - 1}
        >
          End
        </button>
      </div>

      <div className="viz-progress" aria-label="Visualizer steps">
        {steps.map((step, index) => (
          <button
            key={`${index}-${step.description}`}
            className={`viz-dot${index === activeStepIndex ? " active" : ""}${
              index < activeStepIndex ? " past" : ""
            }`}
            onClick={() => goTo(index)}
            aria-label={`Step ${index + 1}`}
            title={`Step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
