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

function Sword() {
  const sword = useLit(SWORD, "#c9c3ba");
  return (
    <group position={[0.15, 0.02, 0.55]} rotation={[0, 0.25, -0.2]}>
      <primitive object={sword} />
    </group>
  );
}

function Shield() {
  const shield = useLit(SHIELD, "#b4aea6");
  return (
    <group position={[-0.25, 0, 0.45]} scale={0.8} rotation={[0, 0.9, 0]}>
      <group rotation={[0.28, 0, 0]}>
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
