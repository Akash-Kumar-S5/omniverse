import { profile } from "../../content";
import { useOmni } from "../../state/store";

export default function BootSection() {
  const reducedMotion = useOmni((s) => s.reducedMotion);

  const handleScrollToAbout = () => {
    const aboutEl = document.querySelector<HTMLElement>('[data-section="about"]');
    if (aboutEl) {
      aboutEl.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <div className="chapter-view chapter-boot" aria-label="Introduction and Boot sequence">
      <div className="section-panel">
        <div className="sheet-handle" aria-hidden="true" />
        <div className="section-eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          <span>System Online // Constellation Ready</span>
        </div>
        <h1 className="section-title">{profile.name}</h1>
        <p className="section-subtitle">{profile.role} • Agent Architectures</p>
        <p className="section-description">
          Welcome to the Agent Constellation. A 3D interactive cosmos where projects form connected nodes, tech
          stacks orbit as satellites, and autonomous agents traverse the edges.
        </p>
        <div className="btn-group">
          <button
            type="button"
            onClick={handleScrollToAbout}
            className="btn-primary"
            aria-label="Scroll down to explore about section"
          >
            <span>Explore Constellation</span>
            <span aria-hidden="true">↓</span>
          </button>
        </div>
      </div>
    </div>
  );
}
