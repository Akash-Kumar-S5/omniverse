import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, PerspectiveCamera, Vector2, Vector3 } from "three";
import { easing } from "maath";
import { useOmni } from "../../state/store";
import spotsData from "../../../public/assets/models/sanctum.spots.json";
import type { SanctumSpots } from "../../state/signal";

const spots = spotsData as unknown as SanctumSpots;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function CameraRig() {
  const { camera, size } = useThree();

  // Experience corridor camera path through the 4 role portals
  const expPath = useMemo(() => {
    return new CatmullRomCurve3([
      new Vector3(...spots.cameras.exp_role_0.position),
      new Vector3(...spots.cameras.exp_role_1.position),
      new Vector3(...spots.cameras.exp_role_2.position),
      new Vector3(...spots.cameras.exp_role_3.position),
    ]);
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
    const { section, sectionProgress, activeProject, activeRole, reducedMotion, entered } = state;
    const p = clamp(sectionProgress, 0, 1);
    const pos = positionTarget.current;
    const look = lookDesired.current;
    const isPortrait = size.width / Math.max(1, size.height) < 1;

    let targetFov = 62;

    switch (section) {
      case "boot": {
        const wide = spots.cameras.boot_wide;
        const oculus = spots.cameras.boot_under_oculus;
        targetFov = wide.fov;
        const t = entered ? clamp(0.5 + p * 0.5, 0, 1) : 0;
        pos.set(
          wide.position[0] + (oculus.position[0] - wide.position[0]) * t,
          wide.position[1] + (oculus.position[1] - wide.position[1]) * t,
          wide.position[2] + (oculus.position[2] - wide.position[2]) * t,
        );
        look.set(
          wide.target[0] + (oculus.target[0] - wide.target[0]) * t,
          wide.target[1] + (oculus.target[1] - wide.target[1]) * t,
          wide.target[2] + (oculus.target[2] - wide.target[2]) * t,
        );
        break;
      }
      case "about": {
        const niche = spots.cameras.about_niche;
        targetFov = niche.fov;
        pos.set(...niche.position);
        look.set(...niche.target);
        break;
      }
      case "experience": {
        targetFov = spots.cameras.exp_role_0.fov;
        const roleT = clamp((activeRole + p * 0.5) / 3, 0, 1);
        expPath.getPointAt(roleT, sampledPosition.current);
        pos.copy(sampledPosition.current);
        const roleTargetKey = `exp_role_${clamp(activeRole, 0, 3)}` as keyof typeof spots.cameras;
        const roleCam = spots.cameras[roleTargetKey] ?? spots.cameras.exp_role_0;
        look.set(...roleCam.target);
        break;
      }
      case "projects": {
        const projKey = `proj_${clamp(activeProject, 0, 7)}` as keyof typeof spots.cameras;
        const projCam = spots.cameras[projKey] ?? spots.cameras.proj_gallery;
        targetFov = projCam.fov;
        pos.set(...projCam.position);
        look.set(...projCam.target);
        break;
      }
      case "contact": {
        const sky = spots.cameras.contact_sky;
        targetFov = sky.fov;
        pos.set(...sky.position);
        look.set(...sky.target);
        break;
      }
    }

    // Parallax mouse responsiveness
    if (!reducedMotion && !touchDevice.current) {
      easing.damp2(pointer.current, pointerTarget.current, 2.2, delta);
      pos.x += pointer.current.x * (isPortrait ? 0.15 : 0.4);
      pos.y += pointer.current.y * 0.2;
      look.x += pointer.current.x * 0.15;
      look.y += pointer.current.y * 0.1;
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
