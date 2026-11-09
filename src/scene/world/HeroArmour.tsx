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
        mat.color = new THREE.Color(0.72, 0.65, 0.58);   // warm bronze/leather tone so plates and rivets read
        mat.roughness = Math.max(mat.roughness, 0.65);    // allow specular glints on metallic rivets and plate edges
        mat.metalness = Math.min(mat.metalness, 0.35);
        mat.envMapIntensity = 0.45;
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
        <meshStandardMaterial color="#020202" roughness={1} metalness={0} />
      </mesh>
      {/* black contact shadow cap to eliminate diffuse reflection on the stand top */}
      <mesh position={[0, STAND_TOP + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.61, 0.61]} />
        <meshBasicMaterial color="#010101" />
      </mesh>
      <group position={[0, STAND_TOP, 0]} rotation={[0, Math.PI / 2 + 0.12, 0]} scale={1.35}>
        <primitive object={obj} />
      </group>
      {/* cool rim from behind and above (~30% of the ch1 rim): separates the weave from the wall, elevated clear of stand */}
      <pointLight color="#8fb0ff" intensity={1.7} distance={3.0} decay={2} position={[-0.75, STAND_TOP + 0.75, 0.0]} />
      {/* warm key light raised ~40% (6 -> 8.5) so plates and rivets catch clear warm highlights */}
      <pointLight color="#ffb070" intensity={8.5} distance={4.5} decay={2} position={[1.4, STAND_TOP + 0.85, 0.85]} />
    </group>
  );
}

useGLTF.preload(URL, "/draco/");
