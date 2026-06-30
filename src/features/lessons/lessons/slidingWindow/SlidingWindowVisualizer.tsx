import { useEffect, useRef, useState } from "react";
import type { LessonVisualizerProps } from "../../types";

export function SlidingWindowVisualizer({ values, steps, stepIndex, onStepIndexChange }: LessonVisualizerProps) {
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
    const clampedIndex = Math.max(0, Math.min(index, steps.length - 1));
    onStepIndexChange?.(clampedIndex);
  };

  if (!current) {
    return null;
  }

  const range = current.windowRange;
  const hasCurrentWindow = Boolean(range && range.right >= range.left);
  const currentWindowValues = hasCurrentWindow && range
    ? values.slice(range.left, range.right + 1)
    : [];
  const currentWindowLabel = hasCurrentWindow && range ? `nums[${range.left}..${range.right}]` : "No window";
  const currentWindowExpression = currentWindowValues.length > 0 ? currentWindowValues.join(" + ") : "-";
  const bestValue = current.variables?.best;
  const enteringValue = range?.enteringIndex !== null && range?.enteringIndex !== undefined
    ? values[range.enteringIndex]
    : null;
  const leavingValue = range?.leavingIndex !== null && range?.leavingIndex !== undefined
    ? values[range.leavingIndex]
    : null;
  const inCurrentWindow = (index: number) => range ? index >= range.left && index <= range.right : false;

  return (
    <div className="visualizer-panel sliding-viz-panel" aria-label="Sliding window visualizer">
      <div className="viz-header">
        <div>
          <span className="viz-title">Visualizer</span>
          <span className="viz-step-count">Step {activeStepIndex + 1} of {steps.length}</span>
        </div>
        <span className="viz-subtitle">Window size {range?.size ?? 3}</span>
      </div>

      <div className="viz-array-row sliding-viz-row" aria-label="Input values">
        {values.map((value, index) => {
          const isEntering = range?.enteringIndex === index;
          const isLeaving = range?.leavingIndex === index;
          return (
            <div
              className={`viz-cell${current.activeIndex === index ? " active" : ""}${
                inCurrentWindow(index) ? " query" : ""
              }${isEntering ? " entering" : ""}${isLeaving ? " leaving" : ""}`}
              key={`${index}-${value}`}
            >
              <span className="viz-cell-index">{index}</span>
              <span className="viz-cell-value">{value}</span>
            </div>
          );
        })}
      </div>

      <section className="sliding-current-window" aria-label="Current window details">
        <div>
          <span className="sliding-current-label">current window</span>
          <strong>{currentWindowLabel}</strong>
        </div>
        <div className="sliding-window-values" aria-label="Current window values">
          {currentWindowValues.length > 0 ? currentWindowValues.map((value, index) => (
            <span className="sliding-window-chip" key={`${index}-${value}`}>{value}</span>
          )) : <span className="sliding-window-empty">No full window yet</span>}
        </div>
        <code>{currentWindowExpression} = {current.total}</code>
      </section>

      <div className="sliding-window-track" aria-label="Current window bounds">
        <span>left {range && range.right >= range.left ? range.left : "-"}</span>
        <span>right {range && range.right >= range.left ? range.right : "-"}</span>
      </div>

      <div className="sliding-edge-row" aria-label="Window edge changes">
        <span>entering {enteringValue ?? "-"}</span>
        <span>leaving {leavingValue ?? "-"}</span>
      </div>

      <div className="sliding-viz-metrics">
        <div className="primary">
          <span className="viz-result-label">current sum</span>
          <span className="viz-result-value">{current.total}</span>
        </div>
        <div className="secondary">
          <span className="viz-result-label">best so far</span>
          <span className="viz-result-value">{bestValue ?? "-"}</span>
        </div>
      </div>

      <p className="viz-description">{current.description}</p>

      <div className="viz-controls">
        <button onClick={() => goTo(0)} aria-label="Go to start" title="Go to start" disabled={activeStepIndex === 0}>
          Start
        </button>
        <button onClick={() => goTo(activeStepIndex - 1)} aria-label="Previous step" title="Previous step" disabled={activeStepIndex === 0}>
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
        <button onClick={() => goTo(activeStepIndex + 1)} aria-label="Next step" title="Next step" disabled={activeStepIndex >= steps.length - 1}>
          Next
        </button>
        <button onClick={() => goTo(steps.length - 1)} aria-label="Go to end" title="Go to end" disabled={activeStepIndex >= steps.length - 1}>
          End
        </button>
      </div>

      <div className="viz-progress" aria-label="Visualizer steps">
        {steps.map((step, index) => (
          <button
            key={`${index}-${step.description}`}
            className={`viz-dot${index === activeStepIndex ? " active" : ""}${index < activeStepIndex ? " past" : ""}`}
            onClick={() => goTo(index)}
            aria-label={`Step ${index + 1}`}
            title={`Step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}