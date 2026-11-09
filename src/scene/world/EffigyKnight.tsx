import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useOmni } from "../../state/store";

/**
 * ch0 + ch4 relief: a recumbent effigy on its slab, lying low beside the fire (Sketchfab, CC-BY, see CREDITS.md).
 * 1.7 m long, base on y=0, front toward +Z. Lit by the fire lights.
 * Loaded lazily (World.tsx) and mounted only in ch0 and ch4.
 */
const URL = "/assets/scans/effigy-knight-scan.glb";

export default function EffigyKnight() {
  const section = useOmni((s) => s.section);
  const { scene } = useGLTF(URL, "/draco/");
  const obj = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((c) => {
      const m = c as THREE.Mesh;
      if (m.isMesh && m.material) {
        // The scan can arrive unlit (no emissive/roughness), so rebuild a lit standard material from its albedo.
        const src = m.material as THREE.MeshStandardMaterial;
        m.material = new THREE.MeshStandardMaterial({
          map: src.map ?? null,
          normalMap: src.normalMap ?? null,
          color: "#8a7560",
          roughness: 0.9,
          metalness: 0,
          envMapIntensity: 0.2,
        });
      }
    });
    return clone;
  }, [scene]);

  if (section !== "boot" && section !== "contact") return null;
  // beside the barrel on the camera-right side, its length across the view, front toward the camera
  return (
    <group position={[1.1, 0, 0.1]} rotation={[0, section === "boot" ? -0.82 + Math.PI / 7.2 : -0.82, 0]}>
      <primitive object={obj} />
    </group>
  );
}
