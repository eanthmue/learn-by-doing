import { useEffect, useRef, useState } from "react";
import type { LessonVisualizerProps } from "../../types";

type Edge = [number, number];

function decodeGraph(values: number[]) {
  const numNodes = values[0] ?? 0;
  const edges: Edge[] = [];
  for (let i = 1; i + 1 < values.length; i += 2) {
    edges.push([values[i]!, values[i + 1]!]);
  }
  return { numNodes, edges };
}

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

function parseNumberList(value: string | number | boolean | null | undefined): number[] {
  if (typeof value !== "string") {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return [];
  }

  const body = trimmed.slice(1, -1).trim();
  if (body === "") {
    return [];
  }

  return body
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item));
}

function parseEdge(value: string | number | boolean | null | undefined): Edge | null {
  const list = parseNumberList(value);
  if (list.length !== 2 || list[0] === undefined || list[1] === undefined) {
    return null;
  }
  return [list[0], list[1]];
}

function hasEdge(edge: Edge | null, a: number, b: number) {
  return edge !== null && ((edge[0] === a && edge[1] === b) || (edge[0] === b && edge[1] === a));
}

export function GraphDepthFirstSearchVisualizer({
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
    if (!playing) {
      return;
    }

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

  if (!current) {
    return null;
  }

  const { numNodes, edges } = decodeGraph(values);
  const svgSize = 240;
  const center = svgSize / 2;
  const radius = 88;
  const positions = circleLayout(numNodes, center, center, radius);
  const visited = new Set(parseNumberList(current.variables?.visited));
  const order = parseNumberList(current.variables?.order);
  const callStack = parseNumberList(current.variables?.callStack);
  const activeEdge = parseEdge(current.variables?.edge);
  const activeNode = current.activeIndex;

  return (
    <div className="visualizer-panel graph-viz-panel dfs-viz-panel" aria-label="Graph Depth-First Search (DFS) visualizer">
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

      <div className="graph-viz-diagram" aria-label="Depth-First Search (DFS) graph diagram">
        <svg
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          width={svgSize}
          height={svgSize}
          className="graph-viz-svg"
        >
          {edges.map(([a, b], index) => {
            const pa = positions[a];
            const pb = positions[b];
            if (!pa || !pb) {
              return null;
            }
            return (
              <line
                key={`edge-${index}`}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                className={`graph-viz-edge processed${hasEdge(activeEdge, a, b) ? " current" : ""}`}
              />
            );
          })}
          {positions.map((pos, node) => {
            const isVisited = visited.has(node);
            const isActive = activeNode === node;
            const isStacked = callStack.includes(node);
            return (
              <g key={`node-${node}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={18}
                  className={`graph-viz-node${isVisited ? " touched" : ""}${isActive ? " active" : ""}${isStacked ? " dfs-stacked" : ""}`}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="graph-viz-node-label"
                >
                  {node}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="dfs-state-grid" aria-label="DFS state">
        <div className="graph-viz-repr dfs-state-card">
          <span className="graph-viz-repr-title">Visit Order</span>
          <div className="dfs-pill-row">
            {order.length > 0 ? order.map((node, index) => (
              <span className="dfs-pill" key={`order-${node}-${index}`}>
                {node}
              </span>
            )) : <span className="dfs-empty">empty</span>}
          </div>
        </div>
        <div className="graph-viz-repr dfs-state-card">
          <span className="graph-viz-repr-title">Call Stack</span>
          <div className="dfs-pill-row">
            {callStack.length > 0 ? callStack.map((node, index) => (
              <span className="dfs-pill stack" key={`stack-${node}-${index}`}>
                {node}
              </span>
            )) : <span className="dfs-empty">empty</span>}
          </div>
        </div>
      </div>

      <div className="graph-viz-repr" aria-label="Visited set">
        <span className="graph-viz-repr-title">Visited Set</span>
        <div className="dfs-node-list">
          {Array.from({ length: numNodes }, (_, node) => (
            <span
              className={`dfs-node-token${visited.has(node) ? " visited" : ""}${activeNode === node ? " active" : ""}`}
              key={`visited-${node}`}
            >
              {node}
            </span>
          ))}
        </div>
      </div>

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
