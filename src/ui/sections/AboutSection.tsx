import { profile, education } from "../../content";
import { useOmni } from "../../state/store";
import SplitHeading from "../common/SplitHeading";
import RollingCta from "../common/RollingCta";

export default function AboutSection() {
  const reducedMotion = useOmni((s) => s.reducedMotion);

  const handleScrollToExperience = () => {
    const expEl = document.querySelector<HTMLElement>('[data-section="experience"]');
    if (expEl) {
      expEl.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <div className="chapter-view chapter-about" aria-label="About Akash Kumar">
      <div className="about-content">
        <div className="section-eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          <span>01 // PRINCIPAL IDENTITY</span>
        </div>

        <SplitHeading
          text="Engineering Autonomous Agent Systems"
          as="h2"
          className="about-title"
        />

        <p className="about-pitch">{profile.pitch}</p>

        <div className="about-meta">
          <div className="about-meta-row">
            <span className="about-meta-label">LOCATION:</span>
            <span className="about-meta-val">{profile.location} (13.08° N, 80.27° E)</span>
          </div>
          <div className="about-meta-row">
            <span className="about-meta-label">FOCUS:</span>
            <span className="about-meta-val">Harnesses, Evaluation, Tooling</span>
          </div>
          <div className="about-meta-row">
            <span className="about-meta-label">EDUCATION:</span>
            <span className="about-meta-val">{education.institution} — {education.degree}</span>
          </div>
        </div>

        <div className="about-actions">
          <RollingCta
            text="View Experience"
            icon="↓"
            onClick={handleScrollToExperience}
            ariaLabel="View work experience. Scroll to Experience section."
          />
        </div>
      </div>
    </div>
  );
}
