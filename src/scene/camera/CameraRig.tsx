import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, PerspectiveCamera, Vector2, Vector3 } from "three";
import { easing } from "maath";
import { useOmni } from "../../state/store";
import { signal } from "../../state/signal";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function CameraRig() {
  const { camera, size } = useThree();

  // Spline paths calibrated so each chapter's swarm forms prominently in the right half (35-45%)
  const curves = useMemo(() => {
    return {
      boot: new CatmullRomCurve3([
        new Vector3(-1.6, 0.0, 11.2),
        new Vector3(-1.1, 0.3, 9.6),
        new Vector3(-0.6, 0.6, 8.2),
      ]),
      about: new CatmullRomCurve3([
        new Vector3(-0.2, 0.8, 9.8),
        new Vector3(0.2, 0.6, 8.6),
        new Vector3(0.6, 0.4, 7.6),
      ]),
      experience: new CatmullRomCurve3([
        new Vector3(-0.8, 0.6, 10.8),
        new Vector3(-0.3, 0.5, 9.4),
        new Vector3(0.2, 0.4, 8.2),
      ]),
      projects: new CatmullRomCurve3([
        new Vector3(-1.2, 0.4, 10.2),
        new Vector3(-0.7, 0.4, 8.8),
        new Vector3(-0.2, 0.3, 7.6),
      ]),
      contact: new CatmullRomCurve3([
        new Vector3(0.0, -0.2, 8.8),
        new Vector3(0.0, 0.6, 10.5),
        new Vector3(0.0, 1.6, 12.2),
      ]),
    };
  }, []);

  const positionTarget = useRef(new Vector3());
  const lookTarget = useRef(new Vector3());
  const lookDesired = useRef(new Vector3());
  const sampledPosition = useRef(new Vector3());
  const pointer = useRef(new Vector2());
  const pointerTarget = useRef(new Vector2());
  const touchDevice = useRef(false);

  useEffect(() => {
    touchDevice.current = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    if (touchDevice.current) return;

    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.current.set(
        (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1,
        1 - (event.clientY / Math.max(1, window.innerHeight)) * 2,
      );
    };

    const onPointerLeave = () => pointerTarget.current.set(0, 0);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  useFrame((_, delta) => {
    const state = useOmni.getState();
    const { section, sectionProgress, reducedMotion, entered, quality } = state;
    const p = clamp(sectionProgress, 0, 1);
    const pos = positionTarget.current;
    const look = lookDesired.current;
    const isPortrait = size.width / Math.max(1, size.height) < 1;

    let targetFov = 48;

    if (reducedMotion) {
      // Reduced motion: fixed composition poses with no camera flights
      switch (section) {
        case "boot":
          targetFov = 48;
          pos.set(-1.1, 0.3, 9.6);
          look.set(signal.focus[0] - (isPortrait ? 0 : 2.4), signal.focus[1] + 0.2, signal.focus[2]);
          break;
        case "about":
          targetFov = 44;
          pos.set(0.2, 0.6, 8.6);
          look.set(signal.focus[0] - (isPortrait ? 0 : 2.0), signal.focus[1], signal.focus[2]);
          break;
        case "experience":
          targetFov = 48;
          pos.set(-0.3, 0.5, 9.4);
          look.set(signal.focus[0] - (isPortrait ? 0 : 1.8), signal.focus[1], signal.focus[2]);
          break;
        case "projects":
          targetFov = 46;
          pos.set(-0.7, 0.4, 8.8);
          look.set(signal.focus[0] - (isPortrait ? 0 : 2.2), signal.focus[1], signal.focus[2]);
          break;
        case "contact":
          targetFov = 52;
          pos.set(0.0, 0.6, 10.5);
          look.set(signal.focus[0], signal.focus[1] + 0.4, signal.focus[2]);
          break;
      }
    } else {
      // Scroll-driven CatmullRom spline path per chapter
      switch (section) {
        case "boot": {
          targetFov = entered && quality === "high" ? 44 : 48;
          curves.boot.getPointAt(p, sampledPosition.current);
          pos.copy(sampledPosition.current);
          if (entered && quality === "high") {
            pos.z -= 1.2;
          }
          look.set(signal.focus[0] - (isPortrait ? 0 : 2.4), signal.focus[1] + 0.2, signal.focus[2]);
          break;
        }
        case "about": {
          targetFov = 44;
          curves.about.getPointAt(p, sampledPosition.current);
          pos.copy(sampledPosition.current);
          look.set(signal.focus[0] - (isPortrait ? 0 : 2.0), signal.focus[1], signal.focus[2]);
          break;
        }
        case "experience": {
          targetFov = 48;
          curves.experience.getPointAt(p, sampledPosition.current);
          pos.copy(sampledPosition.current);
          look.set(signal.focus[0] - (isPortrait ? 0 : 1.8), signal.focus[1], signal.focus[2]);
          break;
        }
        case "projects": {
          targetFov = 46;
          curves.projects.getPointAt(p, sampledPosition.current);
          pos.copy(sampledPosition.current);
          look.set(signal.focus[0] - (isPortrait ? 0 : 2.2), signal.focus[1], signal.focus[2]);
          break;
        }
        case "contact": {
          targetFov = 52;
          curves.contact.getPointAt(p, sampledPosition.current);
          pos.copy(sampledPosition.current);
          look.set(signal.focus[0], signal.focus[1] + 0.4, signal.focus[2]);
          break;
        }
      }

      // Parallax mouse responsiveness
      if (!touchDevice.current) {
        easing.damp2(pointer.current, pointerTarget.current, 2.2, delta);
        pos.x += pointer.current.x * 0.45;
        pos.y += pointer.current.y * 0.25;
        look.x += pointer.current.x * 0.15;
        look.y += pointer.current.y * 0.10;
      }
    }

    if (reducedMotion) {
      camera.position.copy(pos);
      lookTarget.current.copy(look);
    } else {
      easing.damp3(camera.position, pos, 1.6, delta);
      easing.damp3(lookTarget.current, look, 1.8, delta);
    }
    camera.lookAt(lookTarget.current);

    if (camera instanceof PerspectiveCamera) {
      if (Math.abs(camera.fov - targetFov) > 0.05) {
        if (reducedMotion) {
          camera.fov = targetFov;
        } else {
          camera.fov += (targetFov - camera.fov) * Math.min(1, delta * 3.0);
        }
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
