import { useEffect, useRef, useCallback } from "react";
import { projects } from "../../content";
import { useOmni } from "../../state/store";

export default function ProjectsSection() {
  const activeProject = useOmni((s) => s.activeProject);
  const setActiveProject = useOmni((s) => s.setActiveProject);
  const section = useOmni((s) => s.section);
  const sectionProgress = useOmni((s) => s.sectionProgress);
  const reducedMotion = useOmni((s) => s.reducedMotion);

  const targetRef = useRef<number | null>(null);
  const targetYRef = useRef<number | null>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Clear target tracking only on arrival or scrollend, with a ~2000ms safety timeout
  useEffect(() => {
    const clearTarget = () => {
      targetRef.current = null;
      targetYRef.current = null;
      if (scrollTimerRef.current) {
        window.clearTimeout(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
    };

    const onScroll = () => {
      if (targetYRef.current !== null && Math.abs(window.scrollY - targetYRef.current) <= 2) {
        clearTarget();
      }
    };

    window.addEventListener("scrollend", clearTarget);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scrollend", clearTarget);
      window.removeEventListener("scroll", onScroll);
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
    };
  }, []);

  // Scroll window to match target project position in projects section
  const scrollToProject = useCallback(
    (index: number) => {
      const el = document.querySelector<HTMLElement>('[data-section="projects"]');
      if (!el) return;
      const total = projects.length;
      const clamped = Math.max(0, Math.min(total - 1, index));

      // Guard: set targetRef immediately and update store state so UI updates instantly
      targetRef.current = clamped;
      setActiveProject(clamped);

      const targetProgress = (clamped + 0.5) / total;
      const top = el.offsetTop;
      const h = el.offsetHeight;
      const targetY = top + targetProgress * h - window.innerHeight * 0.5;
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const clampedY = Math.max(0, Math.min(maxScroll, targetY));
      targetYRef.current = clampedY;

      window.scrollTo({
        top: clampedY,
        behavior: reducedMotion ? "auto" : "smooth",
      });

      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = window.setTimeout(() => {
        targetRef.current = null;
        targetYRef.current = null;
      }, 2000);
    },
    [reducedMotion, setActiveProject]
  );

  // Sync scroll progress through projects section to activeProject, skipping while targetRef is active
  useEffect(() => {
    if (section === "projects") {
      if (targetRef.current !== null) return;

      const targetIdx = Math.min(
        projects.length - 1,
        Math.max(0, Math.floor(sectionProgress * projects.length))
      );
      if (targetIdx !== activeProject) {
        setActiveProject(targetIdx);
      }
    }
  }, [section, sectionProgress, activeProject, setActiveProject]);

  // Arrow key navigation computed from targetRef ?? activeProject
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const currentSection = useOmni.getState().section;
      if (currentSection !== "projects") return;

      const currentTarget = targetRef.current ?? activeProject;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (currentTarget > 0) {
          scrollToProject(currentTarget - 1);
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (currentTarget < projects.length - 1) {
          scrollToProject(currentTarget + 1);
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

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      const currentTarget = targetRef.current ?? activeProject;
      if (dx < 0 && currentTarget < projects.length - 1) {
        scrollToProject(currentTarget + 1);
      } else if (dx > 0 && currentTarget > 0) {
        scrollToProject(currentTarget - 1);
      }
    }
  };

  const currentNavTarget = targetRef.current ?? activeProject;
  const project = projects[activeProject] || projects[0];
  const counterText = `${String(activeProject + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;

  return (
    <div
      className="chapter-view chapter-projects"
      aria-label="Featured projects constellation"
    >
      <div
        className="section-panel"
        role="region"
        tabIndex={0}
        aria-label="Featured projects"
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
            onClick={() => scrollToProject(currentNavTarget - 1)}
            disabled={currentNavTarget === 0}
            aria-label="Previous project"
          >
            ← Prev
          </button>

          {/* Quick jump pips using plain buttons with aria-current */}
          <div className="project-pips" aria-label="Project selectors">
            {projects.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-current={activeProject === idx ? "step" : undefined}
                aria-label={`Jump to project ${idx + 1}`}
                className={`project-pip ${activeProject === idx ? "active" : ""}`}
                onClick={() => scrollToProject(idx)}
              />
            ))}
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => scrollToProject(currentNavTarget + 1)}
            disabled={currentNavTarget === projects.length - 1}
            aria-label="Next project"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
