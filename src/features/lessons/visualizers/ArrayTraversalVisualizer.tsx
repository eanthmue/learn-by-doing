import { useEffect, useRef, useState } from "react";
import type { LessonVisualizerProps } from "../types";

export function ArrayTraversalVisualizer({ values, steps, stepIndex, onStepIndexChange }: LessonVisualizerProps) {
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

  return (
    <div className="visualizer-panel" aria-label="Step-by-step visualizer">
      <div className="viz-header">
        <div>
          <span className="viz-title">Visualizer</span>
          <span className="viz-step-count">Step {activeStepIndex + 1} of {steps.length}</span>
        </div>
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
        <button onClick={() => goTo(0)} aria-label="Go to start" title="Go to start" disabled={activeStepIndex === 0}>
          Start
        </button>
        <button onClick={() => goTo(activeStepIndex - 1)} aria-label="Previous step" title="Previous step" disabled={activeStepIndex === 0}>
          Back
        </button>
        <button
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

      <div className="viz-progress">
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
