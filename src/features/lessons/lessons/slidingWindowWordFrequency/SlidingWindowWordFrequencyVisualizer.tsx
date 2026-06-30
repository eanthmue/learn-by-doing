import { useEffect, useMemo, useRef, useState } from "react";
import type { LessonVisualizerProps, VisualizerStep } from "../../types";
import type { WordBundleExample } from "./slidingWindowWordFrequency";

type CountRowProps = {
  word: string;
  required: number;
  current: number;
};

function CountRow({ word, required, current }: CountRowProps) {
  const status = current === required ? "match" : current > required ? "excess" : "missing";

  return (
    <div className={`word-viz-count-row ${status}`}>
      <span>{word}</span>
      <strong>{current}</strong>
      <span>/</span>
      <strong>{required}</strong>
    </div>
  );
}

function getCountWords(step: VisualizerStep | undefined, bundle: string[]) {
  const requiredCounts = step?.wordWindow?.requiredCounts ?? {};
  const words = new Set([...bundle, ...Object.keys(requiredCounts)]);
  return Array.from(words).sort();
}

export function SlidingWindowWordFrequencyVisualizer({
  values,
  steps,
  stepIndex,
  onStepIndexChange,
}: LessonVisualizerProps<WordBundleExample>) {
  const [playing, setPlaying] = useState(false);
  const activeStepIndex = Math.max(0, Math.min(stepIndex ?? 0, steps.length - 1));
  const current = steps[activeStepIndex] ?? steps[0];
  const wordWindow = current?.wordWindow;

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
    }, 950);

    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  const goTo = (index: number) => {
    setPlaying(false);
    const clampedIndex = Math.max(0, Math.min(index, steps.length - 1));
    onStepIndexChange?.(clampedIndex);
  };

  const countWords = useMemo(() => getCountWords(current, values.bundle), [current, values.bundle]);

  if (!current || !wordWindow) {
    return null;
  }

  const hasWindow = wordWindow.rightStart >= wordWindow.leftStart;
  const matchedStartSet = new Set(wordWindow.matchedStarts);
  const isInWindow = (start: number) => hasWindow && start >= wordWindow.leftStart && start <= wordWindow.rightStart;

  return (
    <div className="visualizer-panel sliding-viz-panel word-viz-panel" aria-label="Word frequency sliding window visualizer">
      <div className="viz-header">
        <div>
          <span className="viz-title">Visualizer</span>
          <span className="viz-step-count">Step {activeStepIndex + 1} of {steps.length}</span>
        </div>
        <span className="viz-subtitle">offset {wordWindow.offset} | width {wordWindow.wordLength}</span>
      </div>

      <section className="word-viz-stream" aria-label="Audit log chunks">
        <span className="word-viz-stream-label">stream</span>
        <code>{values.stream}</code>
      </section>

      <div className="viz-array-row sliding-viz-row word-viz-row" aria-label="Fixed-width chunks in the current alignment">
        {wordWindow.chunks.map((chunk) => {
          const isActive = wordWindow.activeStart === chunk.start;
          const isEntering = wordWindow.enteringStart === chunk.start;
          const isLeaving = wordWindow.leavingStart === chunk.start;
          const isMatched = matchedStartSet.has(chunk.start);

          return (
            <div
              className={`viz-cell word-viz-cell${isActive ? " active" : ""}${
                isInWindow(chunk.start) ? " query" : ""
              }${isEntering ? " entering" : ""}${isLeaving ? " leaving" : ""}${isMatched ? " source" : ""}`}
              key={`${wordWindow.offset}-${chunk.start}-${chunk.value}`}
            >
              <span className="viz-cell-index">{chunk.start}</span>
              <span className="viz-cell-value">{chunk.value}</span>
            </div>
          );
        })}
      </div>

      <section className="word-viz-checklist" aria-label="Required and current word counts">
        <div>
          <span className="sliding-current-label">required bundle</span>
          <div className="word-viz-bundle">
            {values.bundle.map((word, index) => (
              <span className="sliding-window-chip" key={`${word}-${index}`}>{word}</span>
            ))}
          </div>
        </div>
        <div>
          <span className="sliding-current-label">current counts</span>
          <div className="word-viz-counts">
            {countWords.map((word) => (
              <CountRow
                key={word}
                word={word}
                required={wordWindow.requiredCounts[word] ?? 0}
                current={wordWindow.windowCounts[word] ?? 0}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="sliding-window-track" aria-label="Current word window bounds">
        <span>left {hasWindow ? wordWindow.leftStart : "-"}</span>
        <span>right {hasWindow ? wordWindow.rightStart : "-"}</span>
      </div>

      <div className="sliding-viz-metrics word-viz-metrics">
        <div className="primary">
          <span className="viz-result-label">matched words</span>
          <span className="viz-result-value">{current.total}</span>
        </div>
        <div className="secondary">
          <span className="viz-result-label">starts</span>
          <span className="viz-result-value">{wordWindow.matchedStarts.length > 0 ? wordWindow.matchedStarts.join(",") : "-"}</span>
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