import { profile, copy } from "../../content";
import { useOmni } from "../../state/store";
import SplitHeading from "../common/SplitHeading";
import TextLink from "../common/TextLink";

export default function BootSection() {
  const reducedMotion = useOmni((s) => s.reducedMotion);

  const handleScrollToAbout = () => {
    document
      .querySelector<HTMLElement>('[data-section="about"]')
      ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <div className="chapter-view chapter-hero" aria-label="Introduction">
      <SplitHeading text={profile.name} as="h1" className="hero-title" />

      <div className="hero-side">
        <p className="hero-pitch">{copy.hero.tagline}</p>
        <TextLink text={copy.hero.cta} onClick={handleScrollToAbout} />
      </div>
    </div>
  );
}
