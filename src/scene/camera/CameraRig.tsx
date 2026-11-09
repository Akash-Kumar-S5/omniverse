import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CatmullRomCurve3, PerspectiveCamera, Vector2, Vector3 } from "three";
import { easing } from "maath";
import { useOmni, type SectionId } from "../../state/store";
import spotsData from "../../../public/assets/models/sanctum.spots.json";
import type { SanctumSpots } from "../../state/signal";
import { getProjectGlyphAnchor } from "../particles/targets";
import { stageFor } from "../world/projectStaging";

const spots = spotsData as unknown as SanctumSpots;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Architectural waypoints connecting rooms through open portals and rotunda hub
const WAYPOINTS = {
  rotundaOculus: new Vector3(0.0, 1.2, 3.8),
  eastDoorway: new Vector3(3.0, 1.65, 1.2),
  eastExit: new Vector3(3.0, 1.65, 0.6),
  rotundaHub: new Vector3(0.0, 1.75, 0.3),
  westPortal: new Vector3(-4.8, 1.75, 0.0),
  corridorMid: new Vector3(-12.0, 1.8, 0.0),
  northCorner: new Vector3(-2.2, 1.85, -2.4),
  northEntry: new Vector3(-0.6, 1.95, -6.0),
  galleryExit: new Vector3(0.0, 1.85, -3.0),
  southPortal: new Vector3(0.0, 1.2, 9.0),
  courtSky: new Vector3(0.0, 0.8, 14.6),
};

