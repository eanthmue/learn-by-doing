import { useEffect, useState } from "react";
import type { LessonVisualizerProps } from "../types";

export function PrefixSumsVisualizer({ values, steps }: LessonVisualizerProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = steps[stepIndex] ?? steps[0];

  useEffect(() => {
    setStepIndex(0);
    setPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!playing) {
      return;
    }

    const timer = window.setInterval(() => {
      setStepIndex((previous) => {
        if (previous >= steps.length - 1) {
          setPlaying(false);
          return previous;
        }
        return previous + 1;
      });
    }, 900);

    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  const goTo = (index: number) => {
    setPlaying(false);
    setStepIndex(Math.max(0, Math.min(index, steps.length - 1)));
  };

  if (!current) {
    return null;
  }

  const prefixValues = current.prefixValues ?? [];
  const query = current.queryRange;

  return (
    <div className="visualizer-panel prefix-viz-panel" aria-label="Prefix sums visualizer">
      <div className="viz-header">
        <span className="viz-title">Visualizer</span>
        <span className="viz-subtitle">Prefix sums for [{values.join(", ")}]</span>
      </div>

      <div className="prefix-viz-section" aria-label="Input values">
        <span className="prefix-viz-label">nums</span>
        <div className="viz-array-row prefix-viz-row">
          {values.map((value, index) => {
            const inQueryRange = query ? index >= query.left && index <= query.right : false;
            return (
              <div
                className={`viz-cell${current.activeIndex === index ? " active" : ""}${
                  current.activeIndex !== null && index < current.activeIndex ? " visited" : ""
                }${inQueryRange ? " query" : ""}`}
                key={`${index}-${value}`}
              >
                <span className="viz-cell-index">{index}</span>
                <span className="viz-cell-value">{value}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="prefix-viz-section" aria-label="Prefix sum values">
        <span className="prefix-viz-label">prefix</span>
        <div className="viz-array-row prefix-viz-row">
          {prefixValues.map((value, index) => {
            const isQueryStart = query?.startPrefixIndex === index;
            const isQueryEnd = query?.endPrefixIndex === index;
            return (
              <div
                className={`viz-cell${current.prefixIndex === index ? " active" : ""}${
                  value !== null && current.prefixIndex !== index ? " visited" : ""
                }${isQueryStart || isQueryEnd ? " query" : ""}`}
                key={`prefix-${index}`}
              >
                <span className="viz-cell-index">{index}</span>
                <span className="viz-cell-value">{value ?? "?"}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="prefix-formula" aria-label="Range sum formula">
        {query ? (
          <>
            <code>prefix[{query.endPrefixIndex}]</code>
            <span>-</span>
            <code>prefix[{query.startPrefixIndex}]</code>
            <span>=</span>
            <strong>{query.result ?? "?"}</strong>
          </>
        ) : (
          <span>Build prefix[i + 1] from prefix[i] + nums[i]</span>
        )}
      </div>

      <p className="viz-description">{current.description}</p>

      <div className="viz-controls">
        <button onClick={() => goTo(0)} aria-label="Go to start" disabled={stepIndex === 0}>|&lt;</button>
        <button onClick={() => goTo(stepIndex - 1)} aria-label="Previous step" disabled={stepIndex === 0}>&lt;</button>
        <button
          onClick={() => {
            if (stepIndex >= steps.length - 1) {
              setStepIndex(0);
            }
            setPlaying((wasPlaying) => !wasPlaying);
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button onClick={() => goTo(stepIndex + 1)} aria-label="Next step" disabled={stepIndex >= steps.length - 1}>&gt;</button>
        <button onClick={() => goTo(steps.length - 1)} aria-label="Go to end" disabled={stepIndex >= steps.length - 1}>&gt;|</button>
      </div>

      <div className="viz-progress">
        {steps.map((step, index) => (
          <button
            key={`${index}-${step.description}`}
            className={`viz-dot${index === stepIndex ? " active" : ""}${index < stepIndex ? " past" : ""}`}
            onClick={() => goTo(index)}
            aria-label={`Step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}