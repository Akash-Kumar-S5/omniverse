import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import { useOmni } from "../../state/store";

/**
 * r42 ch2: a distinct prop beside the cuirass for each Work role (museum / game-ready scans, CC-BY, see CREDITS.md).
 * Role 0 keeps the cuirass alone; roles 1-3 add a burgonet helm on a stone block, a sword leaning on the stand, and a shield on the floor.
 * Mounted inside HeroArmour's group, so positions are relative to the stand (screen-left is local +z).
 */
const HELM = "/assets/scans/role-helm.draco.glb";
const SWORD = "/assets/scans/role-sword.draco.glb";
const SHIELD = "/assets/scans/role-shield.draco.glb";
const STONE = "/assets/ruins/textures/stone_block_512.jpg";
const SWORD_LIFT = 0.55;   // half the blade length: the lying scan is re-stood on its point
const SWORD_TILT = -0.1;

function useLit(url: string, tint: string) {
  const { scene } = useGLTF(url, "/draco/");
  return useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((c) => {
      const m = c as THREE.Mesh;
      if (m.isMesh && m.material instanceof THREE.MeshStandardMaterial) {
        const mat = m.material.clone();
        mat.color.set(tint);
        mat.metalness = Math.min(mat.metalness, 0.6);
        mat.roughness = Math.max(mat.roughness, 0.6);
        mat.emissive.set(0x000000);
        mat.emissiveMap = null;
        mat.envMapIntensity = 0.4;
        m.material = mat;
      }
    });
    // stand it on y=0, centred on x/z
    const box = new THREE.Box3().setFromObject(clone);
    const c = box.getCenter(new THREE.Vector3());
    clone.position.set(-c.x, -box.min.y, -c.z);
    const holder = new THREE.Group();
    holder.add(clone);
    return holder;
  }, [scene, tint]);
}

function useShadow() {
  const tex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Cannot create prop contact shadow");
    const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,0.85)");
    g.addColorStop(0.6, "rgba(0,0,0,0.55)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);
  return tex;
}

/** a soft dark pool on the floor under a prop, so it sits on the ground instead of floating */
function Contact({ x, z, w, d, rot = 0 }: { x: number; z: number; w: number; d: number; rot?: number }) {
  const shadow = useShadow();
  return (
    <mesh position={[x, 0.004, z]} rotation={[-Math.PI / 2, 0, rot]}>
      <planeGeometry args={[w, d]} />
      <meshBasicMaterial map={shadow} transparent depthWrite={false} />
    </mesh>
  );
}

function Helm() {
  const helm = useLit(HELM, "#b9b4ad");
  const src = useTexture(STONE);
  const stone = useMemo(() => {
    const t = src.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.needsUpdate = true;
    return t;
  }, [src]);
  return (
    <group position={[0.05, 0, 0.9]}>
      <Contact x={0} z={0} w={0.9} d={0.9} />
      <mesh position={[0, 0.09, 0]}>
        <boxGeometry args={[0.34, 0.18, 0.34]} />
        <meshStandardMaterial map={stone} color="#5d554d" roughness={0.9} />
      </mesh>
      <group position={[0, 0.18, 0]} rotation={[0, 0.9, 0]}>
        <primitive object={helm} />
      </group>
    </group>
  );
}

/** the sword stands upright, point down in a stone block, leaning a little toward the stand */
function Sword() {
  const sword = useLit(SWORD, "#c9c3ba");
  const src = useTexture(STONE);
  const stone = useMemo(() => {
    const t = src.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.needsUpdate = true;
    return t;
  }, [src]);
  return (
    <group position={[0.1, 0, 0.5]} scale={0.8}>
      <Contact x={0} z={0} w={0.8} d={0.8} />
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.3, 0.14, 0.3]} />
        <meshStandardMaterial map={stone} color="#5d554d" roughness={0.9} />
      </mesh>
      <group position={[0, 0.14 + SWORD_LIFT, 0]} rotation={[SWORD_TILT, 0, 0.06]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <primitive object={sword} />
        </group>
      </group>
    </group>
  );
}

/** the shield rests on its rim against the stand's foot, tilted back so it is supported, with a contact pool under it */
function Shield() {
  const shield = useLit(SHIELD, "#b4aea6");
  return (
    <group position={[0.0, 0, 0.48]} scale={0.9} rotation={[0, 0.25, 0]}>
      <Contact x={0.05} z={0} w={0.9} d={0.5} />
      <group position={[0, 0.3, 0]} rotation={[0, 0, -1.3]}>
        <primitive object={shield} />
      </group>
    </group>
  );
}

export default function RoleProp() {
  const role = useOmni((s) => s.activeRole);
  const lit = <pointLight color="#ffb070" intensity={3.2} distance={3.2} decay={2} position={[0.9, 1.0, 0.9]} />;
  if (role === 1) return <><Helm />{lit}</>;
  if (role === 2) return <><Sword />{lit}</>;
  if (role === 3) return <><Shield />{lit}</>;
  return null;
}
