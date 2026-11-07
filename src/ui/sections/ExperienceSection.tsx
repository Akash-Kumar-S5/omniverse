import { useEffect, useRef, useCallback } from "react";
import { experiences } from "../../content";
import { useOmni } from "../../state/store";

export default function ExperienceSection() {
  const activeRole = useOmni((s) => s.activeRole);
  const setActiveRole = useOmni((s) => s.setActiveRole);
  const section = useOmni((s) => s.section);
  const sectionProgress = useOmni((s) => s.sectionProgress);
  const reducedMotion = useOmni((s) => s.reducedMotion);

  const targetRef = useRef<number | null>(null);
  const targetYRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Clear target tracking only on arrival or scrollend, with a ~2000ms safety timeout
  useEffect(() => {
    const clearTarget = () => {
      targetRef.current = null;
      targetYRef.current = null;
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
    };

    const onScroll = () => {
      if (targetYRef.current !== null && Math.abs(window.scrollY - targetYRef.current) <= 2) {
        clearTarget();
      }
    };

    window.addEventListener("scrollend", clearTarget);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scrollend", clearTarget);
      window.removeEventListener("scroll", onScroll);
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const scrollToRole = useCallback(
    (idx: number) => {
      const el = document.querySelector<HTMLElement>('[data-section="experience"]');
      if (!el) return;
      const clamped = Math.max(0, Math.min(experiences.length - 1, idx));

      targetRef.current = clamped;
      setActiveRole(clamped);

      const targetProgress = (clamped + 0.5) / experiences.length;
      const top = el.offsetTop;
      const h = el.offsetHeight;
      const targetY = top + targetProgress * h - window.innerHeight * 0.5;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const clampedY = Math.max(0, Math.min(maxScroll, targetY));
      targetYRef.current = clampedY;

      window.scrollTo({
        top: clampedY,
        behavior: reducedMotion ? "auto" : "smooth",
      });

      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = window.setTimeout(() => {
        targetRef.current = null;
        targetYRef.current = null;
      }, 2000);
    },
    [reducedMotion, setActiveRole]
  );

  // Sync scroll progress through experience section to activeRole, skipping while targetRef is active
  useEffect(() => {
    if (section === "experience") {
      if (targetRef.current !== null) return;

      const currentRoleIdx = Math.min(
        experiences.length - 1,
        Math.max(0, Math.floor(sectionProgress * experiences.length))
      );
      if (currentRoleIdx !== activeRole) {
        setActiveRole(currentRoleIdx);
      }
    }
  }, [section, sectionProgress, activeRole, setActiveRole]);

  // Arrow-key roving on the tablist
  const handleTablistKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIdx = (activeRole + 1) % experiences.length;
      scrollToRole(nextIdx);
      tabRefs.current[nextIdx]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIdx = (activeRole - 1 + experiences.length) % experiences.length;
      scrollToRole(prevIdx);
      tabRefs.current[prevIdx]?.focus();
    }
  };

  // Derive short role label dynamically from exp.role
  const getRoleTabLabel = (exp: (typeof experiences)[number], idx: number) => {
    const num = `0${idx + 1}`;
    const r = exp.role.toLowerCase();
    let short = exp.role;
    if (r.includes("senior") || r.includes("sr.")) short = "Sr. Eng";
    else if (r.includes("associate")) short = "Assoc. Eng";
    else if (r.includes("full-stack") || r.includes("fullstack")) short = "Full-Stack";
    else if (r.includes("intern")) short = "Intern";
    else if (r.includes("lead")) short = "Lead Eng";
    else if (r.includes("engineer")) short = "Engineer";
    else if (r.includes("developer")) short = "Developer";
    else {
      const words = exp.role.split(" ");
      short = words.length > 2 ? words.slice(0, 2).join(" ") : exp.role;
    }
    return `${num} ${short}`;
  };

  const currentRole = experiences[activeRole] || experiences[0];

  return (
    <section
      data-section="experience"
      className="section-container section-experience"
      style={{ minHeight: `${experiences.length * 60}vh` }}
      aria-label="Work experience trajectory"
    >
      <div className="section-panel">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="section-eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          <span>Waypoint 02 // Experience ({activeRole + 1} of {experiences.length})</span>
        </div>

        <h2 className="section-title">Career Trajectory</h2>

        {/* Interactive role tabs with left/right roving navigation */}
        <div
          className="exp-tabs"
          role="tablist"
          aria-label="Experience role selector"
          onKeyDown={handleTablistKeyDown}
        >
          {experiences.map((exp, idx) => (
            <button
              key={idx}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              tabIndex={activeRole === idx ? 0 : -1}
              aria-selected={activeRole === idx}
              aria-controls="role-panel-active"
              className={`exp-tab-btn ${activeRole === idx ? "active" : ""}`}
              onClick={() => scrollToRole(idx)}
            >
              {getRoleTabLabel(exp, idx)}
            </button>
          ))}
        </div>

        {/* Single fixed tabpanel id for the active Role Card */}
        <article
          id="role-panel-active"
          role="tabpanel"
          className="role-card-active"
          aria-label={`${currentRole.role} at ${currentRole.company}`}
        >
          <div className="role-header">
            <span className="role-company">{currentRole.company}</span>
            <span className="role-period">{currentRole.period}</span>
          </div>
          <div className="role-title">{currentRole.role}</div>
          <div className="role-location">{currentRole.location}</div>
          <p style={{ margin: "0 0 10px 0", fontSize: "0.85rem", color: "var(--fg-dim)" }}>
            {currentRole.description}
          </p>

          <strong style={{ fontSize: "0.8rem", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
            Key Achievements:
          </strong>
          <ul className="achievements-list">
            {currentRole.achievements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </article>

        {/* Other Role Cards in Compact Overview format */}
        <div style={{ marginTop: "12px" }}>
          {experiences.map((exp, idx) => {
            if (idx === activeRole) return null;
            return (
              <button
                key={idx}
                type="button"
                className="role-card-compact"
                onClick={() => scrollToRole(idx)}
                aria-label={`Switch to role ${idx + 1}: ${exp.role} at ${exp.company}`}
              >
                <div>
                  <strong>{exp.company}</strong> — {exp.role}
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>
                  {exp.period} →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
