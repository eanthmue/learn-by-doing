import { useCallback, useEffect, useState } from "react";
import type { LessonVisualizerProps } from "../types";

export function ArrayTraversalVisualizer({ values, steps, stepIndex, onStepIndexChange }: LessonVisualizerProps) {
  const [internalStepIndex, setInternalStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const activeStepIndex = Math.max(0, Math.min(stepIndex ?? internalStepIndex, steps.length - 1));
  const current = steps[activeStepIndex] ?? steps[0];

  const setSyncedStepIndex = useCallback((nextIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(nextIndex, steps.length - 1));
    setInternalStepIndex(clampedIndex);
    onStepIndexChange?.(clampedIndex);
  }, [onStepIndexChange, steps.length]);

  useEffect(() => {
    setPlaying(false);
    setSyncedStepIndex(0);
  }, [setSyncedStepIndex]);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const timer = window.setInterval(() => {
      const nextIndex = activeStepIndex + 1;
      if (nextIndex >= steps.length) {
        setPlaying(false);
        return;
      }

      setSyncedStepIndex(nextIndex);
    }, 900);

    return () => window.clearInterval(timer);
  }, [activeStepIndex, playing, setSyncedStepIndex, steps.length]);

  const goTo = (index: number) => {
    setPlaying(false);
    setSyncedStepIndex(index);
  };

  if (!current) {
    return null;
  }

  return (
    <div className="visualizer-panel" aria-label="Step-by-step visualizer">
      <div className="viz-header">
        <span className="viz-title">Visualizer</span>
        <span className="viz-subtitle">Sum of [{values.join(", ")}]</span>
      </div>

      <div className="viz-array-row">
        {values.map((value, index) => (
          <div
            className={`viz-cell${current.activeIndex === index ? " active" : ""}${
              current.activeIndex !== null && index < current.activeIndex ? " visited" : ""
            }`}
            key={`${index}-${value}`}
          >
            <span className="viz-cell-index">{index}</span>
            <span className="viz-cell-value">{value}</span>
          </div>
        ))}
      </div>

      <div className="viz-result-bar">
        <span className="viz-result-label">total</span>
        <span className="viz-result-value">{current.total}</span>
      </div>

      <p className="viz-description">{current.description}</p>

      <div className="viz-controls">
        <button onClick={() => goTo(0)} aria-label="Go to start" disabled={activeStepIndex === 0}>|&lt;</button>
        <button onClick={() => goTo(activeStepIndex - 1)} aria-label="Previous step" disabled={activeStepIndex === 0}>&lt;</button>
        <button
          onClick={() => {
            if (activeStepIndex >= steps.length - 1) {
              setSyncedStepIndex(0);
            }
            setPlaying((wasPlaying) => !wasPlaying);
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button onClick={() => goTo(activeStepIndex + 1)} aria-label="Next step" disabled={activeStepIndex >= steps.length - 1}>&gt;</button>
        <button onClick={() => goTo(steps.length - 1)} aria-label="Go to end" disabled={activeStepIndex >= steps.length - 1}>&gt;|</button>
      </div>

      <div className="viz-progress">
        {steps.map((step, index) => (
          <button
            key={`${index}-${step.description}`}
            className={`viz-dot${index === activeStepIndex ? " active" : ""}${index < activeStepIndex ? " past" : ""}`}
            onClick={() => goTo(index)}
            aria-label={`Step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
