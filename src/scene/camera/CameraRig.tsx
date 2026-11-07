import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, Vector2, Vector3 } from "three";
import { easing } from "maath";
import { beacon, projectNodes, roleWaypoints } from "../layout";
import { useOmni } from "../../state/store";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function CameraRig() {
  const { camera, size } = useThree();
  const curve = useMemo(
    () => new CatmullRomCurve3(roleWaypoints.map(([x, y, z]) => new Vector3(x, y, z))),
    [],
  );
  const positionTarget = useRef(new Vector3());
  const lookTarget = useRef(new Vector3());
  const lookDesired = useRef(new Vector3());
  const pathPosition = useRef(new Vector3());
  const pathLook = useRef(new Vector3());
  const pointer = useRef(new Vector2());
  const pointerTarget = useRef(new Vector2());
  const touchDevice = useRef(false);
  const reducedSection = useRef("");

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

    if (reducedMotion) {
      // Fixed poses keep the scene legible without camera flights.
      if (reducedSection.current !== section) {
        reducedSection.current = section;
      }
      switch (section) {
        case "boot": pos.set(-3, -1.5, 29); look.set(-5, 3.5, 0); break;
        case "about": pos.set(18, 10, 17); look.set(-4.5, 0.5, 0); break;
        case "experience": pos.set(0, 7, 20); look.set(-3.6, 1, 6); break;
        case "projects": {
          const node = projectNodes[clamp(activeProject, 0, projectNodes.length - 1)];
          const [x, y, z] = node.position;
          pos.set(x, y + 5, z + 15);
          look.set(x - 4, y, z);
          if (size.width / Math.max(1, size.height) < 1) {
            pos.set(x, y + 12, z + 15);
            look.set(x, y - 2, z);
          }
          break;
        }
        case "contact": pos.set(beacon[0], beacon[1] + 14, beacon[2] + 40); look.set(beacon[0], beacon[1], beacon[2]); break;
      }
    } else {
      switch (section) {
        case "boot":
          // Hold the low, wide pose until the user enters; only HIGH mode pushes toward the core.
          pos.set(-3, -1.5, 31 - (entered && quality === "high" ? 7 : 0));
          look.set(-5, 3.5, 0);
          break;
        case "about": {
          // A slow cutaway orbit keeps the constellation on the right and leaves the left open.
          const angle = 0.42 + p * 0.55 + performance.now() * 0.000018;
          pos.set(20 * Math.sin(angle), 9 + Math.sin(angle * 0.6) * 1.2, 18 * Math.cos(angle));
          look.set(-4.5, 0.5, 0);
          break;
        }
        case "experience": {
          curve.getPointAt(p, pathPosition.current);
          curve.getPointAt(Math.min(1, p + 0.015), pathLook.current);
          if (size.width / Math.max(1, size.height) < 1) {
            pos.copy(pathPosition.current);
            look.set(pathLook.current.x * 0.42, pathLook.current.y - 1, pathLook.current.z - 7);
          } else {
            // Back the camera away so the active point lands in the open area beside the panel.
            pos.set(pathPosition.current.x, pathPosition.current.y + 5, pathPosition.current.z + 16);
            look.set(pathPosition.current.x - 3.6, pathPosition.current.y - 0.8, pathPosition.current.z - 8);
          }
          break;
        }
        case "projects": {
          const node = projectNodes[clamp(activeProject, 0, projectNodes.length - 1)];
          const [x, y, z] = node.position;
          if (size.width / Math.max(1, size.height) < 1) {
            pos.set(x, y + 12, z + 15);
            look.set(x, y - 2, z);
          } else {
            // Keep the focused node near 68% x / 45% y within the panel-free area.
            pos.set(x, y + 5, z + 18);
            look.set(x - 5.2, y - 0.8, z);
          }
          break;
        }
        case "contact":
          // Pull upward and backward until the constellation gathers around its beacon.
          pos.set(beacon[0], beacon[1] + 6 + 10 * p, beacon[2] + 22 + 18 * p);
          look.set(beacon[0], beacon[1], beacon[2]);
          break;
      }
      if (!touchDevice.current) {
        easing.damp2(pointer.current, pointerTarget.current, 2.2, delta);
        pos.x += pointer.current.x * 0.65;
        pos.y += pointer.current.y * 0.35;
        look.x += pointer.current.x * 0.18;
        look.y += pointer.current.y * 0.12;
      }
    }

    if (reducedMotion) {
      camera.position.copy(pos);
      lookTarget.current.copy(look);
    } else {
      easing.damp3(camera.position, pos, 1.5, delta);
      easing.damp3(lookTarget.current, look, 1.8, delta);
    }
    camera.lookAt(lookTarget.current);
  });

  return null;
}
