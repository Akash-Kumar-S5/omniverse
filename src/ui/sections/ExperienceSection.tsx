import { useEffect } from "react";
import { experiences } from "../../content";
import { useOmni } from "../../state/store";

export default function ExperienceSection() {
  const activeRole = useOmni((s) => s.activeRole);
  const setActiveRole = useOmni((s) => s.setActiveRole);
  const section = useOmni((s) => s.section);
  const sectionProgress = useOmni((s) => s.sectionProgress);
  const reducedMotion = useOmni((s) => s.reducedMotion);

  // Sync scroll progress through experience section to activeRole
  useEffect(() => {
    if (section === "experience") {
      const currentRoleIdx = Math.min(
        experiences.length - 1,
        Math.max(0, Math.floor(sectionProgress * experiences.length))
      );
      if (currentRoleIdx !== activeRole) {
        setActiveRole(currentRoleIdx);
      }
    }
  }, [section, sectionProgress, activeRole, setActiveRole]);

  const scrollToRole = (idx: number) => {
    const el = document.querySelector<HTMLElement>('[data-section="experience"]');
    if (!el) return;
    const clamped = Math.max(0, Math.min(experiences.length - 1, idx));
    const targetProgress = (clamped + 0.5) / experiences.length;
    const top = el.offsetTop;
    const h = el.offsetHeight;
    const targetY = top + targetProgress * h - window.innerHeight * 0.5;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const clampedY = Math.max(0, Math.min(maxScroll, targetY));
    window.scrollTo({
      top: clampedY,
      behavior: reducedMotion ? "auto" : "smooth",
    });
    setActiveRole(clamped);
  };

  const currentRole = experiences[activeRole] || experiences[0];

  return (
    <section
      data-section="experience"
      className="section-container section-experience"
      aria-label="Work experience trajectory"
    >
      <div className="section-panel">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="section-eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          <span>Waypoint 02 // Experience ({activeRole + 1} of {experiences.length})</span>
        </div>

        <h2 className="section-title">Career Trajectory</h2>

        {/* Interactive role tabs */}
        <div className="exp-tabs" role="tablist" aria-label="Experience role selector">
          {experiences.map((exp, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={activeRole === idx}
              aria-controls={`role-panel-${idx}`}
              className={`exp-tab-btn ${activeRole === idx ? "active" : ""}`}
              onClick={() => scrollToRole(idx)}
            >
              0{idx + 1} {exp.company.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Active Role Card */}
        <article
          id={`role-panel-${activeRole}`}
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

        {/* Other 3 Role Cards in Compact Overview format */}
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
