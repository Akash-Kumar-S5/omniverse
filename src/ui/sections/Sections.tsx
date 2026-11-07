import "./sections.css";
import BootSection from "./BootSection";
import AboutSection from "./AboutSection";
import ExperienceSection from "./ExperienceSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";

export default function Sections() {
  return (
    <>
      {/* Background scrim to ensure high contrast against the 3D scene */}
      <div className="sections-scrim-left" aria-hidden="true" />

      {/* Five core sections in exact SectionId order required by useScrollSync */}
      <BootSection />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}