function getTransitionWaypoints(from: SectionId, to: SectionId): Vector3[] {
  const SECTION_INDEX: Record<SectionId, number> = {
    boot: 0,
    about: 1,
    experience: 2,
    projects: 3,
    contact: 4,
  };
  const iFrom = SECTION_INDEX[from];
  const iTo = SECTION_INDEX[to];
  if (iFrom === iTo) return [];

  const forwardTransitions: Record<string, Vector3[]> = {
    "boot->about": [WAYPOINTS.rotundaOculus, WAYPOINTS.eastDoorway],
    "about->experience": [WAYPOINTS.eastExit, WAYPOINTS.rotundaHub, WAYPOINTS.westPortal],
    "experience->projects": [WAYPOINTS.corridorMid, WAYPOINTS.northCorner, WAYPOINTS.northEntry],
    "projects->contact": [WAYPOINTS.galleryExit, WAYPOINTS.rotundaHub, WAYPOINTS.southPortal],
  };

  const backwardTransitions: Record<string, Vector3[]> = {
    "about->boot": [WAYPOINTS.eastDoorway, WAYPOINTS.rotundaOculus],
    "experience->about": [WAYPOINTS.westPortal, WAYPOINTS.rotundaHub, WAYPOINTS.eastExit],
    "projects->experience": [WAYPOINTS.northEntry, WAYPOINTS.northCorner, WAYPOINTS.corridorMid],
    "contact->projects": [WAYPOINTS.southPortal, WAYPOINTS.rotundaHub, WAYPOINTS.galleryExit],
  };

  const result: Vector3[] = [];
  const list: SectionId[] = ["boot", "about", "experience", "projects", "contact"];
  if (iFrom < iTo) {
    for (let i = iFrom; i < iTo; i++) {
      const key = `${list[i]}->${list[i + 1]}`;
      const pts = forwardTransitions[key];
      if (pts) result.push(...pts);
    }
  } else {
    for (let i = iFrom; i > iTo; i--) {
      const key = `${list[i]}->${list[i - 1]}`;
      const pts = backwardTransitions[key];
      if (pts) result.push(...pts);
    }
  }
  return result;
}

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
  const initialized = useRef(false);

  // Transition spline through the architectural openings
  const activeSpline = useRef<CatmullRomCurve3 | null>(null);
  const splineProgress = useRef({ value: 1 });
  const prevSection = useRef<SectionId | null>(null);

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
        // Morph composition rule: keep swarm footprint to the RIGHT of ~58% width and clear of right viewport edge
        if (!isPortrait) {
          look.x -= 1.45;
          // r14: lower ch0 camera a few degrees so the barrel rim is edge-on and the interior is not visible
          // r23 Lane E: adjust target Y so barrel+relief sit at y~55% and empty bottom floor shrinks from ~45% to ~30%
          pos.y -= 0.68;
          look.y += 0.05;
        } else {
          // Mobile 390: lower camera so barrel rim is edge-on, fire sits in bottom 30% below body copy
          // r15: whole subject (barrel, flame, relief) in frame, >=40 px under the link row and ~60 px of floor under it
          pos.set(-4.4, 0.9, 5.2);
          look.set(0.0, 3.0, 0.0);
          targetFov = 62;
        }
        break;
      }
      case "about": {
        targetFov = 36;
        // Position camera to frame the marble bust on the RIGHT side of desktop viewport,
        // completely clear of the left-side text column, yawed so back-right corner is out of frame
        if (!isPortrait) {
          pos.set(4.85, 1.63, -1.67);   // r21: pulled back ~0.85 m so the plinth base clears y<=900 of 982 at 1512 and floor shows
          look.set(11.0, 1.58, -1.15);   // r20: +0.13 so the statue crown sits at y>=110 (was ~75, under the nav line)
        } else {
          pos.set(5.8, 1.7, 0.0);
          look.set(11.0, 1.45, 0.0);
        }
        break;
      }
      case "experience": {
        targetFov = isPortrait ? 60 : 48;
        const roleT = clamp((activeRole + p * 0.5) / 3, 0, 1);
        expPath.getPointAt(roleT, sampledPosition.current);
        pos.copy(sampledPosition.current);
        const roleTargetKey = `exp_role_${clamp(activeRole, 0, 3)}` as keyof typeof spots.cameras;
        const roleCam = spots.cameras[roleTargetKey] ?? spots.cameras.exp_role_0;
        look.set(...roleCam.target);
        // r16 ch2: frame cuirass prominently, push corridor floor litter (500-1100, 700-900) out of bottom frame
        look.y += 0.42;
        if (!isPortrait) {
          // r17 Lane C: pan/yaw camera so cuirass sits at x~1000-1300 with 80+ px air to right edge
          pos.z -= 0.25;
          look.z -= 0.20;
          if (activeRole === 0) {
            pos.x = spots.cameras.exp_role_0.position[0];
            pos.y = 1.0;   // r28: back to 1.0 (the r27 drop to 0.7 turned the lit chest out of the key and cost 0.2)
            look.y = 0.8;   // r25: torso lifted onto its stand (plate 0.62-1.57 m, stand feet on the floor)
            look.z = -0.3 + (size.width / size.height - 1512 / 982) * 0.45;
          }
        }
        if (window.innerWidth < 600) {
          pos.set(-8, 1.5, -1.2);
          look.set(-12.5, 4.5, -1.2);
          targetFov = 62;
        }
        break;
      }
      case "projects": {
        const projKey = `proj_${clamp(activeProject, 0, 7)}` as keyof typeof spots.cameras;
        const projCam = spots.cameras[projKey] ?? spots.cameras.proj_gallery;
        targetFov = projCam.fov;
        pos.set(...projCam.position);
        look.set(...projCam.target);
        // Tilt camera slightly down so lantern is not clipped by top nav
        look.y -= 0.28;
        {
          // r34: each project gets its own camera (dolly, height, fov, sideways lean) so the eight stagings do not share one shot
          const c = stageFor(activeProject).cam;
          const fwd = look.clone().sub(pos);
          fwd.y = 0;
          fwd.normalize();
          pos.addScaledVector(fwd, c.dolly);
          pos.x += -fwd.z * c.lean;
          pos.z += fwd.x * c.lean;
          pos.y += c.dy;
          targetFov += c.fov;
        }
        if (window.innerWidth < 600) {
          const anchor = getProjectGlyphAnchor(activeProject);
          const even = activeProject % 2 === 0;
          const x = anchor.x + 0.9;
          const z = anchor.z + (even ? 0.8 : 2.2);
          pos.set(x, 1.8, z + 5.35);
          look.set(x, 5.1, z);
          targetFov = 66;
        }
        break;
      }
      case "contact": {
        const sky = spots.cameras.contact_sky;
        targetFov = sky.fov;
        pos.set(...sky.position);
        look.set(...sky.target);
        if (!isPortrait) {
          // r15 ch4: the barrel + real flame, seen from a LOW SIDE angle (rim edge-on, interior glow hidden), relief dim behind
          pos.set(-1.3, 0.34, 3.0);   // r34 arrival: a low wide-angle look UP the ember column toward the oculus, fire at the bottom right, effigy out of frame
          // r17 Lane C: yaw left (counter-clockwise away from right edge) so clipped statue at x1385-1440 is completely out of frame
          look.set(-1.35, 2.0, -0.4);
          targetFov = 60;
        } else {
          // mobile 390: elevated angle so fire sits in bottom 25% below the GitHub/LinkedIn link row
          pos.set(-4.4, 0.9, 5.2);
          look.set(0.0, 3.0, 0.0);
          targetFov = 62;
        }
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

    // On chapter change after initialization, build a spline through open doorways
    if (initialized.current && prevSection.current && prevSection.current !== section) {
      const waypoints = getTransitionWaypoints(prevSection.current, section);
      if (waypoints.length > 0) {
        const splinePoints = [camera.position.clone(), ...waypoints, pos.clone()];
        activeSpline.current = new CatmullRomCurve3(splinePoints);
        splineProgress.current.value = 0;
      }
    }
    prevSection.current = section;

    if (!initialized.current) {
      camera.position.copy(pos);
      lookTarget.current.copy(look);
      if (camera instanceof PerspectiveCamera) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }
      initialized.current = true;
    } else if (reducedMotion) {
      camera.position.copy(pos);
      lookTarget.current.copy(look);
      activeSpline.current = null;
    } else if (activeSpline.current && splineProgress.current.value < 0.99) {
      // Visibly travel through the building spline connecting rooms
      easing.damp(splineProgress.current, "value", 1, 0.45, delta);
      activeSpline.current.getPointAt(splineProgress.current.value, sampledPosition.current);
      camera.position.copy(sampledPosition.current);
      easing.damp3(lookTarget.current, look, 0.45, delta);
    } else {
      activeSpline.current = null;
      easing.damp3(camera.position, pos, 0.45, delta);
      easing.damp3(lookTarget.current, look, 0.45, delta);
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
