import { useChapter } from "../../state/chapters";
import { useOmni } from "../../state/store";
import Spacers from "./Spacers";
import BootSection from "./BootSection";
import AboutSection from "./AboutSection";
import ExperienceSection from "./ExperienceSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";
import "./sections.css";

export default function Sections() {
  const { active, phase } = useChapter();
  const reducedMotion = useOmni((s) => s.reducedMotion);

  return (
    <>
      {/* Background scrim to ensure high contrast against the 3D scene */}
      <div className="sections-scrim-left" aria-hidden="true" />

      {/* Empty spacer sections that establish scroll length for useScrollSync */}
      <Spacers />

      {/* One fixed overlay layer rendering ONLY the active chapter */}
      <div
        className="chapter-overlay-root"
        data-active-chapter={active}
        data-phase={phase}
      >
        <div className="chapter-stage">
          <div
            key={active}
            className={`chapter-active ${reducedMotion ? "no-motion" : `phase-${phase}`}`}
          >
            {active === "boot" && <BootSection />}
            {active === "about" && <AboutSection />}
            {active === "experience" && <ExperienceSection />}
            {active === "projects" && <ProjectsSection />}
            {active === "contact" && <ContactSection />}
          </div>
        </div>
      </div>
    </>
  );
}
