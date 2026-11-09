import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard, useGLTF, useTexture } from "@react-three/drei";
import { useOmni } from "../../state/store";

/**
 * Authentic hearth fire with CC0 animated flame flipbook and crossed additive billboards:
 *  - stone_fire_pit.draco.glb: Poly Haven scan (CC0), Draco-compressed
 *  - flame-spritesheet-6x1.png: Kenney CC0 flame sprites
 *  - 3 crossed additive billboards (~0.6m tall) inside the coals with warm core (#ffd29a)
 *  - ONE warm point light (#ff8a3d) on the plinth fire with organic flicker
 */
const PIT_URL = "/assets/ruins/fire_barrel.draco.glb";   // r13: ONE scanned iron fire barrel (Poly Haven barrel_stove, CC0), 0.80 m across, 0.81 m tall, base on the floor
const FLAME_URL = "/assets/props/textures/flame-spritesheet-6x1.png";
const PIT_SCALE = 1.0;
const PLINTH_TOP = 0.06;
const COLS = 6;
const ROWS = 1;
const TOTAL_FRAMES = 6;
const FLAME_COLOR = new THREE.Color(1, 1, 1).multiplyScalar(2.5);
const FLAME_SHELL_COLOR = new THREE.Color(2.5, 1.3, 0.65);

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
          // r16: light albedo trim so the rust and rivets stay readable
          m.color.multiplyScalar(0.85);
          // r18: the scan's own rust and roughness maps are back (the hot base dots were the air holes, now lined); factors keep the iron matte
          m.color.multiplyScalar(1.5);
          m.metalness = 0.35;
          m.roughness = 1;
          m.envMapIntensity = 0.6;
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
      {/* r17: the scan's air-intake holes at the base showed the lit interior as a ring of hot dots; a black unlit liner behind them turns the holes dark */}
      <mesh position={[0, 0.13, 0]}>
        <cylinderGeometry args={[0.37, 0.37, 0.26, 32, 1, true]} />
        <meshBasicMaterial color="#000000" side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      {/* Dark charcoal coal bed inside the mouth: deep orange at <=30% intensity to eliminate pink/white reflection */}
      <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 32]} />
        <meshStandardMaterial
          color="#0c0907"
          roughness={0.98}
          metalness={0.02}
          emissive="#ff6a1a"
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
  core?: boolean;
}

function FlamePlane({ rotationY, phase, width, height, core = false }: FlamePlaneProps) {
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
      const tip = core ? [194, 65, 12] : [184, 54, 15];
      const body = core ? [255, 154, 60] : [255, 138, 42];
      const hotCore = [255, 243, 208];
      // Map the greyscale sprite from dark orange tips to a pale hot core.
      for (let i = 0; i < d.length; i += 4) {
        const light = d[i] / 255;
        const from = core && light >= 0.5 ? body : tip;
        const to = core && light >= 0.5 ? hotCore : body;
        const y = Math.floor(i / 4 / canvas.width) / canvas.height;
        const mix = core ? (light < 0.5 ? light * 2 : (light - 0.5) * 2) : Math.min(1, 0.2 + light * 0.5 + y * 0.45);
        d[i] = from[0] + (to[0] - from[0]) * mix;
        d[i + 1] = from[1] + (to[1] - from[1]) * mix;
        d[i + 2] = from[2] + (to[2] - from[2]) * mix;
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
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.repeat.set(1 / COLS - 2 * insetX, 1 / ROWS - 2 * insetY);
    return { tex: t, insetX, insetY };
  }, [sheet, core]);

  // Radially mask the flame billboard: alpha hits 0 well inside the quad (soft additive edge)
  const radialMask = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 2, 64, 64, 64);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.25, "#dddddd");
      grad.addColorStop(0.5, "#999999");
      grad.addColorStop(0.75, "#444444");
      grad.addColorStop(1.0, "#000000");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
      const pixels = ctx.getImageData(0, 0, 128, 128);
      for (let y = 109; y < 128; y++) {
        const fade = (127 - y) / 18;
        for (let x = 0; x < 128; x++) {
          const i = (y * 128 + x) * 4;
          pixels.data[i + 1] *= fade;
        }
      }
      ctx.putImageData(pixels, 0, 0);
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
    // The atlas contains four wisps and two distinct core sprites, not six animation frames.
    const frame = core
      ? 4 + Math.floor(state.clock.elapsedTime * 2) % 2
      : Math.floor(state.clock.elapsedTime * 4 + phase * TOTAL_FRAMES) % 4;
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
          opacity={core ? 1 : 0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          color={core ? FLAME_COLOR : FLAME_SHELL_COLOR}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Flames() {
  const quality = useOmni((s) => s.quality);
  const section = useOmni((s) => s.section);
  const k = quality === "lite" ? 0.86 : 1.0;
  const glow = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128; c.height = 128;
    const g = c.getContext("2d");
    if (g) {
      const r = g.createRadialGradient(64, 64, 2, 64, 64, 62);
      r.addColorStop(0, "rgba(255,120,40,1)");
      r.addColorStop(0.35, "rgba(255,80,20,0.55)");
      r.addColorStop(1, "rgba(255,60,10,0)");
      g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, []);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => {
    if (glowRef.current) glowRef.current.opacity = 0.8 * (1 + 0.15 * Math.sin(state.clock.elapsedTime * 8 * Math.PI * 2 * 0.5));
  });
  useEffect(() => () => glow.dispose(), [glow]);

  // r16: 3 crossed cards at different heights, scales and frame offsets (r17: 1.6x taller, ~0.6x barrel height of visible flame above the rim), plus a small ember glow on the coals
  return (
    <group position={[0, 0.49, 0]}>
      <FlamePlane rotationY={0} phase={0} width={1.15 * k} height={2.24 * k} core />
      <group position={[0, 0.03, 0]}><FlamePlane rotationY={(55 * Math.PI) / 180} phase={0.37} width={1.0 * k} height={1.92 * k} /></group>
      <group position={[0, 0.06, 0]}><FlamePlane rotationY={(115 * Math.PI) / 180} phase={0.71} width={0.9 * k} height={1.6 * k} /></group>
      <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={4}>
        <circleGeometry args={[0.45, 32]} />
        <meshBasicMaterial ref={glowRef} map={glow} transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      {(section === "boot" || section === "contact") && (
        <Billboard position={[0.5, 0.95, -0.6]}>
          <mesh renderOrder={3}>
            <circleGeometry args={[1.15, 48]} />
            <meshBasicMaterial map={glow} transparent opacity={0.055} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
          </mesh>
        </Billboard>
      )}
    </group>
  );
}

