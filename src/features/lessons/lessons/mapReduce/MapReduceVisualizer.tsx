import { useEffect, useRef, useState } from "react";
import type { LessonVisualizerProps } from "../../types";

export function MapReduceVisualizer({ values, steps, stepIndex, onStepIndexChange }: LessonVisualizerProps) {
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
    }, 1000);

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

  const phase = current.mapReduce?.phase ?? "map";
  const mappedValues = current.mapReduce?.mappedValues ?? [];
  const activeIndex = current.activeIndex;
  const activeMappedIndex = current.mapReduce?.activeMappedIndex ?? null;

  return (
    <div className="visualizer-panel prefix-viz-panel" aria-label="Map and reduce visualizer">
      <div className="viz-header">
        <div>
          <span className="viz-title">Visualizer</span>
          <span className="viz-step-count">Step {activeStepIndex + 1} of {steps.length}</span>
        </div>
        <span className="viz-subtitle">{phase === "map" ? "Phase 1: Mapping (x * 2)" : phase === "reduce" ? "Phase 2: Reducing (Sum)" : "Done!"}</span>
      </div>

      {/* Row 1: Original input array */}
      <div className="prefix-viz-section" aria-label="Input array (arr)">
        <span className="prefix-viz-label">arr</span>
        <div className="viz-array-row prefix-viz-row">
          {values.map((value, index) => {
            const isMappingThis = phase === "map" && activeIndex === index;
            const isProcessed = phase !== "map" || (activeIndex !== null && index < activeIndex);
            return (
              <div
                className={`viz-cell${isMappingThis ? " active" : ""}${isProcessed ? " visited" : ""}`}
                key={`input-${index}-${value}`}
              >
                <span className="viz-cell-index">{index}</span>
                <span className="viz-cell-value">{value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 2: Mapped array */}
      <div className="prefix-viz-section" aria-label="Mapped array (mapped)">
        <span className="prefix-viz-label">mapped</span>
        <div className="viz-array-row prefix-viz-row">
          {mappedValues.map((value, index) => {
            const isReducingThis = phase === "reduce" && activeMappedIndex === index;
            const isProcessed = phase === "reduce" && activeMappedIndex !== null && index < activeMappedIndex;
            const isFinished = phase === "done";
            return (
              <div
                className={`viz-cell${isReducingThis ? " active" : ""}${(isProcessed || isFinished) ? " visited" : ""}`}
                key={`mapped-${index}`}
              >
                <span className="viz-cell-index">{index}</span>
                <span className="viz-cell-value">{value !== null ? value : "?"}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula area */}
      <div className="prefix-formula map-reduce-formula" aria-label="Step formula">
        {phase === "map" ? (
          activeIndex !== null ? (
            <>
              <code>transform({values[activeIndex]})</code>
              <span>=</span>
              <code>{values[activeIndex]} * 2</code>
              <span>=</span>
              <strong>{mappedValues[activeIndex]}</strong>
            </>
          ) : (
            <span>Preparing to map elements...</span>
          )
        ) : phase === "reduce" ? (
          activeMappedIndex !== null ? (
            <>
              <code>total</code>
              <span>=</span>
              <code>{current.variables?.previousAccumulator} + {current.variables?.["mapped[i]"]}</code>
              <span>=</span>
              <strong>{current.total}</strong>
            </>
          ) : (
            <>
              <code>total</code>
              <span>=</span>
              <strong>{current.variables?.accumulator ?? 0} (Initial)</strong>
            </>
          )
        ) : (
          <>
            <span>Final result:</span>
            <strong>{current.total}</strong>
          </>
        )}
      </div>

      {/* Description text */}
      <p className="viz-description">{current.description}</p>

      {/* Controls */}
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

      {/* Dots Progress Indicator */}
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
