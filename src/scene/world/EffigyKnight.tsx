import { useEffect, useMemo } from "react";
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
  const shadow = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Cannot create effigy contact shadow");
    const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 64);
    gradient.addColorStop(0, "rgba(0,0,0,0.65)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);
  useEffect(() => () => shadow.dispose(), [shadow]);
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
          color: "#6e5b49",
          roughness: 0.95,
          metalness: 0,
          envMapIntensity: 0.1,
        });
      }
    });
    return clone;
  }, [scene]);

  if (section !== "boot" && section !== "contact") return null;
  return (
    <group position={section === "boot" ? [-1, 0, -0.25] : [1.1, 0, 0.1]} rotation={[0, section === "boot" ? -0.82 + Math.PI / 7.2 + 0.35 : -0.82, 0]}>
      {section === "boot" && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2, 0.75]} />
          <meshBasicMaterial map={shadow} transparent depthWrite={false} />
        </mesh>
      )}
      <primitive object={obj} />
    </group>
  );
}
