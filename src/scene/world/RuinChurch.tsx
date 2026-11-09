import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useOmni } from "../../state/store";

/**
 * ch0 + ch4 backdrop: a ruined church scan (Sketchfab, CC-BY, see CREDITS.md) as two fog-depth silhouettes 15-25 m behind the fire.
 * Unlit material so the layers read as moon-grey shapes that the scene fog eats progressively; mounted only in ch0 and ch4, loaded lazily.
 */
const URL = "/assets/scans/ruin-church-scan.glb";

export default function RuinChurch() {
  const section = useOmni((s) => s.section);
  const { scene } = useGLTF(URL, "/draco/");
  const obj = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((c) => {
      const m = c as THREE.Mesh;
      if (m.isMesh && m.material) {
        const src = m.material as THREE.MeshStandardMaterial;
        m.material = new THREE.MeshBasicMaterial({ map: src.map, color: new THREE.Color(0.11, 0.12, 0.16), fog: true });
      }
    });
    return clone;
  }, [scene]);
  const second = useMemo(() => obj.clone(true), [obj]);
  // r28: in ch4 the near church block read as a pale grey box behind the barrel, so it drops into shadow there
  useEffect(() => {
    const k = section === "contact" ? 0.4 : 1;
    obj.traverse((c) => {
      const m = c as THREE.Mesh;
      if (m.isMesh) (m.material as THREE.MeshBasicMaterial).color.setRGB(0.11 * k, 0.12 * k, 0.16 * k);
    });
  }, [obj, section]);

  if (section !== "boot" && section !== "contact") return null;
  return (
    <>
      <group position={[14, 0, -6]} rotation={[0, 0.6, 0]} scale={0.38}>
        <primitive object={obj} />
      </group>
      <group position={[16, 0, -14]} rotation={[0, 1.7, 0]} scale={0.5}>
        <primitive object={second} />
      </group>
    </>
  );
}
