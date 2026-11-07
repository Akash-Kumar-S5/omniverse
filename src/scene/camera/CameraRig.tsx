import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, PerspectiveCamera, Vector2, Vector3 } from "three";
import { easing } from "maath";
import { beacon, projectNodes, roleWaypoints } from "../layout";
import { useOmni } from "../../state/store";
import { signal } from "../../state/signal";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function CameraRig() {
  const { camera, size } = useThree();

  // CatmullRom curves for smooth continuous camera flight scrubbed by scroll progress
  const curves = useMemo(() => {
    return {
      boot: new CatmullRomCurve3([
        new Vector3(-4, -1.2, 32),
        new Vector3(-3, 0.4, 25),
        new Vector3(-1.5, 1.4, 18),
      ]),
      about: new CatmullRomCurve3([
        new Vector3(16, 7.5, 21),
        new Vector3(13, 5.0, 17),
        new Vector3(10, 3.2, 14),
      ]),
      experience: new CatmullRomCurve3(
        roleWaypoints.map(([x, y, z]) => new Vector3(x, y + 4.5, z + 15)),
      ),
      projects: new CatmullRomCurve3(
        projectNodes.map((n) => new Vector3(n.position[0], n.position[1] + 4.5, n.position[2] + 17)),
      ),
      contact: new CatmullRomCurve3([
        new Vector3(beacon[0] - 1.5, beacon[1] + 5, beacon[2] + 20),
        new Vector3(beacon[0], beacon[1] + 12, beacon[2] + 30),
        new Vector3(beacon[0] + 1.5, beacon[1] + 19, beacon[2] + 42),
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
    const { section, sectionProgress, activeProject, reducedMotion, entered, quality } = state;
    const p = clamp(sectionProgress, 0, 1);
    const pos = positionTarget.current;
    const look = lookDesired.current;
    const isPortrait = size.width / Math.max(1, size.height) < 1;

    // Target vertical field of view per chapter
    let targetFov = 48;

    if (reducedMotion) {
      // Reduced motion: static poses per chapter with no animated flights
      switch (section) {
        case "boot":
          targetFov = 48;
          pos.set(-3, -1.5, 29);
          look.set(signal.focus[0] - (isPortrait ? 0 : 3.5), signal.focus[1] + 0.5, signal.focus[2]);
          break;
        case "about":
          targetFov = 42;
          pos.set(14, 6, 17);
          look.set(signal.focus[0] - (isPortrait ? 0 : 3.0), signal.focus[1], signal.focus[2]);
          break;
        case "experience":
          targetFov = 50;
          pos.set(0, 6, 19);
          look.set(signal.focus[0] - (isPortrait ? 0 : 2.5), signal.focus[1], signal.focus[2]);
          break;
        case "projects": {
          targetFov = 45;
          const node = projectNodes[clamp(activeProject, 0, projectNodes.length - 1)];
          const [x, y, z] = node.position;
          pos.set(x, y + 4.5, z + 16);
          look.set(x - (isPortrait ? 0 : 3.5), y, z);
          break;
        }
        case "contact":
          targetFov = 54;
          pos.set(beacon[0], beacon[1] + 12, beacon[2] + 36);
          look.set(beacon[0], beacon[1] + 1, beacon[2]);
          break;
      }
    } else {
      // Full motion: smooth CatmullRom spline path scrubbing per chapter
      switch (section) {
        case "boot": {
          targetFov = entered && quality === "high" ? 44 : 48;
          curves.boot.getPointAt(p, sampledPosition.current);
          pos.copy(sampledPosition.current);
          if (entered && quality === "high") {
            pos.z -= 4.5;
          }
          // Direct gaze towards signal.focus, offset left for overlay balance
          look.set(signal.focus[0] - (isPortrait ? 0 : 3.8), signal.focus[1] + 0.8, signal.focus[2]);
          break;
        }
        case "about": {
          targetFov = 42;
          curves.about.getPointAt(p, sampledPosition.current);
          pos.copy(sampledPosition.current);
          look.set(signal.focus[0] - (isPortrait ? 0 : 3.2), signal.focus[1] + 0.4, signal.focus[2]);
          break;
        }
        case "experience": {
          targetFov = 50;
          curves.experience.getPointAt(p, sampledPosition.current);
          pos.copy(sampledPosition.current);
          look.set(signal.focus[0] - (isPortrait ? 0 : 2.8), signal.focus[1], signal.focus[2]);
          break;
        }
        case "projects": {
          targetFov = 46;
          // Interpolate between gallery overview and active project node position
          const nodeIdx = clamp(activeProject, 0, projectNodes.length - 1);
          const t = nodeIdx / Math.max(1, projectNodes.length - 1);
          const scrubT = clamp(t * 0.7 + p * 0.3, 0, 1);
          curves.projects.getPointAt(scrubT, sampledPosition.current);
          pos.copy(sampledPosition.current);
          if (isPortrait) {
            pos.y += 4;
            pos.z += 2;
          }
          look.set(signal.focus[0] - (isPortrait ? 0 : 3.5), signal.focus[1], signal.focus[2]);
          break;
        }
        case "contact": {
          targetFov = 54;
          curves.contact.getPointAt(p, sampledPosition.current);
          pos.copy(sampledPosition.current);
          look.set(beacon[0], beacon[1] + 0.8, beacon[2]);
          break;
        }
      }

      // Cursor parallax offset
      if (!touchDevice.current) {
        easing.damp2(pointer.current, pointerTarget.current, 2.2, delta);
        pos.x += pointer.current.x * 0.65;
        pos.y += pointer.current.y * 0.35;
        look.x += pointer.current.x * 0.18;
        look.y += pointer.current.y * 0.12;
      }
    }

    // Apply camera positioning and look-at dampening
    if (reducedMotion) {
      camera.position.copy(pos);
      lookTarget.current.copy(look);
    } else {
      easing.damp3(camera.position, pos, 1.6, delta);
      easing.damp3(lookTarget.current, look, 1.8, delta);
    }
    camera.lookAt(lookTarget.current);

    // Dynamic FOV dampening
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
