import { useCallback, useEffect, useState } from "react";
import type { LessonVisualizerProps } from "../types";

export function PrefixSumsVisualizer({ values, steps, stepIndex, onStepIndexChange }: LessonVisualizerProps) {
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

  const prefixValues = current.prefixValues ?? [];
  const query = current.queryRange;
  const sourcePrefixIndex = current.activeIndex;
  const targetPrefixIndex = current.prefixIndex;
  const sourcePrefixValue = sourcePrefixIndex === null ? null : prefixValues[sourcePrefixIndex];
  const targetPrefixValue = targetPrefixIndex === null || targetPrefixIndex === undefined ? null : prefixValues[targetPrefixIndex];
  const activeValue = current.activeIndex === null ? null : values[current.activeIndex];
  const showBuildFormula =
    !query &&
    current.activeIndex !== null &&
    targetPrefixIndex !== null &&
    targetPrefixIndex !== undefined &&
    sourcePrefixValue !== null &&
    sourcePrefixValue !== undefined &&
    targetPrefixValue !== null &&
    targetPrefixValue !== undefined &&
    activeValue !== null &&
    activeValue !== undefined;

  return (
    <div className="visualizer-panel prefix-viz-panel" aria-label="Prefix sums visualizer">
      <div className="viz-header">
        <div>
          <span className="viz-title">Visualizer</span>
          <span className="viz-step-count">Step {activeStepIndex + 1} of {steps.length}</span>
        </div>
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
            const isSource = !query && sourcePrefixIndex === index && targetPrefixIndex !== index;
            return (
              <div
                className={`viz-cell${targetPrefixIndex === index ? " active" : ""}${
                  value !== null && targetPrefixIndex !== index ? " visited" : ""
                }${isSource ? " source" : ""}${isQueryStart || isQueryEnd ? " query" : ""}`}
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
        ) : showBuildFormula ? (
          <>
            <code>prefix[{targetPrefixIndex}]</code>
            <span>=</span>
            <code>prefix[{sourcePrefixIndex}]</code>
            <span>+</span>
            <code>nums[{current.activeIndex}]</code>
            <span>=</span>
            <strong>{targetPrefixValue}</strong>
          </>
        ) : (
          <span>Build prefix[i + 1] from prefix[i] + nums[i]</span>
        )}
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
              setSyncedStepIndex(0);
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