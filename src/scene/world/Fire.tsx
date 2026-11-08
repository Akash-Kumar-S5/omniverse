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
const PIT_URL = "/assets/ruins/stone_fire_pit.draco.glb";
const FLAME_URL = "/assets/fx/flame_sheet_8x8.png";
const PIT_SCALE = 1.7;
const PLINTH_TOP = 0.42;
const COLS = 8;
const ROWS = 8;
const TOTAL_FRAMES = 64;

export function FirePit() {
  const { scene } = useGLTF(PIT_URL, "/draco/");
  const pit = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const centre = box.getCenter(new THREE.Vector3());
    const holder = new THREE.Group();
    // centre on x/z; the scaled base sinks a hand's width into the plinth top
    clone.position.set(-centre.x, -box.min.y, -centre.z);
    holder.add(clone);
    return holder;
  }, [scene]);
  return <primitive object={pit} position={[0, PLINTH_TOP - 0.085, 0]} scale={[PIT_SCALE, PIT_SCALE, PIT_SCALE]} />;
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
    const insetX = 1 / image.naturalWidth;
    const insetY = 1 / image.naturalHeight;
    const t = sheet.clone();
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

  // Radially mask the flame billboard so no straight edges or rectangular glow can ever show
  const radialMask = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 68, 6, 64, 68, 54);
      grad.addColorStop(0, "white");
      grad.addColorStop(0.50, "white");
      grad.addColorStop(0.82, "rgba(255,255,255,0.3)");
      grad.addColorStop(1, "black");
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
      {/* Plane bottom sits at coals level and rises ~0.98m tall */}
      <mesh position={[0, height * 0.5, 0]} renderOrder={5}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={tex}
          alphaMap={radialMask}
          transparent
          opacity={0.38}
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
  // Flame billboards ~1.3x cycle-4 size (0.98m tall, width 0.84m) with lower opacity so it reads as light
  const h = quality === "lite" ? 0.85 : 0.98;
  const w = h * 0.86;

  // 3 crossed additive billboards at 60 degree intervals resting directly on the coals (y = 0.60)
  return (
    <group position={[0, 0.60, 0]}>
      <FlamePlane rotationY={0} phase={0} width={w} height={h} />
      <FlamePlane rotationY={Math.PI / 3} phase={0.33} width={w * 0.95} height={h} />
      <FlamePlane rotationY={(Math.PI * 2) / 3} phase={0.67} width={w * 0.95} height={h} />
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
      distance={11}
      decay={2}
      position={[0, 0.85, 0]}
    />
  );
}

export default function Fire() {
  return (
    <group>
      <FirePit />
      <FireLight />
      <Flames />
    </group>
  );
}

useGLTF.preload(PIT_URL, "/draco/");
useTexture.preload(FLAME_URL);
