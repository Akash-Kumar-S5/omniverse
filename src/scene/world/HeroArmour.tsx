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

  const target = useMemo(() => {
    const t = new THREE.Object3D();
    t.position.set(0, STAND_TOP + 0.4, 0);
    return t;
  }, []);

  if (section !== "experience") return null;

  return (
    <group position={BASE}>
      <primitive object={target} />
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
      {/* kill stray baked warm column at screen x: 150-220, y: 780-880 */}
      <mesh position={[0.7, 1.1, 2.0]} rotation={[0, -Math.PI / 4, 0]}>
        <planeGeometry args={[1.6, 2.4]} />
        <meshBasicMaterial color="#060505" />
      </mesh>
      <group position={[0, STAND_TOP, 0]} rotation={[0, Math.PI / 2 + 0.12, 0]} scale={1.35}>
        <primitive object={obj} />
      </group>
      {/* cool rim spot cone aimed strictly at the cuirass from behind to crisply separate plates from dark void */}
      <spotLight
        color="#6a7a90"
        intensity={4.5}
        distance={2.8}
        angle={Math.PI / 3.5}
        penumbra={0.8}
        decay={2}
        position={[-0.85, STAND_TOP + 0.85, 0.1]}
        target={target}
      />
      {/* warm key spot cone aimed strictly at the cuirass from the front: zero spill onto left pillar at z=0.8 */}
      <spotLight
        color="#ffb070"
        intensity={9.5}
        distance={3.6}
        angle={Math.PI / 4.2}
        penumbra={0.7}
        decay={2}
        position={[1.2, STAND_TOP + 0.85, 0.2]}
        target={target}
      />
    </group>
  );
}

useGLTF.preload(URL, "/draco/");
