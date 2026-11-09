import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useOmni } from "../../state/store";

/**
 * ch0 + ch4 relief: a recumbent effigy on its slab, lying low beside the fire (Sketchfab, CC-BY, see CREDITS.md).
 * 1.7 m long, base on y=0, front toward +Z. Lit only by the fire lights; the scan's albedo is already dark bronze/stone.
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
        const mat = (m.material as THREE.MeshStandardMaterial).clone();
        mat.color = new THREE.Color(0.28, 0.26, 0.25);
        mat.roughness = 0.9;
        mat.metalness = 0;
        mat.metalnessMap = null;
        mat.envMapIntensity = 0.2;
        m.material = mat;
      }
    });
    return clone;
  }, [scene]);

  if (section !== "boot" && section !== "contact") return null;
  // beside the barrel on the camera-right side, its length across the view, front toward the camera
  return (
    <group position={[1.1, 0, 0.1]} rotation={[0, -0.82, 0]}>
      <primitive object={obj} />
    </group>
  );
}
