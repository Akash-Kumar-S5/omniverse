import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

const URL = "/assets/scans/armour-torso.glb";
const BASE: [number, number, number] = [-12.5, 0.04, -1.2];
const HEIGHT = 1.2;

export default function HeroArmour() {
  const { scene } = useGLTF(URL, "/draco/");
  const armour = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const material = child.material.clone();
        material.color.set("#777b80");
        material.metalness = 0.45;
        material.roughness = 0.72;
        material.emissive.set(0x000000);
        material.emissiveMap = null;
        child.material = material;
      }
    });
    const box = new THREE.Box3().setFromObject(clone);
    const centre = box.getCenter(new THREE.Vector3());
    const scale = HEIGHT / (box.max.y - box.min.y);
    clone.position.set(-centre.x, -box.min.y, -centre.z);
    const holder = new THREE.Group();
    holder.add(clone);
    holder.scale.setScalar(scale);
    return holder;
  }, [scene]);

  const shadow = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Cannot create armour contact shadow");
    const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 64);
    gradient.addColorStop(0, "rgba(0,0,0,0.75)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);
  useEffect(() => () => shadow.dispose(), [shadow]);

  const target = useMemo(() => {
    const object = new THREE.Object3D();
    object.position.set(0, HEIGHT / 2, 0);
    return object;
  }, []);

  return (
    <group position={BASE}>
      <primitive object={target} />
      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#161310" roughness={0.94} />
      </mesh>
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
      <primitive object={armour} />
      <spotLight
        color="#c8d1d8"
        intensity={5}
        distance={3.6}
        angle={Math.PI / 4}
        penumbra={0.8}
        decay={2}
        position={[1.2, 1.6, 0.2]}
        target={target}
      />
    </group>
  );
}
