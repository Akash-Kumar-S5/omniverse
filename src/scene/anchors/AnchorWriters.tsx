import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { anchors, type AnchorId } from "../../state/anchors";
import { useOmni } from "../../state/store";
import { beacon, projectNodes } from "../layout";

const ids: AnchorId[] = ["hero.core", "about.object", "about.city", "projects.active", "contact.beacon"];
const visibleSections: Record<AnchorId, string> = {
  "hero.core": "boot",
  "about.object": "about",
  "about.city": "about",
  "projects.active": "projects",
  "contact.beacon": "contact",
};

export default function AnchorWriters() {
  const { camera, size } = useThree();
  const points = useMemo(() => ({
    "hero.core": new THREE.Vector3(0, 0, 0),
    "about.object": new THREE.Vector3(0, 1.1, 0),
    "about.city": new THREE.Vector3(0, -4.72, 0),
    "projects.active": new THREE.Vector3(),
    "contact.beacon": new THREE.Vector3(...beacon),
  }), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const state = useOmni.getState();
    points["projects.active"].fromArray(projectNodes[Math.max(0, Math.min(state.activeProject, projectNodes.length - 1))].position);
    for (const id of ids) {
      const anchor = anchors[id];
      projected.copy(points[id]).project(camera);
      const onScreen = projected.z >= -1 && projected.z <= 1 && Math.abs(projected.x) <= 1 && Math.abs(projected.y) <= 1;
      anchor.x = (projected.x * 0.5 + 0.5) * size.width;
      anchor.y = (-projected.y * 0.5 + 0.5) * size.height;
      anchor.visible = state.section === visibleSections[id] && onScreen;
    }
  });
  return null;
}
