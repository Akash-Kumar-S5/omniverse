import { useEffect, useRef } from "react";
import { anchors, type Anchor } from "../../state/anchors";
import { useOmni } from "../../state/store";
import { projects } from "../../content";
import "./callouts.css";

function getKolkataTime(): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  } catch {
    const d = new Date();
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const kolkata = new Date(utc + 3600000 * 5.5);
    return kolkata.toTimeString().slice(0, 8);
  }
}

export default function CalloutLayer() {
  const entered = useOmni((s) => s.entered);

  const dotHeroRef = useRef<SVGCircleElement>(null);
  const lineHeroRef = useRef<SVGPathElement>(null);
  const labelHeroRef = useRef<HTMLDivElement>(null);

  const dotAboutObjRef = useRef<SVGCircleElement>(null);
  const lineAboutObjRef = useRef<SVGPathElement>(null);
  const labelAboutObjRef = useRef<HTMLDivElement>(null);

  const dotAboutCityRef = useRef<SVGCircleElement>(null);
  const lineAboutCityRef = useRef<SVGPathElement>(null);
  const labelAboutCityRef = useRef<HTMLDivElement>(null);

  const dotProjectsRef = useRef<SVGCircleElement>(null);
  const lineProjectsRef = useRef<SVGPathElement>(null);
  const labelProjectsRef = useRef<HTMLDivElement>(null);
  const labelProjectsStackRef = useRef<HTMLSpanElement>(null);

  const dotContactRef = useRef<SVGCircleElement>(null);
  const lineContactRef = useRef<SVGPathElement>(null);
  const labelContactRef = useRef<HTMLDivElement>(null);
  const labelContactTimeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let rafId = 0;
    let lastActiveProject = -1;
    let lastTimeSec = -1;

    const updateItem = (
      anchor: Anchor,
      dot: SVGCircleElement | null,
      line: SVGPathElement | null,
      label: HTMLDivElement | null,
      dx: number,
      dy: number,
      viewWidth: number,
      isMobile: boolean,
      labelWidth = 140
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
      const endY = elbowY;

      dot.style.display = "block";
      dot.setAttribute("cx", ax.toFixed(1));
      dot.setAttribute("cy", ay.toFixed(1));

      line.style.display = "block";
      line.setAttribute("d", `M ${ax.toFixed(1)} ${ay.toFixed(1)} L ${elbowX.toFixed(1)} ${elbowY.toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)}`);

      label.style.opacity = "1";
      const labelX = targetDx > 0 ? endX : endX;
      const labelY = endY - 14;
      label.style.transform = `translate3d(${labelX.toFixed(1)}px, ${labelY.toFixed(1)}px, 0)`;
    };

    const update = () => {
      const isMobile = window.innerWidth <= 767;
      const viewWidth = window.innerWidth;

      // 1. Hero constellation core
      updateItem(
        anchors["hero.core"],
        dotHeroRef.current,
        lineHeroRef.current,
        labelHeroRef.current,
        80,
        -45,
        viewWidth,
        isMobile
      );

      // 2. About object
      updateItem(
        anchors["about.object"],
        dotAboutObjRef.current,
        lineAboutObjRef.current,
        labelAboutObjRef.current,
        80,
        -40,
        viewWidth,
        isMobile
      );

      // 3. About city (suppressed on mobile)
      if (!isMobile) {
        updateItem(
          anchors["about.city"],
          dotAboutCityRef.current,
          lineAboutCityRef.current,
          labelAboutCityRef.current,
          75,
          40,
          viewWidth,
          isMobile
        );
      } else if (dotAboutCityRef.current && lineAboutCityRef.current && labelAboutCityRef.current) {
        dotAboutCityRef.current.style.display = "none";
        lineAboutCityRef.current.style.display = "none";
        labelAboutCityRef.current.style.opacity = "0";
      }

      // 4. Projects active node
      const currProject = useOmni.getState().activeProject;
      if (currProject !== lastActiveProject && labelProjectsStackRef.current) {
        lastActiveProject = currProject;
        const proj = projects[currProject] || projects[0];
        labelProjectsStackRef.current.textContent = proj.tags.slice(0, 3).join(" • ");
      }
      updateItem(
        anchors["projects.active"],
        dotProjectsRef.current,
        lineProjectsRef.current,
        labelProjectsRef.current,
        75,
        -40,
        viewWidth,
        isMobile
      );

      // 5. Contact beacon
      const nowSec = Math.floor(Date.now() / 1000);
      if (nowSec !== lastTimeSec && labelContactTimeRef.current) {
        lastTimeSec = nowSec;
        labelContactTimeRef.current.textContent = `${getKolkataTime()} IST`;
      }
      updateItem(
        anchors["contact.beacon"],
        dotContactRef.current,
        lineContactRef.current,
        labelContactRef.current,
        70,
        -40,
        viewWidth,
        isMobile
      );

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!entered) return null;

  return (
    <>
      <svg className="callout-svg-root" aria-hidden="true">
        <circle ref={dotHeroRef} r="2.5" className="callout-anchor-dot" />
        <path ref={lineHeroRef} className="callout-leader-line" />

        <circle ref={dotAboutObjRef} r="2.5" className="callout-anchor-dot" />
        <path ref={lineAboutObjRef} className="callout-leader-line" />

        <circle ref={dotAboutCityRef} r="2.5" className="callout-anchor-dot" />
        <path ref={lineAboutCityRef} className="callout-leader-line" />

        <circle ref={dotProjectsRef} r="2.5" className="callout-anchor-dot" />
        <path ref={lineProjectsRef} className="callout-leader-line" />

        <circle ref={dotContactRef} r="2.5" className="callout-anchor-dot" />
        <path ref={lineContactRef} className="callout-leader-line" />
      </svg>

      <div className="callout-labels-root" aria-hidden="true">
        <div ref={labelHeroRef} className="callout-chip">
          <span className="callout-chip-title">orchestrator.ts</span>
          <span className="callout-chip-sub">agents: 8 // synchronized</span>
        </div>

        <div ref={labelAboutObjRef} className="callout-chip">
          <span className="callout-chip-title">architecture.ts</span>
          <span className="callout-chip-sub">agent harness // eval loop</span>
        </div>

        <div ref={labelAboutCityRef} className="callout-chip">
          <span className="callout-chip-title">based in chennai</span>
          <span className="callout-chip-sub">13.08° N, 80.27° E</span>
        </div>

        <div ref={labelProjectsRef} className="callout-chip">
          <span className="callout-chip-title">project node</span>
          <span ref={labelProjectsStackRef} className="callout-chip-sub">
            {projects[0].tags.slice(0, 3).join(" • ")}
          </span>
        </div>

        <div ref={labelContactRef} className="callout-chip">
          <span className="callout-chip-title">beacon // live clock</span>
          <span ref={labelContactTimeRef} className="callout-chip-sub">
            {getKolkataTime()} IST
          </span>
        </div>
      </div>
    </>
  );
}
