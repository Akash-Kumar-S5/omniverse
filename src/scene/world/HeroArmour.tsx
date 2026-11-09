import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

const URL = "/assets/scans/armour-torso.glb";
const BASE: [number, number, number] = [-12.6, 0.04, -1.4];   // r27: stand pulled back 0.1 m so the front foot clears the frame bottom at 1920
const HEIGHT = 0.95;
// r25: the torso rests on a wooden armour stand (Sketchfab, CC-BY, see CREDITS.md): the post carries it, the crossbar is inside the plate
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
    // r29: built-in vertex colours (no shader code): the floating strap tab (found by picking its pixels, holder-local about 0.07, 0.266, 0.114)
    // goes near-black, and the torn top rim above 0.93 of the plate height fades into shadow
    holder.updateMatrixWorld(true);
    const p = new THREE.Vector3();
    let minY = Infinity;
    let maxY = -Infinity;
    holder.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const pos = child.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          p.fromBufferAttribute(pos, i).applyMatrix4(child.matrixWorld);
          holder.worldToLocal(p);
          minY = Math.min(minY, p.y);
          maxY = Math.max(maxY, p.y);
        }
      }
    });
    holder.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const geo = child.geometry;
        const pos = geo.attributes.position;
        const colors = new Float32Array(pos.count * 3);
        for (let i = 0; i < pos.count; i++) {
          p.fromBufferAttribute(pos, i).applyMatrix4(child.matrixWorld);
          holder.worldToLocal(p);
          let shade = 1;
          const dxz = Math.hypot(p.x - 0.07, p.z - 0.114);
          const dy = Math.abs(p.y - 0.266);
          const strap = Math.max(0, 1 - Math.max(dxz / 0.085, dy / 0.04));
          shade = Math.min(shade, 1 - 0.88 * Math.min(1, strap * 2.5));
          const top = (p.y - minY) / (maxY - minY);
          if (top > 0.93) shade = Math.min(shade, 1 - 0.6 * Math.min(1, (top - 0.93) / 0.05));
          colors[i * 3] = colors[i * 3 + 1] = colors[i * 3 + 2] = shade;
        }
        geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        child.material.vertexColors = true;
        child.material.needsUpdate = true;
      }
    });
    return holder;
  }, [scene]);

  // r28: a short dark collar seated on the torn neck opening (found from the scan's highest vertices), so the hole does not read from the front
  const collar = useMemo(() => {
    armour.updateMatrixWorld(true);
    const v = new THREE.Vector3();
    const pts: THREE.Vector3[] = [];
    let maxY = -Infinity;
    armour.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const pos = child.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          v.fromBufferAttribute(pos, i).applyMatrix4(child.matrixWorld);
          pts.push(v.clone());
          if (v.y > maxY) maxY = v.y;
        }
      }
    });
    const top = pts.filter((p) => p.y > maxY - 0.07);
    const cx = top.reduce((s, p) => s + p.x, 0) / top.length;
    const cz = top.reduce((s, p) => s + p.z, 0) / top.length;
    const r = Math.max(...top.map((p) => Math.hypot(p.x - cx, p.z - cz)));
    return { x: cx, z: cz, y: maxY, r: Math.min(0.2, r * 0.7) };
  }, [armour]);

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
      <group position={[0, TORSO_LIFT, 0]} rotation={[0, 1.2, 0]}>
        <primitive object={armour} />
        <mesh position={[collar.x, collar.y - 0.16, collar.z]}>
          <cylinderGeometry args={[collar.r, collar.r * 1.1, 0.1, 28, 1, true]} />
          <meshStandardMaterial color="#0d0b09" roughness={0.9} metalness={0.1} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* r26: warm rim from behind-left so the dark plate edges catch light (c19: the breastplate read mostly black) */}
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
