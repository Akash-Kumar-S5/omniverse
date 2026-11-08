import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { TIERS, signal } from "../../state/signal";
import noise3D from "../shaders/lib/noise3D.glsl?raw";

const beamVertexShader = `
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying float vLocalY;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  vLocalY = position.y;
  vec4 mvPosition = viewMatrix * worldPos;
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const beamFragmentShader = `
uniform float uTime;
uniform vec3 uColor;
uniform float uBaseOpacity;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying float vLocalY;

${noise3D}

void main() {
  vec3 viewDir = normalize(vViewPosition);
  vec3 norm = normalize(vNormal);

  // 1. Edge fresnel falloff: softly tapers off at glancing cylinder edges (no harsh silhouette line)
  float edgeFresnel = smoothstep(0.04, 0.44, abs(dot(viewDir, norm)));

  // 2. Depth-fade at floor (vLocalY = -4.4 is world y=0) and oculus rim (vLocalY = 4.4 is world y=8.8)
  float floorFade = smoothstep(-4.4, -2.6, vLocalY);
  float oculusFade = smoothstep(4.4, 3.8, vLocalY);
  float heightFade = floorFade * oculusFade;

  // 3. Scrolling 3D simplex noise simulating subtle shifting atmospheric dust haze
  vec3 noiseCoord = vec3(vWorldPosition.xz * 0.45, vWorldPosition.y * 0.28 - uTime * 0.20);
  float n = snoise(noiseCoord);
  float noiseFactor = mix(0.72, 1.28, n * 0.5 + 0.5);

  // 4. Subtle additive haze opacity (in 0.08 - 0.15 range)
  float alpha = uBaseOpacity * edgeFresnel * heightFade * noiseFactor;

  gl_FragColor = vec4(uColor * alpha, alpha);
}
`;

export default function VolumeCone() {
  const quality = useOmni((s) => s.quality);
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#fff0d4") },
      uBaseOpacity: { value: 0.11 },
    }),
    [],
  );

  useFrame((state) => {
    if (targetRef.current) {
      targetRef.current.position.set(signal.focus[0], signal.focus[1], signal.focus[2]);
      targetRef.current.updateMatrixWorld();
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  if (!TIERS[quality].volumetrics) return null;

  return (
    <group>
      <primitive object={targetRef.current} />

      {/* Subtle downward illumination through the ceiling oculus */}
      <spotLight
        position={[0, 8.8, 0]}
        target={targetRef.current}
        color="#9fb3d1"
        intensity={quality === "high" ? 1.0 : 0.7}
        distance={16}
        angle={0.55}
        penumbra={0.7}
        decay={1.2}
      />

      {/* Subtle additive haze cylinder: oculus [0, 8.8, 0] to floor [0, 0, 0] */}
      <mesh position={[0, 4.4, 0]}>
        <cylinderGeometry args={[0.8, 3.6, 8.8, 64, 32, true]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={beamVertexShader}
          fragmentShader={beamFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating dust motes within the sunbeam */}
      <Sparkles
        key={quality}
        position={[0, 4.4, 0]}
        count={quality === "high" ? 50 : 28}
        scale={[3.2, 7.8, 3.2]}
        size={quality === "high" ? 2.5 : 1.8}
        speed={0.14}
        color="#ffe8c4"
        opacity={0.45}
      />
    </group>
  );
}
