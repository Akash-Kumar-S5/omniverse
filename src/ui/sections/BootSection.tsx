import { profile } from "../../content";
import { useOmni } from "../../state/store";
import SplitHeading from "../common/SplitHeading";
import RollingCta from "../common/RollingCta";

export default function BootSection() {
  const reducedMotion = useOmni((s) => s.reducedMotion);

  const handleScrollToAbout = () => {
    const aboutEl = document.querySelector<HTMLElement>('[data-section="about"]');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  const pitchText =
    profile.pitch ||
    "I build the tooling that lets AI agents do real work: harnesses, orchestration, developer tools.";

  return (
    <div className="chapter-view chapter-hero" aria-label="Hero Introduction">
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="hero-dot" aria-hidden="true" />
          <span>{profile.role} // AGENT HARNESS ARCHITECT</span>
        </div>

        <SplitHeading
          text={profile.name.toUpperCase()}
          as="h1"
          className="hero-title"
        />

        <p className="hero-pitch">{pitchText}</p>

        <div className="hero-actions">
          <RollingCta
            text="Explore Constellation"
            icon="↓"
            onClick={handleScrollToAbout}
            ariaLabel="Explore Constellation. Scroll to About section."
          />
        </div>
      </div>
    </div>
  );
}
