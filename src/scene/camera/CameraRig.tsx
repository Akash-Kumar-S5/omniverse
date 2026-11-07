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
  const reducedTransition = useRef(false);
  const wasReducedMotion = useRef(false);

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
    const { section, sectionProgress, activeProject, reducedMotion } = state;
    const p = clamp(sectionProgress, 0, 1);
    const lastRole = Math.max(0, roleWaypoints.length - 1);
    const passedRole = clamp(Math.floor(p * lastRole + 0.5), 0, lastRole);
    if (section === "experience" && state.activeRole !== passedRole) {
      state.setActiveRole(passedRole);
    }
    const pos = positionTarget.current;
    const look = lookDesired.current;

    if (reducedMotion) {
      // The five fixed poses keep the scene legible without scroll-driven motion.
      if (!wasReducedMotion.current || reducedSection.current !== section) {
        reducedSection.current = section;
        reducedTransition.current = true;
      }
      switch (section) {
        case "boot": pos.set(0, 5, 28); look.set(0, 0, 0); break;
        case "about": pos.set(0, 15, 23); look.set(0, 0, 0); break;
        case "experience": pos.set(0, 6, 19); look.set(0, 1, 0); break;
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
        case "contact": pos.set(beacon[0], beacon[1] + 5, beacon[2] + 28); look.set(beacon[0], beacon[1], beacon[2]); break;
      }
    } else {
      reducedTransition.current = false;
      switch (section) {
        case "boot":
          pos.set(0, 7 - 3 * p, 34 - 9 * p);
          look.set(0, 0, 0);
          break;
        case "about": {
          const angle = p * Math.PI * 0.5 + performance.now() * 0.000035;
          pos.set(Math.sin(angle) * 22, 11 + Math.sin(angle * 0.6) * 1.5, Math.cos(angle) * 22);
          look.set(0, 0, 0);
          break;
        }
        case "experience": {
          curve.getPointAt(p, pathPosition.current);
          curve.getPointAt(Math.min(1, p + 0.015), pathLook.current);
          pos.copy(pathPosition.current);
          look.set(pathLook.current.x * 0.42, pathLook.current.y - 1, pathLook.current.z - 7);
          break;
        }
        case "projects": {
          const node = projectNodes[clamp(activeProject, 0, projectNodes.length - 1)];
          const [x, y, z] = node.position;
          if (size.width / Math.max(1, size.height) < 1) {
            pos.set(x, y + 12, z + 15);
            look.set(x, y - 2, z);
          } else {
            pos.set(x, y + 5, z + 15);
            look.set(x - 4, y, z);
          }
          break;
        }
        case "contact":
          pos.set(beacon[0], beacon[1] + 7, beacon[2] + 30 - 8 * p);
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

    if (!reducedMotion || reducedTransition.current || camera.position.distanceToSquared(pos) >= 1e-4 || lookTarget.current.distanceToSquared(look) >= 1e-4) {
      easing.damp3(camera.position, pos, reducedMotion ? 0.3 : 1.5, delta);
      easing.damp3(lookTarget.current, look, reducedMotion ? 0.3 : 1.8, delta);
      if (reducedMotion && camera.position.distanceToSquared(pos) < 1e-4 && lookTarget.current.distanceToSquared(look) < 1e-4) {
        reducedTransition.current = false;
      }
    }
    wasReducedMotion.current = reducedMotion;
    camera.lookAt(lookTarget.current);
  });

  return null;
}
