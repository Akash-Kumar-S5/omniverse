import { profile, education } from "../../content";
import { useOmni } from "../../state/store";

export default function AboutSection() {
  const reducedMotion = useOmni((s) => s.reducedMotion);

  const handleScrollToExperience = () => {
    const expEl = document.querySelector<HTMLElement>('[data-section="experience"]');
    if (expEl) {
      expEl.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <section
      data-section="about"
      tabIndex={-1}
      className="section-container section-about"
      aria-label="About Akash Kumar"
    >
      <div className="section-panel">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="section-eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          <span>Waypoint 01 // Profile</span>
        </div>

        {reducedMotion ? (
          <>
            <h2 className="section-title reveal-fade">{profile.name}</h2>
            <p className="section-subtitle reveal-fade">{profile.role}</p>
          </>
        ) : (
          <>
            <h2 className="section-title" aria-label={profile.name}>
              {profile.name.split("").map((char, i) => (
                <span
                  key={i}
                  className="reveal-char"
                  style={{ animationDelay: `${i * 35}ms` }}
                  aria-hidden="true"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h2>
            <p className="section-subtitle" aria-label={profile.role}>
              {profile.role.split("").map((char, i) => (
                <span
                  key={i}
                  className="reveal-char"
                  style={{ animationDelay: `${profile.name.length * 20 + i * 25}ms` }}
                  aria-hidden="true"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </p>
          </>
        )}

        <p className="section-description">{profile.pitch}</p>

        <div className="contact-meta" style={{ marginBottom: "18px" }}>
          <div>
            <strong style={{ color: "var(--fg)" }}>Location:</strong> {profile.location} ({profile.timezone})
          </div>
          <div>
            <strong style={{ color: "var(--fg)" }}>Education:</strong> {education.institution}
          </div>
        </div>

        <div className="btn-group">
          <button
            type="button"
            onClick={handleScrollToExperience}
            className="btn-secondary"
            aria-label="View work experience"
          >
            <span>View Experience</span>
            <span aria-hidden="true">↓</span>
          </button>
        </div>
      </div>
    </section>
  );
}
