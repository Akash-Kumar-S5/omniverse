import { useEffect, useState, useCallback, useRef } from "react";
import { useOmni } from "../../state/store";
import { copy } from "../../content";
import "./Boot.css";

export default function Boot() {
  const entered = useOmni((s) => s.entered);
  const loadProgress = useOmni((s) => s.loadProgress);
  const reducedMotion = useOmni((s) => s.reducedMotion);
  const quality = useOmni((s) => s.quality);

  const [displayProgress, setDisplayProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [mounted, setMounted] = useState(true);
  const animFrameRef = useRef(0);

  const handleEnter = useCallback(() => {
    if (isFading) return;
    setIsFading(true);
    useOmni.getState().setEntered();
    useOmni.getState().setBooted();
    window.setTimeout(() => setMounted(false), 400);
  }, [isFading]);

  // Skip the gate for reduced motion and lite mode.
  useEffect(() => {
    if (reducedMotion || quality === "lite") {
      useOmni.getState().setEntered();
      useOmni.getState().setBooted();
      setMounted(false);
    }
  }, [reducedMotion, quality]);

  // Ease the shown percentage toward the real load progress.
  useEffect(() => {
    if (entered) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const floorProgress = Math.min(100, Math.floor(((now - startTime) / 1200) * 100));
      const target = Math.max(loadProgress, floorProgress);
      setDisplayProgress((prev) => {
        if (prev >= 100) return 100;
        return Math.min(100, prev + Math.max(1, Math.ceil((target - prev) * 0.1)));
      });
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [loadProgress, entered]);

  // Enter, Space or Escape lets you in.
  useEffect(() => {
    if (entered) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [entered, handleEnter]);

  if (!mounted || entered) return null;

  const isReady = displayProgress >= 100;

  return (
    <div
      className={`gate-overlay ${isFading ? "gate-fading" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
    >
      <div className="gate-grid">
        <h1 className="gate-name">
          Akash
          <br />
          <em>Kumar</em>
        </h1>

        <div className="gate-side">
          <p className="gate-line">{copy.hero.tagline}</p>

          {!isReady ? (
            <div className="gate-progress">
              <div
                className="gate-bar-track"
                role="progressbar"
                aria-label="Loading the 3D scene"
                aria-valuenow={displayProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="gate-bar-fill" style={{ width: `${displayProgress}%` }} />
              </div>
              <span className="gate-pct" aria-hidden="true">
                Loading {displayProgress}%
              </span>
            </div>
          ) : (
            <button type="button" className="text-link gate-enter" onClick={handleEnter}>
              Come in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
