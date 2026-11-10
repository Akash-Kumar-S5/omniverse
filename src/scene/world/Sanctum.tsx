import { useGLTF, useTexture } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { SANCTUM_FILES } from "../../state/signal";

const STATUE_URL = "/assets/ruins/gothic_statue.glb";
const FIRE_URL = "/assets/ruins/bronze_brazier.draco.glb";

/** r27: a stepped 4 cm cap slab (slightly lighter stone) on the scanned plinth, so its top reads as a dressed edge, not clay. Top face at the statue's base (y 1.25). */
function PlinthCap() {
  // r30: the CC0 stone block texture (already in the repo) on the slabs and the body skin, plus a third stepped course for a chamfered cap
  const src = useTexture("/assets/ruins/textures/stone_block_512.jpg");
  const stone = useMemo(() => {
    const t = src.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1.4, 1.4);
    t.needsUpdate = true;
    return t;
  }, [src]);
  // r42: a soft contact shadow on the floor around the plinth foot so the block sits on the ground instead of floating in the void
  const contact = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    if (g) {
      const r = g.createRadialGradient(64, 64, 20, 64, 64, 64);
      r.addColorStop(0, "rgba(0,0,0,0.95)");
      r.addColorStop(0.5, "rgba(0,0,0,0.55)");
      r.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = r;
      g.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <group position={[11, 0, 0]}>
      <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
        <planeGeometry args={[3.6, 3.6]} />
        <meshBasicMaterial map={contact} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      {/* r28: the baked plinth body reads as clay; a half-transparent flat stone skin over it halves its visible relief and ties it to the cap slabs */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.31, 1.2, 1.31]} />
        <meshStandardMaterial map={stone} color="#3a3632" roughness={0.88} metalness={0} transparent opacity={0.55} depthWrite={false} />
      </mesh>
      {/* r29: a thin straight base course squares off the lumpy foot of the scan */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[1.42, 0.08, 1.42]} />
        <meshStandardMaterial map={stone} color="#453f3a" roughness={0.88} metalness={0} />
      </mesh>
      <mesh position={[0, 1.1925, 0]}>
        <boxGeometry args={[1.37, 0.02, 1.37]} />
        <meshStandardMaterial map={stone} color="#453f3a" roughness={0.88} metalness={0} />
      </mesh>
      <mesh position={[0, 1.215, 0]}>
        <boxGeometry args={[1.32, 0.02, 1.32]} />
        <meshStandardMaterial map={stone} color="#524c45" roughness={0.85} metalness={0} />
      </mesh>
      <mesh position={[0, 1.2375, 0]}>
        <boxGeometry args={[1.28, 0.025, 1.28]} />
        <meshStandardMaterial map={stone} color="#5f5850" roughness={0.8} metalness={0} />
      </mesh>
    </group>
  );
}

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
          mesh.visible = section !== "about" && section !== "projects"; // r37: ch3 also drops the baked slab (its edge was the vertical seam and the bottom-right diagonal)
        }
        if (mesh.name.includes("architecture")) {
          // ch2 (R19 fix 3): hide the background architecture slab in ch2 so no angular slab/plane edge reads
          mesh.visible = section !== "experience" && section !== "projects"; // r29: ch3 also drops the shell, which carried the wall band and the floor diagonal
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
            // r25: darker again (the baked scan relief reads as mud; no runtime normal map exists to halve) and wider
            (mesh.material as THREE.MeshStandardMaterial).color.setRGB(0.1, 0.11, 0.125);
            (mesh.material as THREE.MeshStandardMaterial).roughness = 0.85;
            (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 0.2;
            // scale the plinth ~1.3x in X/Z about the statue axis (x=11, z=0) so its top is wider than the statue's base; heights stay (statue stands at y=1.25)
            mesh.scale.set(1.3, 1, 1.3);
            mesh.position.set(11 - 1.3 * 11, 0, 0);
          }
          // r25 ch1: the room shell at half brightness, so the bottom-right corner edge and the wall band lose contrast (the back glow stays)
          if ((section === "about" || section === "projects") && mesh.name.includes("architecture")) {
            (mesh.material as THREE.MeshStandardMaterial).color.setScalar(section === "projects" ? 0.1 : 0.45);
          }
          // r21: the scanned relief is fire-side lit only and at most half the barrel's luminance on ch0 and ch4
          if (isProps && propGlow < 0.3) {
            (mesh.material as THREE.MeshStandardMaterial).color.setScalar(0.35);
            (mesh.material as THREE.MeshStandardMaterial).emissive.setScalar(0.35);
            (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 0.35;
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
  const section = useOmni((s) => s.section);
  const [liteReady, setLiteReady] = useState(false);
  const markLiteReady = useCallback(() => setLiteReady(true), []);
  // r33: the 1.5 MB high-detail shell waits until after first paint; the lite shell is what a cold load shows
  const [late, setLate] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setLate(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  const lite = <SanctumModel file={SANCTUM_FILES.lite} onReady={markLiteReady} />;

  return (
    <group>
      <Suspense fallback={null}>
        {liteReady && late && quality !== "lite" ? (
          <Suspense fallback={lite}>
            <SanctumModel file={SANCTUM_FILES.high} />
          </Suspense>
        ) : lite}
      </Suspense>
      <Suspense fallback={null}>
        {/* r21: the statue only exists in ch1; elsewhere it sat as a lit sliver at the right frame edge (ch4 at 1920) */}
        {section === "about" ? <GothicStatue /> : null}
        {section === "about" ? <PlinthCap /> : null}
      </Suspense>
    </group>
  );
}

useGLTF.preload(FIRE_URL, "/draco/");
useGLTF.preload(SANCTUM_FILES.lite, "/draco/");

// r34: warm the About statue after first paint (it was fetched only on arrival, finishing at 22 s on a slow link)
window.setTimeout(() => useGLTF.preload(STATUE_URL, false), 3000);
