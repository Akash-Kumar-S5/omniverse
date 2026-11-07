import { useEffect, useRef, useCallback } from "react";
import { projects, copy } from "../../content";
import { useOmni } from "../../state/store";
import SplitHeading from "../common/SplitHeading";
import RollingCta from "../common/RollingCta";

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
  const mouseStartRef = useRef<{ x: number; y: number } | null>(null);

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

  // Arrow key navigation
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

  // Touch swipe handling
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

  // Mouse drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on left click and not on interactive buttons/links
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button, a")) return;
    mouseStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!mouseStartRef.current) return;
    const dx = e.clientX - mouseStartRef.current.x;
    const dy = e.clientY - mouseStartRef.current.y;
    mouseStartRef.current = null;

    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="project-editorial-layout">
        <div className="project-meta-row">
          <div className="section-eyebrow" style={{ margin: 0 }}>
            <span className="eyebrow-dot" aria-hidden="true" />
            <span>{copy.projects.eyebrow}</span>
          </div>
          <span className="project-display-counter" aria-live="polite">
            {counterText}
          </span>
        </div>

        <div className="project-badges">
          <span className="project-category-tag">{project.category}</span>
          {project.featured && <span className="project-featured-tag">★ Featured</span>}
        </div>

        <SplitHeading
          key={project.title}
          text={project.title}
          as="h2"
          className="project-display-title"
        />

        {project.hook && <p className="project-hook">{project.hook}</p>}

        <p className="project-display-desc">{project.description}</p>

        <ul className="project-tech-tags" aria-label="Project technologies">
          {project.tags.map((tag) => (
            <li key={tag} className="tag-pill">
              {tag}
            </li>
          ))}
        </ul>

        <div className="project-actions">
          {project.live && (
            <RollingCta
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              text="Live Demo"
              icon="↗"
              variant="primary"
              ariaLabel={`Open live application for ${project.title}`}
            />
          )}
          {project.github && (
            <RollingCta
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              text="GitHub"
              icon="↗"
              variant="secondary"
              ariaLabel={`View source code for ${project.title} on GitHub`}
            />
          )}
        </div>

        {/* Project Navigation Footer */}
        <div className="project-nav-footer">
          <button
            type="button"
            className="project-step-btn"
            onClick={() => scrollToProject(currentNavTarget - 1)}
            disabled={currentNavTarget === 0}
            aria-label="Previous project"
          >
            {copy.projects.ctaPrev}
          </button>

          <div className="project-pips-track" role="tablist" aria-label="Jump to project">
            {projects.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                tabIndex={activeProject === idx ? 0 : -1}
                aria-selected={activeProject === idx}
                aria-label={`Jump to project ${idx + 1}`}
                className={`project-pip-item ${activeProject === idx ? "active" : ""}`}
                onClick={() => scrollToProject(idx)}
              />
            ))}
          </div>

          <button
            type="button"
            className="project-step-btn"
            onClick={() => scrollToProject(currentNavTarget + 1)}
            disabled={currentNavTarget === projects.length - 1}
            aria-label="Next project"
          >
            {copy.projects.ctaNext}
          </button>
        </div>
      </div>
    </div>
  );
}
