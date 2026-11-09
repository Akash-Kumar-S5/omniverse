import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useOmni } from "../../state/store";

/**
 * ch2 subject: ONE high-detail scanned armour piece (woven leather cuirass, CC0, full-resolution mesh and textures)
 * on the dark stone stand baked into sanctum.glb at glTF (-12.5, 0, -1.2). Nothing else is lit in the frame.
 */
const URL = "/assets/scans/armour-cuirass-scan.glb";
const STAND_TOP = 1.9;
const BASE: [number, number, number] = [-12.5, 0, -1.2];

export default function HeroArmour() {
  const section = useOmni((s) => s.section);
  const { scene } = useGLTF(URL, "/draco/");
  const obj = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((c) => {
      const m = c as THREE.Mesh;
      if (m.isMesh && m.material) {
        const mat = (m.material as THREE.MeshStandardMaterial).clone();
        mat.color = new THREE.Color(0.55, 0.5, 0.46);   // dark albedo: darker than the body text
        mat.roughness = Math.max(mat.roughness, 0.8);
        mat.metalness = Math.min(mat.metalness, 0.2);
        mat.envMapIntensity = 0.25;
        m.material = mat;
      }
    });
    const box = new THREE.Box3().setFromObject(clone);
    const ctr = box.getCenter(new THREE.Vector3());
    clone.position.set(-ctr.x, -box.min.y, -ctr.z);
    const holder = new THREE.Group();
    holder.add(clone);
    return holder;
  }, [scene]);

  if (section !== "experience") return null;
  return (
    <group position={BASE}>
      {/* dark stone stand (covers the shorter baked block) */}
      <mesh position={[0, STAND_TOP / 2, 0]}>
        <boxGeometry args={[0.6, STAND_TOP, 0.6]} />
        <meshStandardMaterial color="#0b0907" roughness={1} metalness={0} />
      </mesh>
      <group position={[0, STAND_TOP, 0]} rotation={[0, Math.PI / 2 + 0.12, 0]} scale={1.35}>
        <primitive object={obj} />
      </group>
      {/* one warm practical, up and toward the camera and the screen-right wall: the weave and rim catch it, the rest stays black */}
      {/* cool rim from behind and above (~30% of the ch1 rim): separates the weave from the wall */}
      <pointLight color="#8fb0ff" intensity={1.7} distance={3.0} decay={2} position={[-0.75, STAND_TOP + 0.45, 0.0]} />
      <pointLight color="#ffb070" intensity={6} distance={4.2} decay={2} position={[1.5, STAND_TOP + 0.9, 0.9]} />
    </group>
  );
}

useGLTF.preload(URL, "/draco/");
