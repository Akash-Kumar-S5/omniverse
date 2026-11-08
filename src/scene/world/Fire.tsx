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
  const tex = useMemo(() => {
    const t = sheet.clone();
    t.needsUpdate = true;
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.wrapT = THREE.ClampToEdgeWrapping;
    t.repeat.set(1 / COLS, 1 / ROWS);
    return t;
  }, [sheet]);

  useEffect(() => () => tex.dispose(), [tex]);

  useFrame((state) => {
    const frame = Math.floor(state.clock.elapsedTime * 26 + phase * TOTAL_FRAMES) % TOTAL_FRAMES;
    const col = frame % COLS;
    const row = Math.floor(frame / COLS);
    // Invert row for standard Three.js UV origin (bottom-left)
    tex.offset.set(col / COLS, (ROWS - 1 - row) / ROWS);
  });

  return (
    <group rotation={[0, rotationY, 0]}>
      {/* Plane bottom sits at coals level and rises ~0.6m tall */}
      <mesh position={[0, height * 0.5, 0]} renderOrder={5}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          map={tex}
          transparent
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
  // Scale flame billboards ~2x (1.48m tall, core #ffd29a) so the fire reads as the brightest point
  const h = quality === "lite" ? 1.25 : 1.48;
  const w = h * 0.88;

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

  useFrame((state) => {
    const l = ref.current;
    if (!l) return;
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
