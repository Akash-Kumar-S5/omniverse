import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import RoleProp from "./RoleProp";

// r30: a clean museum breastplate scan (Cleveland Museum of Art 1916.1521, CC0, see CREDITS.md) replaces the low-poly torso that read melted at Retina
const URL = "/assets/scans/armour-breastplate-scan.glb";
const BASE: [number, number, number] = [-12.6, 0.04, -1.4];   // r27: stand pulled back 0.1 m so the front foot clears the frame bottom at 1920
const HEIGHT = 0.95;
// r25: the plate rests on a wooden armour stand (Sketchfab, CC-BY, see CREDITS.md): the post carries it
const STAND_URL = "/assets/scans/armour-stand-scan.glb";
const STAND_SCALE = 0.3;   // scan is 3.0 wide x 4.57 tall -> 0.9 m feet, 1.37 m tall
const TORSO_LIFT = 0.62;   // plate bottom above the floor: the post shows below it

function ArmourStand() {
  const { scene } = useGLTF(STAND_URL, "/draco/");
  const stand = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const material = child.material.clone();
        material.color.setRGB(0.5, 0.44, 0.4);
        material.roughness = 0.95;
        material.metalness = 0;
        material.envMapIntensity = 0.2;
        child.material = material;
      }
    });
    return clone;
  }, [scene]);
  return <primitive object={stand} scale={[STAND_SCALE * 1.45, STAND_SCALE, STAND_SCALE * 1.45]} />;   // r26: post and feet 1.45x thicker (c19: a thin sawhorse)
}

export default function HeroArmour() {
  const { scene } = useGLTF(URL, "/draco/");
  const armour = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const material = child.material.clone();
        // keep the scan's own banded iron and bronze texture; trim it a little so the pauldron highlights do not blow out under the warm key
        material.color.set("#b9b4ad");
        material.metalness = Math.min(material.metalness, 0.6);
        material.roughness = Math.max(material.roughness, 0.55);
        material.emissive.set(0x000000);
        material.emissiveMap = null;
        material.envMapIntensity = 0.5;
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
    object.position.set(0, TORSO_LIFT + HEIGHT / 2, 0);
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
        <planeGeometry args={[2.1, 2.1]} />
        <meshBasicMaterial map={shadow} transparent opacity={0.8} depthWrite={false} />
      </mesh>
      <ArmourStand />
      <Suspense fallback={null}><RoleProp /></Suspense>
      <group position={[0, TORSO_LIFT, 0]} rotation={[0, 1.2, 0]}>
        <primitive object={armour} />
      </group>
      {/* r26: warm rim from behind-left so the dark plate edges catch light */}
      <pointLight color="#ffb070" intensity={2.6} distance={3.2} decay={2} position={[-0.9, 1.5, -0.9]} />
      <spotLight
        color="#ffc890"
        intensity={9}
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

// r34: warm the Work chapter's pieces after first paint so scrolling into it never meets an empty stage
window.setTimeout(() => {
  useGLTF.preload(STAND_URL, "/draco/");
  useGLTF.preload(URL, "/draco/");
}, 2500);