/** The one warm light, on the plinth fire. */
function FireLight() {
  const ref = useRef<THREE.PointLight>(null);
  const mouthRef = useRef<THREE.PointLight>(null);
  const hiddenCandleLights = useRef(new Map<THREE.Object3D, boolean>());
  const section = useOmni((s) => s.section);

  useEffect(() => {
    const hidden = hiddenCandleLights.current;
    return () => {
      hidden.forEach((visible, light) => { light.visible = visible; });
      hidden.clear();
    };
  }, [section]);

  useFrame((state) => {
    if (section === "boot" || section === "contact") {
      // The sanctum's chapter-one candle otherwise spills onto the distant fire-chapter wall.
      const candle = state.scene.getObjectByName("RT_ch1_candle");
      if (candle) {
        if (!hiddenCandleLights.current.has(candle)) hiddenCandleLights.current.set(candle, candle.visible);
        candle.visible = false;
      }
    }
    const l = ref.current;
    if (!l) return;
    if (section === "projects" || section === "about" || section === "experience") {
      l.intensity = 0;
      return;
    }
    const t = state.clock.elapsedTime;
    // ~8 Hz organic flicker, +-15%
    const flicker = 0.6 * Math.sin(t * 8 * Math.PI * 2) + 0.4 * Math.sin(t * 5.3 * Math.PI * 2 + 1.7);
    l.intensity = 7.2 * (1 + 0.15 * flicker);
    if (mouthRef.current) mouthRef.current.intensity = 2.7 * (1 + 0.15 * flicker);
  });

  return (
    <>
      <pointLight ref={ref} color="#ff8a3d" intensity={6.4} distance={0} decay={2} position={[0, 0.95, 0]} />
      {/* low warm light just inside the mouth: the inner rim and rust catch flame light */}
      <pointLight ref={mouthRef} color="#ff7a30" intensity={2.7} distance={1.5} decay={2} position={[0, 0.66, 0]} />
      {/* off-screen warm key on the camera side (same side as the ch4 camera): rivets and rust read on the barrel's visible face */}
      {/* r18: short warm light just outside the barrel at rim height, camera side, so the top third of the wall shows its rust */}
      <pointLight color="#ff8a40" intensity={1.8} distance={1.3} decay={2} position={[-0.7, 0.85, 0.5]} />
      <pointLight color="#ffb070" intensity={2.4} distance={4.2} decay={2} position={[-1.7, 1.4, 1.7]} />
    </>
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
