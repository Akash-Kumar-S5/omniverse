// Orchestrator-owned composition.
import { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useOmni } from "../state/store";
import SceneGuard from "./SceneGuard";
import { omniDiag, resetDiag } from "./omniDiag";
import CameraRig from "./camera/CameraRig";
import Starfield from "./fx/Starfield";
import Effects from "./fx/Effects";
import { World, LoadProgress } from "./world";
import { AnchorWriters } from "./anchors";
import { SignalField } from "./particles";
import spotsData from "../../public/assets/models/sanctum.spots.json";
import type { SanctumSpots } from "../state/signal";

const sanctumSpots = spotsData as unknown as SanctumSpots;

/** r39: while the page scrolls, render at most 1.25x pixels; restore the full cap 350 ms after the last scroll */
function ScrollDpr({ full }: { full: number }) {
  const setDpr = useThree((s) => s.setDpr);
  useEffect(() => {
    let t = 0;
    let low = false;
    const cap = Math.min(window.devicePixelRatio || 1, full);
    const onScroll = () => {
      if (cap <= 1.25) return;
      if (!low) {
        low = true;
        setDpr(1.25);
      }
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        low = false;
        setDpr(cap);
      }, 350);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(t);
    };
  }, [setDpr, full]);
  return null;
}

export default function Experience() {
  const quality = useOmni((s) => s.quality);
  const entered = useOmni((s) => s.entered);
  const section = useOmni((s) => s.section);
  const setAdaptiveQuality = useOmni((s) => s.setAdaptiveQuality);
  // r32: sample frame rate only after the load spike, so a slow first load cannot drop the tier to lite
  const [perfOn, setPerfOn] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setPerfOn(true), 5000);
    return () => window.clearTimeout(id);
  }, []);
  const handleIncline = () => {
    const current = useOmni.getState().quality;
    if (current === "medium") {
      setAdaptiveQuality("high");
    } else if (current === "lite") {
      setAdaptiveQuality("medium");
    }
  };

  const handleDecline = () => {
    const current = useOmni.getState().quality;
    if (current === "high") {
      setAdaptiveQuality("medium");
    } else if (current === "medium") {
      setAdaptiveQuality("lite");
    }
  };

  const handleFallback = () => {
    setAdaptiveQuality("lite");
  };

  // r34: watchdog. It runs on a timer, not requestAnimationFrame, so it still works when rAF is paused or starved.
  // 1) no frame for 200 ms: drive frames with advance() until rAF resumes. 2) a lost context (even one that restores: the composer breaks on restore), no first frame in
  // 4 s, or a frame that is only the clear colour 3 checks in a row: recreate the Canvas (at most 3 times).
  const [gen, setGen] = useState(0);
  useEffect(() => {
    resetDiag();
    const id = window.setInterval(() => {
      const now = performance.now();
      const d = omniDiag;
      const idle = now - (d.lastFrameAt || d.mountedAt);
      if (idle > 200 && d.advance) {
        d.driven++;
        d.advance(now);
      }
      const dead = (d.lostAt > 0 && now - d.lostAt > 1000) || (d.frames === 0 && now - d.mountedAt > 4000) || d.blankSamples >= 3;
      if (dead && d.remounts < 3) {
        d.remounts++;
        console.info("omni: recreating the canvas", { frames: d.frames, lost: d.lost, blank: d.blankSamples, driven: d.driven });
        setGen((g) => g + 1);
      }
    }, 50);
    return () => window.clearInterval(id);
  }, [gen]);

  return (
    <Canvas
      key={gen}
      frameloop="always" // r31: never "never": a tab that loads while document.hidden (background or occluded window) used to stay on a blank canvas, the browser already pauses rAF for hidden pages
      dpr={quality === "lite" ? 1 : [1, 1.5]}
      gl={{ antialias: false, powerPreference: "high-performance" }}
      camera={{ fov: 62, near: 0.1, far: 200, position: [-4.6, 1.7, 5.2] }}
    >
      {perfOn && (
        <PerformanceMonitor
        iterations={12}
        ms={250}
        threshold={0.85}
        bounds={(refreshrate) => [55, Math.min(refreshrate, 59)]}
        onIncline={handleIncline}
        onDecline={handleDecline}
        onFallback={handleFallback}
        />
      )}
      <SceneGuard />
      {quality !== "lite" && <ScrollDpr full={1.5} />}
      <color attach="background" args={["#060505"]} />
      <Starfield />
      {/* r34: the gate shows only the lit hall: the particle cloud (clipped at the top edge) stays hidden until Enter */}
      <group visible={entered && section !== "boot"}>
        <SignalField anchors={sanctumSpots.anchors} />
      </group>
      <World />
      <AnchorWriters />
      <LoadProgress />
      <CameraRig />
      <Effects />
    </Canvas>
  );
}
