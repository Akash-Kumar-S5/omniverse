import { profile, copy } from "../../content";
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

  return (
    <div className="chapter-view chapter-hero" aria-label="Hero Introduction">
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="hero-dot" aria-hidden="true" />
          <span>{copy.hero.eyebrow}</span>
        </div>

        <SplitHeading
          text={profile.name.toUpperCase()}
          as="h1"
          className="hero-title"
        />

        <p className="hero-pitch">{copy.hero.tagline}</p>

        <div className="hero-actions">
          <RollingCta
            text={copy.hero.cta}
            icon="↓"
            onClick={handleScrollToAbout}
            ariaLabel={`${copy.hero.cta}. Scroll to About section.`}
          />
        </div>
      </div>
    </div>
  );
}
