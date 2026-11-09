import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { useOmni } from "../../state/store";

/**
 * Authentic hearth fire with CC0 animated flame flipbook and crossed additive billboards:
 *  - stone_fire_pit.draco.glb: Poly Haven scan (CC0), Draco-compressed
 *  - flame_sheet_8x8.png: OpenGameArt CC0 animated flame sprite sheet (para, 8x8 frames)
 *  - 3 crossed additive billboards (~0.6m tall) inside the coals with warm core (#ffd29a)
 *  - ONE warm point light (#ff8a3d) on the plinth fire with organic flicker
 */
const PIT_URL = "/assets/ruins/fire_barrel.draco.glb";   // r13: ONE scanned iron fire barrel (Poly Haven barrel_stove, CC0), 0.80 m across, 0.81 m tall, base on the floor
const FLAME_URL = "/assets/fx/flame_sheet_8x8.png";
const PIT_SCALE = 1.0;
const PLINTH_TOP = 0.06;
const COLS = 8;
const ROWS = 8;
const TOTAL_FRAMES = 64;

export function FirePit() {
  const { scene } = useGLTF(PIT_URL, "/draco/");
  const pit = useMemo(() => {
    const clone = scene.clone(true);
    // Darken interior albedo and ensure roughness is high so the interior does not reflect point light as a bright disc
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const m = (mesh.material as THREE.MeshStandardMaterial).clone();
          m.roughness = 0.96;
          m.metalness = 0.04;
          // Subdue albedo so the mouth interior doesn't blow out
          m.color.multiplyScalar(0.45);
          mesh.material = m;
        }
      }
    });
    const box = new THREE.Box3().setFromObject(clone);
    const centre = box.getCenter(new THREE.Vector3());
    const holder = new THREE.Group();
    // centre on x/z; the scaled base sinks a hand's width into the plinth top
    clone.position.set(-centre.x, -box.min.y, -centre.z);
    holder.add(clone);
    return holder;
  }, [scene]);

  return (
    <group position={[0, PLINTH_TOP - 0.085, 0]}>
      <primitive object={pit} scale={[PIT_SCALE, PIT_SCALE, PIT_SCALE]} />
      {/* Dark charcoal coal bed inside the mouth: deep orange at <=30% intensity to eliminate pink/white reflection */}
      <mesh position={[0, 0.64, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 32]} />
        <meshStandardMaterial
          color="#0c0907"
          roughness={0.98}
          metalness={0.02}
          emissive="#ff4000"
          emissiveIntensity={0.18}
        />
      </mesh>
    </group>
  );
}

interface FlamePlaneProps {
  rotationY: number;
  phase: number;
  width: number;
  height: number;
}

