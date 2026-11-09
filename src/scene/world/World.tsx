import { lazy, Suspense, useRef, useMemo, useEffect, useState } from "react";
import * as THREE from "three";
import { Environment, Clouds, Cloud } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useOmni } from "../../state/store";
import { chapterLook } from "./chapterLook";
import Sanctum from "./Sanctum";
import VolumeCone from "./VolumeCone";
import Floor from "./Floor";
import ProjectArtefact, { PaintingWarm } from "./ProjectArtefact";
import Fire from "./Fire";
import HeroArmour from "./HeroArmour";

// r22: the effigy and the church backdrop are lazy chunks (not in the initial payload)
const EffigyKnight = lazy(() => import("./EffigyKnight"));
const RuinChurch = lazy(() => import("./RuinChurch"));
const HeroFloor = lazy(() => import("./HeroFloor"));

/**
 * Light is fire + moon only. The single warm source is the flickering point light in Fire.tsx.
 * The single cold source is one moon key down the oculus, at about 30% of the old key intensity.
 * The old per-chapter blue fills, rim lights and warm candle/spot lights are gone: the walls fall to black.
 */
function WorldLighting({ late }: { late: boolean }) {
  const quality = useOmni((s) => s.quality);
  const section = useOmni((s) => s.section);
  const look = chapterLook[section];

  return (
    <>
      <ambientLight intensity={look.ambientIntensity} color={look.ambientColor} />
      {/* Moon key angled through the ruins using per-chapter key color */}
      <directionalLight position={[-6, 14, 4]} intensity={look.keyLightIntensity * 0.45} color={look.keyLightColor} />
      {late && <Suspense fallback={null}>
        <Environment
        files="/assets/hdri/studio_small_09_1k.exr"
        resolution={quality === "lite" ? 128 : 256}
        background={false}
        environmentIntensity={0.06}
        />
      </Suspense>}
    </>
  );
}

/**
 * R20 ch2: Experience backdrop lighting & depth
 * - One warm rim spot from behind-left on the cuirass
 * - Faint warm floor pool behind the cuirass (penumbra 1.0)
 * - Faint atmospheric warm fog haze gradient in the void behind it for layered depth
 */
// r39: each role gets its own key angle and colour temperature so the four steps do not share one light
const ROLE_LIGHT = [
  { color: "#ffaa55", pos: [-13.3, 1.4, 0.0] },
  { color: "#ffc27a", pos: [-13.2, 1.9, 0.9] },
  { color: "#ff8c3a", pos: [-13.3, 0.9, -0.9] },
  { color: "#ffe0b8", pos: [-13.0, 2.1, 0.3] },
] as const;

