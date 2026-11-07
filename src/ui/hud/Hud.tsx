import { useEffect, useRef, useState } from "react";
import { useOmni, type Quality, type SectionId } from "../../state/store";
import { profile } from "../../content";
import "./Hud.css";

export interface HudProps {
  inert?: boolean;
}

const NAV: { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const TIERS: { id: Quality; label: string }[] = [
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "lite", label: "Lite" },
];

function chennaiTime(): string {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: profile.timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
      .format(new Date())
      .replace(/\s?(am|pm)/i, (_, m: string) => ` ${m.toLowerCase()}`);
  } catch {
    return "";
  }
}

export default function Hud({ inert }: HudProps = {}) {
  const section = useOmni((s) => s.section);
  const quality = useOmni((s) => s.quality);
  const setQuality = useOmni((s) => s.setQuality);
  const reducedMotion = useOmni((s) => s.reducedMotion);

  const [time, setTime] = useState(chennaiTime);
  const [open, setOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // The one honest detail: local time in Chennai, to the minute.
  useEffect(() => {
    const id = window.setInterval(() => setTime(chennaiTime()), 20_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const apply = (p: number) => {
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    apply(useOmni.getState().progress);
    return useOmni.subscribe((s) => apply(s.progress));
  }, []);

  // Close the settings panel on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const goTo = (id: SectionId) => {
    const el = document.querySelector<HTMLElement>(`[data-section="${id}"]`);
    el?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  };

  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    goTo("about");
  };

  const tierLabel = TIERS.find((t) => t.id === quality)?.label ?? quality;

  return (
    <aside className="hud-root" aria-label="Site navigation" inert={inert}>
      <a href="#about" className="hud-skip-link" onClick={handleSkip}>
        Skip to content
      </a>

      <div className="hud-progress-track" aria-hidden="true">
        <div ref={progressRef} className="hud-progress-fill" />
      </div>

      <header className="hud-top">
        <button
          type="button"
          className="hud-name"
          onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })}
          aria-label="Akash Kumar, back to top"
        >
          Akash Kumar
        </button>

        <nav className="hud-nav" aria-label="Sections">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className="hud-nav-link"
              aria-current={section === item.id ? "true" : undefined}
              onClick={() => goTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hud-settings" ref={settingsRef}>
          <button
            type="button"
            className="hud-settings-toggle"
            aria-expanded={open}
            aria-controls="hud-settings-panel"
            onClick={() => setOpen((v) => !v)}
          >
            Graphics: {tierLabel}
          </button>
          {open && (
            <div id="hud-settings-panel" className="hud-settings-panel" role="group" aria-label="Graphics quality">
              {TIERS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="hud-tier"
                  aria-pressed={quality === t.id}
                  onClick={() => setQuality(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <footer className="hud-bottom">
        {time && (
          <p className="hud-time">
            Chennai, <time>{time}</time>
          </p>
        )}
      </footer>
    </aside>
  );
}
