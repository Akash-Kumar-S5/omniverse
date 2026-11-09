import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { Environment, Clouds, Cloud } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useOmni } from "../../state/store";
import { chapterLook } from "./chapterLook";
import Sanctum from "./Sanctum";
import VolumeCone from "./VolumeCone";
import Floor from "./Floor";
import ProjectArtefact from "./ProjectArtefact";
import Fire from "./Fire";
import HeroArmour from "./HeroArmour";

/**
 * Light is fire + moon only. The single warm source is the flickering point light in Fire.tsx.
 * The single cold source is one moon key down the oculus, at about 30% of the old key intensity.
 * The old per-chapter blue fills, rim lights and warm candle/spot lights are gone: the walls fall to black.
 */
function WorldLighting() {
  const quality = useOmni((s) => s.quality);
  const section = useOmni((s) => s.section);
  const look = chapterLook[section];

  return (
    <>
      <ambientLight intensity={look.ambientIntensity} color={look.ambientColor} />
      {/* Moon key angled through the ruins using per-chapter key color */}
      <directionalLight position={[-6, 14, 4]} intensity={look.keyLightIntensity * 0.45} color={look.keyLightColor} />
      <Environment
        files="/assets/hdri/studio_small_09_1k.exr"
        resolution={quality === "lite" ? 128 : 256}
        background={false}
        environmentIntensity={0.06}
      />
    </>
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
    return <pointLight color="#6a7a90" intensity={0.32} distance={2.8} decay={2} position={[0.7, 1.25, -0.8]} />;
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
      </>
    );
  }
  if (section === "experience") {
    // ch2: cool rim spot cone is handled in HeroArmour.tsx strictly aimed at the cuirass (zero back wall emission)
    return null;
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
    const heightRange = 2.4;

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
  }, [activeCount]);

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

function SparksAndMist() {
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
      <Clouds material={THREE.MeshBasicMaterial} limit={40}>
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

  useEffect(() => {
    threeScene.background = new THREE.Color(look.fogColor);
  }, [threeScene, look.fogColor]);

  return (
    <>
      <color attach="background" args={[look.fogColor]} />
      <WorldLighting />
      <SubjectRimLight />
      <SparksAndMist />
      <Fire />
      <HeroArmour />
      {/* Fog with #0b0907 atmosphere creating 2-3 faint silhouette layers of pillars */}
      <fog attach="fog" args={[look.fogColor, look.fogNear, look.fogFar]} />

      {/* Ruined gothic sanctum architecture with baked firelight */}
      <Sanctum />

      {/* Seamless ground plane matching background to eliminate any hard horizon */}
      <Floor />

      {/* Lit readable hero artefact per project beside the active slab */}
      <ProjectArtefact />

      {/* Soft oculus light and floating motes */}
      <VolumeCone />
    </>
  );
}
