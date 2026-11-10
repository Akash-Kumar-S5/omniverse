import { useEffect, useState, useCallback, useRef } from "react";
import { useOmni } from "../../state/store";
import { copy } from "../../content";
import "./Boot.css";

// Fixed (not random) so renders are stable: x %, delay s, duration s, sideways drift px
const EMBERS = [
  [8, 0, 9, 30], [17, 3.2, 11, -20], [26, 1.4, 8, 40], [34, 5.1, 12, -35], [43, 2.3, 10, 25],
  [51, 6.4, 9, -15], [58, 0.8, 13, 45], [66, 4.0, 10, -40], [73, 2.9, 8, 20], [81, 5.7, 11, -25],
  [88, 1.1, 9, 35], [94, 3.8, 12, -30],
].map(([x, delay, dur, drift]) => ({ x, delay, dur, drift }));

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
    // matches the 900ms fade in Boot.css
    window.setTimeout(() => setMounted(false), 900);
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
      <div className="gate-embers" aria-hidden="true">
        {EMBERS.map((e, i) => (
          <span
            key={i}
            style={{ left: `${e.x}%`, animationDelay: `${e.delay}s`, animationDuration: `${e.dur}s`, ["--drift" as string]: `${e.drift}px` }}
          />
        ))}
      </div>

      <div className="gate-stack">
        <h1 className="gate-name">Akash Kumar</h1>
        <div className="gate-rule" aria-hidden="true" />
        <p className="gate-line">{copy.hero.tagline}</p>

        <div className="gate-action">
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
                Kindling {displayProgress}%
              </span>
            </div>
          ) : (
            <button type="button" className="gate-enter" onClick={handleEnter} aria-label="Enter the site">
              <span className="gate-enter-key">Press Enter</span>
              <span className="gate-enter-tap">Tap to enter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