function FlamePlane({ rotationY, phase, width, height }: FlamePlaneProps) {
  const sheet = useTexture(FLAME_URL);
  const { tex, insetX, insetY } = useMemo(() => {
    const image = sheet.image;
    if (!(image instanceof HTMLImageElement)) {
      throw new Error("Flame sprite sheet must be an image");
    }
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(image, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      // Purge background red haze (a < 45 or g < 15): make it pure transparent black (0,0,0,0)
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 45 || d[i + 1] < 15) {
          d[i] = 0;
          d[i + 1] = 0;
          d[i + 2] = 0;
          d[i + 3] = 0;
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }
    const insetX = 1 / image.naturalWidth;
    const insetY = 1 / image.naturalHeight;
    const t = new THREE.CanvasTexture(canvas);
    t.needsUpdate = true;
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    // Avoid sampling neighbouring frames when the flame is minified.
    t.generateMipmaps = false;
    t.minFilter = THREE.LinearFilter;
    t.repeat.set(1 / COLS - 2 * insetX, 1 / ROWS - 2 * insetY);
    return { tex: t, insetX, insetY };
  }, [sheet]);

  // Radially mask the flame billboard: alpha hits 0 well inside the quad (soft additive edge)
  const radialMask = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 70, 2, 64, 70, 38);
      grad.addColorStop(0, "rgba(255,255,255,1.0)");
      grad.addColorStop(0.30, "rgba(255,255,255,0.75)");
      grad.addColorStop(0.60, "rgba(255,255,255,0.25)");
      grad.addColorStop(0.85, "rgba(255,255,255,0.04)");
      grad.addColorStop(1.0, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    const mask = new THREE.CanvasTexture(canvas);
    mask.colorSpace = THREE.NoColorSpace;
    return mask;
  }, []);

  useEffect(() => () => {
    tex.dispose();
    radialMask.dispose();
  }, [tex, radialMask]);

  useFrame((state) => {
    const frame = Math.floor(state.clock.elapsedTime * 26 + phase * TOTAL_FRAMES) % TOTAL_FRAMES;
    const col = frame % COLS;
    const row = Math.floor(frame / COLS);
    // Invert row for standard Three.js UV origin (bottom-left)
    tex.offset.set(col / COLS + insetX, (ROWS - 1 - row) / ROWS + insetY);
  });

  return (
    <group rotation={[0, rotationY, 0]}>
      {/* Plane bottom sits at coals level and rises ~1.0m tall */}
      <mesh position={[0, height * 0.5, 0]} renderOrder={5}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={tex}
          alphaMap={radialMask}
          transparent
          alphaTest={0.04}
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          color="#ffd29a"
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Flames() {
  const quality = useOmni((s) => s.quality);
  // Narrower flame cards so no single card silhouette reads
  const h = quality === "lite" ? 0.86 : 1.0;
  const w = quality === "lite" ? 0.38 : 0.44;

  // 6 crossed additive soft-alpha billboards at 30-degree intervals resting directly on coals bed
  return (
    <group position={[0, 0.52, 0]}>
      <FlamePlane rotationY={0} phase={0} width={w} height={h} />
      <FlamePlane rotationY={Math.PI / 6} phase={0.17} width={w * 0.94} height={h} />
      <FlamePlane rotationY={(Math.PI * 2) / 6} phase={0.34} width={w} height={h} />
      <FlamePlane rotationY={(Math.PI * 3) / 6} phase={0.51} width={w * 0.94} height={h} />
      <FlamePlane rotationY={(Math.PI * 4) / 6} phase={0.68} width={w} height={h} />
      <FlamePlane rotationY={(Math.PI * 5) / 6} phase={0.85} width={w * 0.96} height={h} />
    </group>
  );
}

/** The one warm light, on the plinth fire. */
function FireLight() {
  const ref = useRef<THREE.PointLight>(null);
  const section = useOmni((s) => s.section);

  useFrame((state) => {
    const l = ref.current;
    if (!l) return;
    if (section === "projects" || section === "about" || section === "experience") {
      l.intensity = 0;
      return;
    }
    const t = state.clock.elapsedTime;
    const flicker = 0.55 * Math.sin(t * 9.1) + 0.3 * Math.sin(t * 17.3 + 1.7) + 0.15 * Math.sin(t * 31.9 + 0.4);
    l.intensity = 8.5 * (1 + 0.15 * flicker);
  });

  return (
    <pointLight
      ref={ref}
      color="#ff8a3d"
      intensity={7.5}
      distance={0}
      decay={2}
      position={[0, 0.95, 0]}
    />
  );
}

/**
 * Soft radial vignette at floor level that smoothly dissolves the rotunda floor
 * into the ambient darkness (#060505), eliminating the hard circular edge.
 */
function FloorVignette() {
  const tex = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // 128 is center (0,0), radius 128 = 8.0m in world space.
      // Ultra-wide feather from 1.0m (radius 16) all the way to 7.5m (radius 120)
      const grad = ctx.createRadialGradient(128, 128, 16, 128, 128, 120);
      grad.addColorStop(0, "rgba(6, 5, 5, 0)");
      grad.addColorStop(0.20, "rgba(6, 5, 5, 0.05)");
      grad.addColorStop(0.40, "rgba(6, 5, 5, 0.20)");
      grad.addColorStop(0.65, "rgba(6, 5, 5, 0.50)");
      grad.addColorStop(0.85, "rgba(6, 5, 5, 0.85)");
      grad.addColorStop(1.0, "rgba(6, 5, 5, 1.0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
      <planeGeometry args={[16, 16]} />
      <meshBasicMaterial
        map={tex}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function Fire() {
  // r15: the barrel and its real flame are the ch4 subject again; the mobile camera frames them
  return (
    <group>
      <FirePit />
      <FireLight />
      <Flames />
      <FloorVignette />
    </group>
  );
}

useGLTF.preload(PIT_URL, "/draco/");
useTexture.preload(FLAME_URL);
