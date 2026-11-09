import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";

/**
 * r37 ch0: low foreground detail for the empty lower hero floor (existing assets only).
 * A fallen museum breastplate (Cleveland Museum of Art scan, CC0) lying on its back, and a scatter of
 * stone-block rubble using the Poly Haven stone texture already in the repo. Lit only by the fire's lights.
 */
const PLATE_URL = "/assets/scans/armour-breastplate-scan.glb";
const STONE_URL = "/assets/ruins/textures/stone_block_512.jpg";
const K = 0.62;   // rubble size multiplier
const PULL = new THREE.Vector3(1.1, 0, -1.2);   // moves the whole foreground away from the camera, toward the fire

// x, z, width, height, depth, yaw, tilt (radians)
const RUBBLE: [number, number, number, number, number, number, number][] = [
  [-2.35, 3.25, 0.42, 0.14, 0.3, 0.5, 0.08],
  [-2.05, 3.5, 0.26, 0.1, 0.22, -0.4, -0.06],
  [-0.9, 3.1, 0.36, 0.12, 0.28, 1.1, 0.05],
  [-3.0, 2.7, 0.5, 0.16, 0.34, 0.2, -0.04],
  [-1.5, 2.55, 0.2, 0.08, 0.18, 0.9, 0.1],
  [-0.4, 2.25, 0.3, 0.11, 0.24, -0.7, 0.06],
];

function FallenPlate() {
  const { scene } = useGLTF(PLATE_URL, "/draco/");
  const plate = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const m = child.material.clone();
        m.color.set("#a8a29a");
        m.metalness = Math.min(m.metalness, 0.6);
        m.roughness = Math.max(m.roughness, 0.6);
        m.emissive.set(0x000000);
        m.emissiveMap = null;
        m.envMapIntensity = 0.4;
        child.material = m;
      }
    });
    const box = new THREE.Box3().setFromObject(clone);
    const centre = box.getCenter(new THREE.Vector3());
    const scale = 0.4 / (box.max.y - box.min.y);
    clone.position.set(-centre.x, -centre.y, -centre.z);
    const holder = new THREE.Group();
    holder.add(clone);
    holder.scale.setScalar(scale);
    return holder;
  }, [scene]);
  // lying on its back, rim up, slightly turned toward the fire
  return (
    <group position={[-1.75, 0.1, 2.85]} rotation={[-Math.PI / 2 + 0.28, 0.35, 0.5]}>
      <primitive object={plate} />
    </group>
  );
}

export default function HeroFloor() {
  const src = useTexture(STONE_URL);
  const stone = useMemo(() => {
    const t = src.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.needsUpdate = true;
    return t;
  }, [src]);
  return (
    <group position={PULL}>
      {RUBBLE.map(([x, z, w, h, d, yaw, tilt], i) => (
        <mesh key={i} position={[x, (h * K) / 2 - 0.02, z]} rotation={[tilt, yaw, tilt * 0.6]}>
          <boxGeometry args={[w * K, h * K, d * K]} />
          <meshStandardMaterial map={stone} color="#6a6058" roughness={0.9} metalness={0} />
        </mesh>
      ))}
      <FallenPlate />
    </group>
  );
}
