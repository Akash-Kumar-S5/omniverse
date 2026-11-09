import { useGLTF, useTexture } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { SANCTUM_FILES } from "../../state/signal";

const STATUE_URL = "/assets/ruins/gothic_statue.glb";
const FIRE_URL = "/assets/ruins/fire_barrel.draco.glb";
const FLAME_URL = "/assets/fx/flame_sheet_8x8.png";

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

function SanctumModel({ file, onReady }: { file: string; onReady?: () => void }) {
  const { scene } = useGLTF(file, "/draco/");
  const section = useOmni((s) => s.section);
  // r18 light hierarchy flame > barrel > relief: the baked props (relief) glow at ~0.35 of usual next to the fire
  const propGlow = section === "boot" || section === "contact" ? 0.22 : 0.62;

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.name.includes("floor")) {
          // ch1: hide the baked floor slab edge at x=12.5 (y~705 in shot) so floor seamlessly uses Floor.tsx
          mesh.visible = section !== "about";
        }
        if (mesh.name.includes("architecture")) {
          // ch2 (R19 fix 3): hide the background architecture slab in ch2 so no angular slab/plane edge reads
          mesh.visible = section !== "experience";
        }
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          // Standard material with baked lightmap so runtime directional/spot/rim lights
          // can illuminate and accent the architecture and slabs without losing baked occlusion
          const baked = mat.map ?? mat.emissiveMap;
          // the scan props (statue, job pieces) show their baked fire/moon light directly, so they stay readable
          // in the dark corridor; the architecture still falls to black away from the live fire
          const isProps = mesh.name.includes("props") || mesh.parent?.name.includes("props");
          mesh.material = new THREE.MeshStandardMaterial({
            map: baked,
            emissiveMap: isProps ? baked : null,
            emissive: isProps ? new THREE.Color(1, 1, 1) : new THREE.Color(0, 0, 0),
            emissiveIntensity: isProps ? propGlow : 0,
            roughness: 0.88,
            metalness: 0.04,
            toneMapped: true,
          });
          // r20: the scanned plinth sits in the pedestal atlas; keep its mean luminance at or under half the statue's (c15 regression)
          if (mesh.name.includes("pedestal")) {
            (mesh.material as THREE.MeshStandardMaterial).color.setRGB(0.26, 0.30, 0.34);   // darker and slightly cooler so the baked rust-brown reads as dressed stone
            (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 0.2;
          }
          mesh.castShadow = false;
          mesh.receiveShadow = false;
        }
      }
    });
    onReady?.();
  }, [scene, onReady, propGlow, section]);

  return <primitive object={scene} />;
}

export default function Sanctum() {
  const quality = useOmni((s) => s.quality);
  const [liteReady, setLiteReady] = useState(false);
  const markLiteReady = useCallback(() => setLiteReady(true), []);

  const lite = <SanctumModel file={SANCTUM_FILES.lite} onReady={markLiteReady} />;

  return (
    <group>
      <Suspense fallback={null}>
        {liteReady && quality !== "lite" ? (
          <Suspense fallback={lite}>
            <SanctumModel file={SANCTUM_FILES.high} />
          </Suspense>
        ) : lite}
      </Suspense>
      <Suspense fallback={null}>
        <GothicStatue />
      </Suspense>
    </group>
  );
}

useGLTF.preload(FIRE_URL, "/draco/");
useTexture.preload(FLAME_URL);
useGLTF.preload(STATUE_URL, false);
useGLTF.preload(SANCTUM_FILES.lite, "/draco/");
