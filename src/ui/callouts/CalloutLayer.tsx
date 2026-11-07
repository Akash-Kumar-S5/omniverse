import { useEffect, useRef } from "react";
import { anchors, type Anchor } from "../../state/anchors";
import { useOmni } from "../../state/store";
import { useChapter } from "../../state/chapters";
import { projects, profile } from "../../content";
import "./callouts.css";

/* Callouts say one true, specific thing each: the city, and the project in view. */
export default function CalloutLayer() {
  const entered = useOmni((s) => s.entered);
  // Each callout is mounted only while its chapter is the one on screen.
  const { active } = useChapter();
  const activeProject = useOmni((s) => s.activeProject);
  const shownProject = projects[activeProject] || projects[0];

  const dotCityRef = useRef<SVGCircleElement>(null);
  const lineCityRef = useRef<SVGPathElement>(null);
  const labelCityRef = useRef<HTMLDivElement>(null);

  const dotProjectRef = useRef<SVGCircleElement>(null);
  const lineProjectRef = useRef<SVGPathElement>(null);
  const labelProjectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;


    const updateItem = (
      anchor: Anchor,
      dot: SVGCircleElement | null,
      line: SVGPathElement | null,
      label: HTMLDivElement | null,
      dx: number,
      dy: number,
      viewWidth: number,
      isMobile: boolean,
      labelWidth = 150
    ) => {
      if (!dot || !line || !label) return;
      if (!anchor.visible || !anchor.x || !anchor.y) {
        dot.style.display = "none";
        line.style.display = "none";
        label.style.opacity = "0";
        return;
      }

      const ax = anchor.x;
      const ay = anchor.y;

      let targetDx = isMobile ? dx * 0.55 : dx;
      const targetDy = isMobile ? dy * 0.55 : dy;

      if (ax + targetDx + labelWidth > viewWidth - 16) {
        targetDx = -Math.abs(targetDx) - labelWidth;
      } else if (ax + targetDx < 16) {
        targetDx = 20;
      }

      const elbowX = ax + (targetDx > 0 ? 20 : -20);
      const elbowY = ay + targetDy;
      const endX = ax + targetDx;

      dot.style.display = "block";
      dot.setAttribute("cx", ax.toFixed(1));
      dot.setAttribute("cy", ay.toFixed(1));

      line.style.display = "block";
      line.setAttribute(
        "d",
        `M ${ax.toFixed(1)} ${ay.toFixed(1)} L ${elbowX.toFixed(1)} ${elbowY.toFixed(1)} L ${endX.toFixed(1)} ${elbowY.toFixed(1)}`
      );

      label.style.opacity = "1";
      label.style.transform = `translate3d(${endX.toFixed(1)}px, ${(elbowY - 12).toFixed(1)}px, 0)`;
    };

    const update = () => {
      const isMobile = window.innerWidth <= 767;
      const viewWidth = window.innerWidth;

      // City label is desktop only.
      // Refs are null unless that chapter is mounted; updateItem ignores null refs.
      if (!isMobile) {
        updateItem(anchors["about.city"], dotCityRef.current, lineCityRef.current, labelCityRef.current, 75, 40, viewWidth, isMobile);
      }
      updateItem(anchors["projects.active"], dotProjectRef.current, lineProjectRef.current, labelProjectRef.current, 75, -40, viewWidth, isMobile);

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!entered) return null;

  return (
    <>
      <svg className="callout-svg-root" aria-hidden="true">
        {active === "about" && (
          <>
            <circle ref={dotCityRef} r="2.5" className="callout-anchor-dot" />
            <path ref={lineCityRef} className="callout-leader-line" />
          </>
        )}
        {active === "projects" && (
          <>
            <circle ref={dotProjectRef} r="2.5" className="callout-anchor-dot" />
            <path ref={lineProjectRef} className="callout-leader-line" />
          </>
        )}
      </svg>

      <div className="callout-labels-root" aria-hidden="true">
        {active === "about" && (
          <div ref={labelCityRef} className="callout-chip">
            <span className="callout-chip-title">{profile.location.split(",")[0]}</span>
          </div>
        )}

        {active === "projects" && (
          <div ref={labelProjectRef} className="callout-chip">
            <span className="callout-chip-title">
              {shownProject.title}
            </span>
            <span className="callout-chip-sub">
              {shownProject.tags.slice(0, 2).join(", ")}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
