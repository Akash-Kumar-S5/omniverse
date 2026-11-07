import { profile, education, copy } from "../../content";
import { useOmni } from "../../state/store";
import SplitHeading from "../common/SplitHeading";
import TextLink from "../common/TextLink";

export default function AboutSection() {
  const reducedMotion = useOmni((s) => s.reducedMotion);

  const handleScrollToExperience = () => {
    document
      .querySelector<HTMLElement>('[data-section="experience"]')
      ?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <div className="chapter-view chapter-about" aria-label="About">
      <SplitHeading text={copy.about.title} as="h2" className="about-title" />

      <p className="about-pitch">{copy.about.lead}</p>

      <dl className="about-facts">
        <div>
          <dt>Based in</dt>
          <dd>{profile.location}</dd>
        </div>
        <div>
          <dt>Studied</dt>
          <dd>{education.institution}</dd>
        </div>
        <div>
          <dt>Working in</dt>
          <dd>React, Node.js, Laravel and Python</dd>
        </div>
      </dl>

      <div className="about-actions">
        <TextLink text={copy.about.cta} onClick={handleScrollToExperience} />
      </div>
    </div>
  );
}
