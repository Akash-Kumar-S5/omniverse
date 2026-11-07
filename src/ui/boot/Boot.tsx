import { useCallback, useEffect, useRef, useState } from "react";
import { useOmni } from "../../state/store";
import "./Boot.css";

interface BootStep {
  text: string;
  tag: string;
}

const BOOT_STEPS: BootStep[] = [
  { text: "initializing omniverse runtime", tag: "ok" },
  { text: "mounting constellation graph", tag: "ok" },
  { text: "seeding project topology", tag: "4 clusters" },
  { text: "resolving tech satellites", tag: "18 entities" },
  { text: "spawning autonomous agents", tag: "8 nodes" },
  { text: "calibrating camera spline", tag: "ready" },
  { text: "agent mesh synchronized", tag: "online" },
];

export default function Boot() {
  const booted = useOmni((s) => s.booted);
  const reducedMotion = useOmni((s) => s.reducedMotion);

  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const doneRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);

  const addTimeout = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  const finishBoot = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setIsFading(true);
    // Allow fade-out transition to complete before marking booted
    window.setTimeout(() => {
      useOmni.getState().setBooted();
    }, 280);
  }, []);

  useEffect(() => {
    // If already booted, nothing to do
    if (booted) return;

    // Fast-path for reduced motion
    if (reducedMotion) {
      setStepIndex(BOOT_STEPS.length);
      setProgress(100);
      const id = window.setTimeout(() => {
        finishBoot();
      }, 300);
      return () => window.clearTimeout(id);
    }

    // Normal typing and progress sequence (~2.2s total, capped under 2.5s)
    const totalSteps = BOOT_STEPS.length;
    const stepInterval = 250; // 7 steps * 250ms = 1750ms

    for (let i = 1; i <= totalSteps; i++) {
      addTimeout(() => {
        setStepIndex(i);
      }, i * stepInterval);
    }

    // Smooth progress updates
    const start = performance.now();
    const duration = 1900;
    let animId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        animId = requestAnimationFrame(tick);
      }
    };
    animId = requestAnimationFrame(tick);

    // Fade out and finish at 2200ms
    addTimeout(() => {
      finishBoot();
    }, 2200);

    return () => {
      cancelAnimationFrame(animId);
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, [booted, reducedMotion, addTimeout, finishBoot]);

  // Keyboard shortcut listener to skip
  useEffect(() => {
    if (booted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        finishBoot();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [booted, finishBoot]);

  if (booted) {
    return null;
  }

  const visibleSteps = BOOT_STEPS.slice(0, stepIndex);

  return (
    <div
      className={`boot-container ${isFading ? "boot-fading" : ""}`}
      onClick={finishBoot}
      role="status"
      aria-live="polite"
      aria-label="Boot preloader. Click or press Escape to skip."
    >
      <div className="boot-window">
        <div className="boot-header">
          <div className="boot-header-dots" aria-hidden="true">
            <span className="boot-dot active" />
            <span className="boot-dot" />
            <span className="boot-dot" />
          </div>
          <span className="boot-title">Omniverse // Boot Sequence</span>
          <span className="boot-title" style={{ opacity: 0.6 }}>v2.4</span>
        </div>

        <div className="boot-content">
          <ul className="boot-log-list">
            {visibleSteps.map((step, idx) => (
              <li key={idx} className="boot-log-line">
                <span className="prefix">&gt;</span>
                <span>{step.text}...</span>
                <span className="status-tag">[{step.tag}]</span>
              </li>
            ))}
            {!reducedMotion && stepIndex < BOOT_STEPS.length && (
              <li className="boot-log-line" aria-hidden="true">
                <span className="prefix">&gt;</span>
                <span className="boot-cursor" />
              </li>
            )}
          </ul>

          <div className="boot-progress-section">
            <div className="boot-progress-info">
              <span>SYSTEM INITIALIZATION</span>
              <span>{progress}%</span>
            </div>
            <div className="boot-progress-bar-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="boot-progress-bar-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="boot-footer">
          <span>HOST: CHENNAI [13.0827° N, 80.2707° E]</span>
          <span className="boot-skip-hint">
            Press <kbd>ESC</kbd> or click to skip
          </span>
        </div>
      </div>
    </div>
  );
}
