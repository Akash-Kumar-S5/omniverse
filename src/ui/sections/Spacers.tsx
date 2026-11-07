import { experiences, projects } from "../../content";

export default function Spacers() {
  return (
    <div className="scroll-spacers" aria-hidden="true">
      <section data-section="boot" className="spacer-section spacer-boot" />
      <section data-section="about" className="spacer-section spacer-about" />
      <section
        data-section="experience"
        className="spacer-section spacer-experience"
        style={{ height: `${experiences.length * 60}vh` }}
      />
      <section
        data-section="projects"
        className="spacer-section spacer-projects"
        style={{ height: `${projects.length * 100}vh` }}
      />
      <section data-section="contact" className="spacer-section spacer-contact" />
    </div>
  );
}
