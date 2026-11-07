import { useEffect, useRef, useState } from "react";
import { SECTIONS, useOmni, type Quality } from "../../state/store";
import "./Hud.css";

export interface HudProps {
  inert?: boolean;
}

function getKolkataTime(): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  } catch {
    // Fallback if environment lacks timezone data
    const d = new Date();
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const kolkata = new Date(utc + 3600000 * 5.5);
    return kolkata.toTimeString().slice(0, 8);
  }
}

export default function Hud({ inert }: HudProps = {}) {
  const section = useOmni((s) => s.section);
  const quality = useOmni((s) => s.quality);
  const setQuality = useOmni((s) => s.setQuality);

  // Live Kolkata clock state
  const [clockTime, setClockTime] = useState(getKolkataTime);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClockTime(getKolkataTime());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Update progress bar at 60fps without React re-renders on scroll
  useEffect(() => {
    const applyProgress = (p: number) => {
      if (progressLineRef.current) {
        progressLineRef.current.style.transform = `scaleX(${p})`;
      }
    };
    applyProgress(useOmni.getState().progress);
    return useOmni.subscribe((state) => {
      applyProgress(state.progress);
    });
  }, []);

  // Section index (01 to 05)
  const sectionIdx = SECTIONS.indexOf(section);
  const sectionNumber = String(Math.max(1, sectionIdx + 1)).padStart(2, "0");
  const sectionName = section.toUpperCase();

  // Scroll cue hides after "about"
  const showScrollCue = section === "boot" || section === "about";

  const handleSkipToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const aboutSection =
      document.querySelector<HTMLElement>('[data-section="about"]');
    if (aboutSection) {
      aboutSection.focus({ preventScroll: true });
      aboutSection.scrollIntoView({ behavior: "smooth" });
    } else {
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        mainContent.focus({ preventScroll: true });
        mainContent.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQualityChange = (newQuality: Quality) => {
    setQuality(newQuality);
  };

  const renderQualityToggle = () => (
    <div
      className="hud-quality-toggle"
      role="group"
      aria-label="Visual Quality mode"
    >
      <span className="hud-quality-label">PERF:</span>
      <button
        type="button"
        className={`hud-quality-btn ${quality === "lite" ? "active" : ""}`}
        onClick={() => handleQualityChange("lite")}
        aria-pressed={quality === "lite"}
        aria-label="Set quality mode to Lite"
      >
        LITE
      </button>
      <button
        type="button"
        className={`hud-quality-btn ${quality === "high" ? "active" : ""}`}
        onClick={() => handleQualityChange("high")}
        aria-pressed={quality === "high"}
        aria-label="Set quality mode to High"
      >
        HIGH
      </button>
    </div>
  );

  return (
    <aside
      className="hud-root"
      aria-label="Constellation HUD overlay"
      inert={inert}
    >
      {/* Keyboard-accessible skip link */}
      <a
        href="#about"
        className="hud-skip-link"
        onClick={handleSkipToContent}
      >
        Skip to content [Tab]
      </a>

      {/* Thin scroll progress line */}
      <div className="hud-progress-track" aria-hidden="true">
        <div ref={progressLineRef} className="hud-progress-fill" />
      </div>

      {/* Corner Brackets */}
      <div className="hud-bracket top-left" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M0 16 V0 H16" />
        </svg>
      </div>

      <div className="hud-bracket top-right" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M0 0 H16 V16" />
        </svg>
      </div>

      <div className="hud-bracket bottom-left" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M0 0 V16 H16" />
        </svg>
      </div>

      <div className="hud-bracket bottom-right" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 0 V16 H0" />
        </svg>
      </div>

      {/* Top-Left Corner: Name mark */}
      <div className="hud-corner top-left">
        <button
          type="button"
          className="hud-name-btn"
          onClick={handleScrollToTop}
          aria-label="Akash Kumar - AI Tooling and Systems. Scroll to top."
        >
          <div className="hud-name-header">
            <span className="hud-name-title">AKASH KUMAR</span>
            <span className="hud-mobile-status-dot" aria-hidden="true" />
          </div>
          <span className="hud-name-sub">AI TOOLING // SYSTEMS</span>
        </button>
      </div>

      {/* Top-Right Corner: Desktop (Clock + Status) / Mobile <=767px (Section Index + Quality Toggle) */}
      <div className="hud-corner top-right" aria-live="off">
        <div className="hud-desktop-status">
          <div className="hud-status-row">
            <span className="hud-status-dot" aria-hidden="true" />
            <span>STATUS:</span>
            <span className="hud-status-label">ONLINE</span>
          </div>
          <div className="hud-clock-row">
            <span>{clockTime} IST</span>
          </div>
        </div>

        <div className="hud-mobile-controls">
          <span className="hud-mobile-section" aria-hidden="true">
            {sectionNumber}/05
          </span>
          {renderQualityToggle()}
        </div>
      </div>

      {/* Bottom-Left Corner: Section Index (01/05) + Section Name */}
      <div className="hud-corner bottom-left" aria-live="polite">
        <div className="hud-section-row">
          <span className="hud-section-counter">
            {sectionNumber}/05
          </span>
          <span className="hud-section-name">{sectionName}</span>
        </div>
        <span className="hud-section-sub">CONSTELLATION HARNESS</span>
      </div>

      {/* Bottom-Right Corner: Quality Toggle + Scroll Cue (Desktop) */}
      <div className="hud-corner bottom-right">
        {/* Scroll Cue (hides after about) */}
        <div
          className={`hud-scroll-cue ${showScrollCue ? "visible" : "hidden"}`}
          aria-hidden={!showScrollCue}
        >
          <span>SCROLL</span>
          <span className="hud-scroll-icon" aria-hidden="true">↓</span>
        </div>

        <div className="hud-desktop-controls">
          {renderQualityToggle()}
        </div>
      </div>
    </aside>
  );
}