function ExperienceLighting() {
  const role = useOmni((s) => Math.max(0, Math.min(3, s.activeRole)));
  const section = useOmni((s) => s.section);

  const cuirassTarget = useMemo(() => {
    const t = new THREE.Object3D();
    t.position.set(-12.5, 0.65, -1.2);
    return t;
  }, []);

  const floorTarget = useMemo(() => {
    const t = new THREE.Object3D();
    // Centered on the floor directly behind the cuirass stand (accounting for perspective depth)
    t.position.set(-14.8, 0, -1.8);
    return t;
  }, []);

  const hazeTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, "rgba(230, 135, 60, 0.85)");
      grad.addColorStop(0.35, "rgba(180, 95, 35, 0.50)");
      grad.addColorStop(0.7, "rgba(85, 36, 12, 0.16)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  if (section !== "experience") return null;

  return (
    <group>
      <primitive object={cuirassTarget} />
      <primitive object={floorTarget} />

      {/* 1. Warm rim spot from behind-left on the cuirass (world +Z is screen left, world -X is behind) */}
      <spotLight
        color={ROLE_LIGHT[role].color}
        intensity={8}
        distance={4.0}
        angle={Math.PI / 4}
        penumbra={0.8}
        decay={2}
        position={[...ROLE_LIGHT[role].pos]}
        target={cuirassTarget}
      />

      {/* 2. Faint warm floor pool behind the cuirass (decay: 2, penumbra: 1.0 for seamless feathering) */}
      <spotLight
        color="#df7c38"
        intensity={0.25}
        distance={4.5}
        angle={Math.PI / 5}
        penumbra={1.0}
        decay={2}
        position={[-14.8, 3.4, -1.8]}
        target={floorTarget}
      />

      {/* 3. Soft warm atmospheric fog gradient in the void behind cuirass (layered depth, zero straight edges) */}
      {hazeTexture && (
        <mesh position={[-16.0, 0.9, -2.0]} rotation={[0, Math.PI / 2 + 0.12, 0]}>
          <planeGeometry args={[3.2, 2.4]} />
          <meshBasicMaterial
            map={hazeTexture}
            transparent
            opacity={0.04}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}

/**
 * Subject rim and key lights: confined strictly to subjects with short distance / spot cones (decay: 2)
 * so light never washes background walls or creates false boxes.
 */
function SubjectRimLight() {
  const section = useOmni((s) => s.section);

  if (section === "boot") {
    // ch0: low cool rim behind fire barrel & mourner relief
    return (
      <>
        <pointLight color="#6a7a90" intensity={0.32} distance={2.8} decay={2} position={[0.7, 1.25, -0.8]} />
        {/* r39: a low cool moon wash from high behind the ruins so the church silhouettes and back wall lift out of the black */}
        <pointLight color="#8fa6cf" intensity={14} distance={20} decay={2} position={[7, 7, -9]} />
      </>
    );
  }
  if (section === "about") {
    // ch1: c12 warm key on the statue (highlights drapery, face and weapon) confined strictly to statue, zero wall spill
    return (
      <>
        {/* Warm key on statue (c12 bar): confined warm amber highlight positioned close to statue so wall stays unlit */}
        {/* r20: c14 key restored (c14 measured statue 33.6, back glow 4.9) */}
        <pointLight color="#ffc882" intensity={3.2} distance={4.2} decay={2} position={[8.8, 2.2, -1.0]} />
        {/* Confined cool rim behind statue to give crisp silhouette separation without wall wash */}
        <pointLight color="#6a7a90" intensity={0.85} distance={2.2} decay={2} position={[11.8, 1.8, 0.4]} />
        {/* r34: a stronger cool back-rim from behind-right and a warm kicker from behind-left, so both contours of the statue separate from the wall */}
        <pointLight color="#9db4d8" intensity={2.4} distance={3.4} decay={2} position={[12.4, 2.9, 1.0]} />
        <pointLight color="#ff9a52" intensity={2.0} distance={3.0} decay={2} position={[11.9, 2.2, -1.5]} />
      </>
    );
  }
  if (section === "experience") {
    // ch2: warm rim spot from behind-left on cuirass + faint warm floor pool & atmospheric depth
    return <ExperienceLighting />;
  }
  if (section === "contact") {
    // ch4: low cool rim behind barrel & relief
    return <pointLight color="#6a7a90" intensity={0.32} distance={2.8} decay={2} position={[0.7, 1.25, -0.8]} />;
  }
  return null;
}

const emberVertexShader = `
uniform float uTime;
uniform float uPixelRatio;
uniform float uStartY;
uniform float uHeightRange;
uniform float uViewportHeight;

attribute float aSize;
attribute float aSpeed;
attribute float aOpacity;
attribute vec3 aNoise;
attribute vec3 aColor;

varying vec3 vColor;
varying float vOpacity;
varying float vScreenY;

void main() {
  vec3 pos = position;
  float rise = mod(pos.y - uStartY + uTime * aSpeed, uHeightRange);
  pos.y = uStartY + rise;

  // Wide organic spread as embers rise (no column formation)
  float spreadFactor = rise / uHeightRange;
  float driftPhase = uTime * aSpeed * 1.2 + pos.y * 1.5;
  pos.x += (aNoise.x - 0.5) * 1.6 * spreadFactor + sin(driftPhase + aNoise.z) * 0.28 * spreadFactor;
  pos.z += (aNoise.y - 0.5) * 1.6 * spreadFactor + cos(driftPhase + aNoise.z) * 0.28 * spreadFactor;

  vec4 mvPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  vec4 clipPos = projectionMatrix * mvPosition;
  gl_Position = clipPos;

  // Point sizes are drawing-buffer pixels, independent of display DPR.
  gl_PointSize = aSize;

  // Screen Y in CSS pixels from top of viewport
  float ndcY = clipPos.y / clipPos.w; // -1 at bottom, +1 at top
  float screenY = (1.0 - ndcY) * 0.5 * uViewportHeight;
  vScreenY = screenY;

  vColor = aColor;

  // Fade in as they emerge from fire
  float fadeIn = smoothstep(0.0, 0.22, rise);
  // Fade out before top
  float fadeOut = smoothstep(uHeightRange, uHeightRange * 0.72, rise);
  // Cap height below nav: fade to zero between 140px and 96px from top of 1440x900 viewport
  float navFade = smoothstep(96.0, 140.0, screenY);

  vOpacity = aOpacity * fadeIn * fadeOut * navFade;
}
`;

const emberFragmentShader = `
uniform float uPixelRatio;
uniform float uIsMobile;
uniform float uViewportHeight;

varying vec3 vColor;
varying float vOpacity;
varying float vScreenY;

void main() {
  // Hard cap below nav: strictly none draw above y=90px (nav) at 1440x900
  if (vScreenY <= 92.0) {
    discard;
  }

  // Mobile protection: keep 0-390 x 480-560 completely free of embers
  if (uIsMobile > 0.5) {
    float screenX = gl_FragCoord.x / uPixelRatio;
    if (screenX >= 0.0 && screenX <= 390.0 && vScreenY >= 475.0 && vScreenY <= 565.0) {
      discard;
    }
  }

  if (vOpacity <= 0.01) {
    discard;
  }

  // Thin spark with slender vertical stretch (2.4x height relative to width)
  vec2 p = gl_PointCoord - vec2(0.5);
  vec2 stretched = vec2(p.x * 2.4, p.y);
  float dist = length(stretched);
  if (dist > 0.5) discard;

  // Crisp solid spark core, NO round halo
  float alpha = smoothstep(0.5, 0.22, dist) * vOpacity;

  gl_FragColor = vec4(vColor, alpha);
}
`;

function HearthEmbers() {
  const quality = useOmni((s) => s.quality);
  const section = useOmni((s) => s.section);
  const isContact = section === "contact";
  const { size } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const count = quality === "lite" ? 48 : 84;
  const countMult = isContact ? 0.6 : 1.0;
  const activeCount = Math.round(count * countMult);

  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(activeCount * 3);
    const sizes = new Float32Array(activeCount);
    const speeds = new Float32Array(activeCount);
    const opacities = new Float32Array(activeCount);
    const noises = new Float32Array(activeCount * 3);
    const colors = new Float32Array(activeCount * 3);

    const warmPalette = [
      new THREE.Color("#ffd48a"), // warm gold
      new THREE.Color("#ffa842"), // warm fiery amber
      new THREE.Color("#ffc26a"), // golden yellow
      new THREE.Color("#ff9234"), // warm ember orange
    ];

    const startY = 0.70;   // r18: 5 cm inside the barrel mouth (rim y~0.745)
    const heightRange = isContact ? 4.6 : 2.4;   // r32: on the contact chapter the embers climb toward the oculus

    for (let i = 0; i < activeCount; i++) {
      // Wider spawn spread (radius r <= 0.95m) so no column forms
      const r = Math.sqrt(Math.random()) * 0.35;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3 + 0] = r * Math.cos(theta);
      positions[i * 3 + 1] = startY + Math.random() * heightRange;
      positions[i * 3 + 2] = r * Math.sin(theta);

      // Keep sparks visible at DPR 1 while retaining their slender shape.
      sizes[i] = 3.2 + Math.random() * 0.9;
      // Speeds
      speeds[i] = 0.20 + Math.random() * 0.25;
      // Dimmer opacities (0.30 - 0.50)
      opacities[i] = 0.30 + Math.random() * 0.20;

      noises[i * 3 + 0] = Math.random();
      noises[i * 3 + 1] = Math.random();
      noises[i * 3 + 2] = Math.random() * 6.28;

      const c = warmPalette[Math.floor(Math.random() * warmPalette.length)];
      colors[i * 3 + 0] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute("aOpacity", new THREE.BufferAttribute(opacities, 1));
    geo.setAttribute("aNoise", new THREE.BufferAttribute(noises, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    const u = {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uIsMobile: { value: 0 },
      uViewportHeight: { value: 900 },
      uStartY: { value: startY },
      uHeightRange: { value: heightRange },
    };

    return { geometry: geo, uniforms: u };
  }, [activeCount, isContact]);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      const isMobile = size.width < 600 ? 1.0 : 0.0;
      matRef.current.uniforms.uIsMobile.value = isMobile;
      matRef.current.uniforms.uViewportHeight.value = size.height;
      matRef.current.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    }
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={emberVertexShader}
        fragmentShader={emberFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** r34: a soft puff texture drawn locally, so the floor mist no longer fetches drei's default cloud.png from a third-party CDN (a flake and an offline break) */
function makePuffDataUrl(): string {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  if (!g) return "";
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  g.clearRect(0, 0, 128, 128);
  for (let i = 0; i < 26; i++) {
    const r = 18 + rnd() * 26;
    const x = 64 + (rnd() - 0.5) * 50;
    const y = 64 + (rnd() - 0.5) * 50;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "rgba(255,255,255,0.32)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
  }
  return c.toDataURL("image/png");
}

function SparksAndMist() {
  const puff = useMemo(() => makePuffDataUrl(), []);
  const quality = useOmni((s) => s.quality);
  const section = useOmni((s) => s.section);
  const isContact = section === "contact";
  const isMobile = typeof window !== "undefined" && window.innerWidth < 600;
  const offsetY = (isMobile && isContact) ? -0.48 : 0;

  return (
    <group position={[0, offsetY, 0]}>
      {/* Crisp 1.5-3px elongated sparks without halo sprites */}
      <HearthEmbers />

      {/* Low subtle floor mist across the cold stone ruins */}
      <Clouds material={THREE.MeshBasicMaterial} limit={40} texture={puff}>
        <Cloud
          seed={42}
          segments={quality === "lite" ? 8 : 16}
          bounds={[24, 0.7, 32]}
          position={[0, 0.32, -6]}
          volume={3.5}
          color="#2e2824"
          opacity={0.13}
          speed={0.12}
          fade={22}
        />
      </Clouds>
    </group>
  );
}

export default function World() {
  const section = useOmni((s) => s.section);
  const look = chapterLook[section];
  const { scene: threeScene } = useThree();
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setArmed(true), 4000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    threeScene.background = new THREE.Color(look.fogColor);
  }, [threeScene, look.fogColor]);

  return (
    <>
      <color attach="background" args={[look.fogColor]} />
      <WorldLighting late={armed} />
      <SubjectRimLight />
      <SparksAndMist />
      {/* r29: the fire is far off-screen in ch3; hiding it removes its bloom/DOF contribution (ghost disc behind the pager) */}
      <group visible={section !== "projects"}>
        <Suspense fallback={null}>
          {(section !== "projects" || armed) && <Fire />}
        </Suspense>
      </group>
      {section === "experience" && (
        <Suspense fallback={null}>
          <HeroArmour />
        </Suspense>
      )}
      <Suspense fallback={null}>
        {(section === "boot" || section === "contact") && <EffigyKnight />}
        {(section === "boot" || section === "contact" || section === "experience") && <RuinChurch />}
        {section === "boot" && <HeroFloor />}
      </Suspense>
      {/* Fog with #0b0907 atmosphere creating 2-3 faint silhouette layers of pillars */}
      <fog attach="fog" args={[look.fogColor, look.fogNear, look.fogFar]} />

      {/* Ruined gothic sanctum architecture with baked firelight */}
      <Sanctum />

      {/* Seamless ground plane matching background to eliminate any hard horizon */}
      <Floor />

      {/* Lit readable hero artefact per project beside the active slab */}
      {/* r32: its 9 textures and 2 GLBs used to hold the whole canvas (root suspense) until loaded; now they stream in after first paint */}
      {(armed || section === "projects") && (
        <Suspense fallback={null}>
          <ProjectArtefact />
        </Suspense>
      )}
      {armed && (
        <Suspense fallback={null}>
          <PaintingWarm />
        </Suspense>
      )}

      {/* Soft oculus light and floating motes */}
      <VolumeCone />
    </>
  );
}
