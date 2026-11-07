import { useEffect, useState, useCallback, useRef } from "react";
import { useOmni } from "../../state/store";
import { profile } from "../../content";
import RollingCta from "../common/RollingCta";
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
    window.setTimeout(() => {
      setMounted(false);
    }, 400);
  }, [isFading]);

  // Fast-path: Skip the gate automatically for reduced motion and lite mode
  useEffect(() => {
    if (reducedMotion || quality === "lite") {
      useOmni.getState().setEntered();
      useOmni.getState().setBooted();
      setMounted(false);
    }
  }, [reducedMotion, quality]);

  // Smooth counter animation interpolating toward loadProgress (0 to 100)
  useEffect(() => {
    if (entered) return;

    const target = Math.max(loadProgress, 0);
    // If scene loadProgress hasn't started yet, advance to at least simulated progress
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      // Ensure steady progress reaches 100 within ~1.2s if assets finish quickly
      const floorProgress = Math.min(100, Math.floor((elapsed / 1200) * 100));
      const currentTarget = Math.max(target, floorProgress, loadProgress);

      setDisplayProgress((prev) => {
        if (prev >= 100) return 100;
        const next = prev + Math.max(1, Math.ceil((currentTarget - prev) * 0.1));
        return Math.min(100, next);
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [loadProgress, entered]);

  // Keyboard listener: Enter, Escape, or Space to enter/skip
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
      aria-label="Preloader and Enter Experience gate"
    >
      {/* Corner editorial readouts */}
      <div className="gate-corner top-left" aria-hidden="true">
        <span className="gate-meta-title">AKASH KUMAR</span>
        <span className="gate-meta-sub">2026 ARCHIVE</span>
      </div>

      <div className="gate-corner top-right" aria-hidden="true">
        <span className="gate-meta-title">HOST: CHENNAI</span>
        <span className="gate-meta-sub">13.08° N, 80.27° E</span>
      </div>

      <div className="gate-corner bottom-left" aria-hidden="true">
        <span className="gate-meta-title">OMNIVERSE RUNTIME</span>
        <span className="gate-meta-sub">AGENT CONSTELLATION</span>
      </div>

      <div className="gate-corner bottom-right" aria-hidden="true">
        <span className="gate-meta-title">INTERACTION</span>
        <span className="gate-meta-sub">PRESS [ENTER] OR CLICK</span>
      </div>

      {/* Main Center Editorial Stage */}
      <div className="gate-center-content">
        <div className="gate-eyebrow">
          <span className="gate-eyebrow-dot" aria-hidden="true" />
          <span>INITIALIZING AGENT SYSTEMS</span>
        </div>

        <h1 className="gate-display-name">AKASH KUMAR</h1>
        <p className="gate-role-pitch">
          {profile.role} — Harnesses, Orchestration & AI Developer Tools
        </p>

        {/* Dynamic Progress or Enter Gate */}
        <div className="gate-action-area">
          {!isReady ? (
            <div className="gate-progress-box">
              <div className="gate-progress-header">
                <span className="gate-progress-label">SYNCHRONIZING SCENE</span>
                <span className="gate-progress-pct" aria-live="polite">
                  {displayProgress}%
                </span>
              </div>
              <div
                className="gate-bar-track"
                role="progressbar"
                aria-valuenow={displayProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="gate-bar-fill"
                  style={{ width: `${displayProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="gate-enter-box">
              <RollingCta
                text="Enter Experience"
                icon="→"
                onClick={handleEnter}
                variant="primary"
                className="gate-enter-btn"
                ariaLabel="Enter Experience. Start 3D cosmos."
              />
              <span className="gate-enter-shortcut">
                PRESS <kbd>ENTER</kbd> OR <kbd>SPACE</kbd> TO ENTER
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
