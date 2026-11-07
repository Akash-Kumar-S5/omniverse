import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { SANCTUM_FILES } from "../../state/signal";

function MarbleBust() {
  const { scene } = useGLTF("/assets/models/marble_bust_01.glb", false);
  const bustClone = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const orig = mesh.material as THREE.MeshStandardMaterial;
          // Carrara marble PBR material: keep textures and normal detail,
          // ensure zero emissive and toneMapped=true so it shades cleanly
          mesh.material = new THREE.MeshStandardMaterial({
            map: orig.map,
            normalMap: orig.normalMap,
            roughnessMap: orig.roughnessMap,
            roughness: 0.38,
            metalness: 0.0,
            toneMapped: true,
            emissive: new THREE.Color("#000000"),
            emissiveIntensity: 0,
          });
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      }
    });
    return clone;
  }, [scene]);

  return (
    <primitive
      object={bustClone}
      position={[11.0, 1.25, 0.0]}
      scale={[1.65, 1.65, 1.65]}
      rotation={[0, -Math.PI * 0.62, 0]}
    />
  );
}

export default function Sanctum() {
  const quality = useOmni((s) => s.quality);
  const file = quality === "lite" ? SANCTUM_FILES.lite : SANCTUM_FILES.high;
  const { scene } = useGLTF(file, "/draco/");

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          // Standard material with baked lightmap so runtime directional/spot/rim lights
          // can illuminate and accent the architecture and slabs without losing baked occlusion
          mesh.material = new THREE.MeshStandardMaterial({
            map: mat.map ?? mat.emissiveMap,
            roughness: 0.88,
            metalness: 0.04,
            toneMapped: true,
          });
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      }
    });
  }, [scene]);

  return (
    <group>
      <primitive object={scene} />
      <MarbleBust />
    </group>
  );
}

useGLTF.preload(SANCTUM_FILES.high, "/draco/");
useGLTF.preload(SANCTUM_FILES.lite, "/draco/");
useGLTF.preload("/assets/models/marble_bust_01.glb", false);
