import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { SANCTUM_FILES } from "../../state/signal";

const STATUE_URL = "/assets/ruins/gothic_statue.glb";

function GothicStatue() {
  const { scene } = useGLTF(STATUE_URL, false);
  const statue = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const orig = mesh.material as THREE.MeshStandardMaterial;
        // Weathered stone PBR: keep the scanned textures; the packed ARM map
        // supplies AO (R) and roughness (G), so metalness stays at zero
        mesh.material = new THREE.MeshStandardMaterial({
          map: orig.map,
          normalMap: orig.normalMap,
          aoMap: orig.metalnessMap,
          roughnessMap: orig.metalnessMap,
          roughness: 1,
          metalness: 0,
          toneMapped: true,
        });
        mesh.castShadow = false;
        mesh.receiveShadow = false;
      }
    });
    // Stand the statue on the pedestal: centre it on x/z and put its base at y=0
    const box = new THREE.Box3().setFromObject(clone);
    const centre = box.getCenter(new THREE.Vector3());
    const holder = new THREE.Group();
    clone.position.set(-centre.x, -box.min.y, -centre.z);
    holder.add(clone);
    return holder;
  }, [scene]);

  return (
    <primitive
      object={statue}
      position={[11.0, 1.25, 0.0]}
      scale={[0.9, 0.9, 0.9]}
      rotation={[0, -Math.PI / 2, 0]}
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
      <GothicStatue />
    </group>
  );
}

useGLTF.preload(SANCTUM_FILES.high, "/draco/");
useGLTF.preload(SANCTUM_FILES.lite, "/draco/");
useGLTF.preload(STATUE_URL, false);
