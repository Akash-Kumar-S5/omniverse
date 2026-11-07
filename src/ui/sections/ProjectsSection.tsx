import { useEffect, useRef, useCallback } from "react";
import { projects } from "../../content";
import { useOmni } from "../../state/store";

export default function ProjectsSection() {
  const activeProject = useOmni((s) => s.activeProject);
  const setActiveProject = useOmni((s) => s.setActiveProject);
  const section = useOmni((s) => s.section);
  const sectionProgress = useOmni((s) => s.sectionProgress);
  const reducedMotion = useOmni((s) => s.reducedMotion);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Scroll window to match the target project position in the 800vh section
  const scrollToProject = useCallback(
    (index: number) => {
      const el = document.querySelector<HTMLElement>('[data-section="projects"]');
      if (!el) return;
      const total = projects.length;
      const clamped = Math.max(0, Math.min(total - 1, index));
      const targetProgress = (clamped + 0.5) / total;
      const top = el.offsetTop;
      const h = el.offsetHeight;
      const targetY = top + targetProgress * h - window.innerHeight * 0.5;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const clampedY = Math.max(0, Math.min(maxScroll, targetY));
      window.scrollTo({
        top: clampedY,
        behavior: reducedMotion ? "auto" : "smooth",
      });
      setActiveProject(clamped);
    },
    [reducedMotion, setActiveProject]
  );

  // Sync scroll progress through projects section to activeProject
  useEffect(() => {
    if (section === "projects") {
      const targetIdx = Math.min(
        projects.length - 1,
        Math.max(0, Math.floor(sectionProgress * projects.length))
      );
      if (targetIdx !== activeProject) {
        setActiveProject(targetIdx);
      }
    }
  }, [section, sectionProgress, activeProject, setActiveProject]);

  // Arrow key navigation when in projects section
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const currentSection = useOmni.getState().section;
      if (currentSection !== "projects") return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (activeProject > 0) {
          scrollToProject(activeProject - 1);
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (activeProject < projects.length - 1) {
          scrollToProject(activeProject + 1);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeProject, scrollToProject]);

  // Horizontal touch swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Detect horizontal swipe
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0 && activeProject < projects.length - 1) {
        scrollToProject(activeProject + 1);
      } else if (dx > 0 && activeProject > 0) {
        scrollToProject(activeProject - 1);
      }
    }
  };

  const project = projects[activeProject] || projects[0];
  const counterText = `${String(activeProject + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;

  return (
    <section
      data-section="projects"
      className="section-container section-projects"
      aria-label="Featured projects constellation"
    >
      <div
        className="section-panel"
        tabIndex={0}
        aria-label={`Project ${counterText}: ${project.title}. Use left and right arrow keys to navigate.`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="sheet-handle" aria-hidden="true" />

        <div className="projects-header-row">
          <div className="section-eyebrow" style={{ margin: 0 }}>
            <span className="eyebrow-dot" aria-hidden="true" />
            <span>Waypoint 03 // Constellation</span>
          </div>
          <span className="projects-counter" aria-live="polite">
            {counterText}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
          <span className="projects-category-badge">{project.category}</span>
          {project.featured && <span className="featured-badge">★ Featured</span>}
        </div>

        <h2 className="section-title">{project.title}</h2>
        <p className="section-description">{project.description}</p>

        {/* Tech tags */}
        <ul className="tags-list" aria-label="Project technologies">
          {project.tags.map((tag) => (
            <li key={tag} className="tag-item">
              {tag}
            </li>
          ))}
        </ul>

        {/* Project Links */}
        <div className="btn-group" style={{ marginBottom: "16px" }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              aria-label={`View source code for ${project.title} on GitHub`}
            >
              <span>GitHub</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              aria-label={`Open live application for ${project.title}`}
            >
              <span>Live Demo</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>

        {/* Navigation Controls: Prev, Next, Pips */}
        <div className="project-nav-row">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => scrollToProject(activeProject - 1)}
            disabled={activeProject === 0}
            aria-label="Previous project"
          >
            ← Prev
          </button>

          {/* Quick jump pips */}
          <div className="project-pips" role="tablist" aria-label="Project selectors">
            {projects.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={activeProject === idx}
                aria-label={`Jump to project ${idx + 1}`}
                className={`project-pip ${activeProject === idx ? "active" : ""}`}
                onClick={() => scrollToProject(idx)}
              />
            ))}
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => scrollToProject(activeProject + 1)}
            disabled={activeProject === projects.length - 1}
            aria-label="Next project"
          >
            Next →
          </button>
        </div>
      </div>
    </section>
  );
}
