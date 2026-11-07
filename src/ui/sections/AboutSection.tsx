import { profile, education, copy } from "../../content";
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
          <span>{copy.about.eyebrow}</span>
        </div>

        <SplitHeading
          text={copy.about.title}
          as="h2"
          className="about-title"
        />

        <p className="about-pitch">{copy.about.lead}</p>

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
            <span className="about-meta-val">{education.institution}</span>
          </div>
        </div>

        <div className="about-actions">
          <RollingCta
            text={copy.about.cta}
            icon="↓"
            onClick={handleScrollToExperience}
            ariaLabel={`${copy.about.cta}. Scroll to Experience section.`}
          />
        </div>
      </div>
    </div>
  );
}
