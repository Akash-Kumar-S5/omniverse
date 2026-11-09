import { useRef, useMemo } from "react";
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
      <ambientLight intensity={0.03} color="#1a1c24" />
      <directionalLight position={[0, 14, -1.5]} intensity={look.keyLightIntensity * 0.3} color="#9fb3d1" />
      <Environment
        files="/assets/hdri/studio_small_09_1k.exr"
        resolution={quality === "lite" ? 128 : 256}
        background={false}
        environmentIntensity={0.04}
      />
    </>
  );
}

const emberVertexShader = `
uniform float uTime;
uniform float uPixelRatio;
uniform float uStartY;
uniform float uHeightRange;

attribute float aSize;
attribute float aSpeed;
attribute float aOpacity;
attribute vec3 aNoise;
attribute vec3 aColor;

varying vec3 vColor;
varying float vOpacity;

void main() {
  vec3 pos = position;
  float rise = mod(pos.y - uStartY + uTime * aSpeed, uHeightRange);
  pos.y = uStartY + rise;

  // Gentle organic drift
  float driftPhase = uTime * aSpeed * 1.4 + pos.y * 1.8;
  pos.x += sin(driftPhase + aNoise.x) * 0.14 * (rise / uHeightRange);
  pos.z += cos(driftPhase + aNoise.y) * 0.14 * (rise / uHeightRange);

  vec4 mvPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Size in screen pixels (1.5-3 px at 1440)
  float distFactor = clamp(6.0 / -mvPosition.z, 0.75, 1.35);
  gl_PointSize = aSize * uPixelRatio * distFactor;

  vColor = aColor;
  // Fade in as they emerge from coals, fade out before top
  float fadeIn = smoothstep(0.0, 0.20, rise);
  float fadeOut = smoothstep(uHeightRange, uHeightRange * 0.72, rise);
  vOpacity = aOpacity * fadeIn * fadeOut;
}
`;

const emberFragmentShader = `
uniform float uPixelRatio;
uniform float uIsMobile;
uniform float uViewportHeight;

varying vec3 vColor;
varying float vOpacity;

void main() {
  // Mobile protection: keep 0-390 x 480-560 completely free of embers
  if (uIsMobile > 0.5) {
    float screenX = gl_FragCoord.x / uPixelRatio;
    float screenY = uViewportHeight - (gl_FragCoord.y / uPixelRatio);
    if (screenX >= 0.0 && screenX <= 390.0 && screenY >= 475.0 && screenY <= 565.0) {
      discard;
    }
  }

  // Slight vertical stretch (1.6x height relative to width)
  vec2 p = gl_PointCoord - vec2(0.5);
  vec2 stretched = vec2(p.x * 1.6, p.y);
  float dist = length(stretched);
  if (dist > 0.5) discard;

  // Crisp solid spark core, NO halo sprite flare
  float alpha = smoothstep(0.5, 0.15, dist) * vOpacity;

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

    const startY = 0.70;
    const heightRange = 3.2;

    for (let i = 0; i < activeCount; i++) {
      // Randomise across barrel mouth radius (r <= 0.36)
      const r = Math.sqrt(Math.random()) * 0.36;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3 + 0] = r * Math.cos(theta);
      positions[i * 3 + 1] = startY + Math.random() * heightRange;
      positions[i * 3 + 2] = r * Math.sin(theta);

      // Sizes: 1.5 - 2.8 px at 1440
      sizes[i] = 1.5 + Math.random() * 1.3;
      // Speeds
      speeds[i] = 0.28 + Math.random() * 0.35;
      // Dimmer opacities (0.35 - 0.55)
      opacities[i] = 0.35 + Math.random() * 0.20;

      noises[i * 3 + 0] = Math.random() * 10;
      noises[i * 3 + 1] = Math.random() * 10;
      noises[i * 3 + 2] = Math.random() * 10;

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
      uPixelRatio: { value: Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2) },
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
      matRef.current.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 2);
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

  return (
    <>
      <WorldLighting />
      <SparksAndMist />
      <Fire />
      <HeroArmour />
      {/* Fog precisely matching background (#060505) with seamless falloff */}
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
