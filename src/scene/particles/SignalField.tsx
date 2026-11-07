import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { SignalFieldProps } from "../../state/signal";
import { SIM_SIZE, signal } from "../../state/signal";
import { useOmni } from "../../state/store";
import { createParticleSimulation, type ParticleSimulation } from "./ParticleSim";
import vertexShader from "./particles.vert?raw";
import fragmentShader from "./particles.frag?raw";

export default function SignalField({ quality, reducedMotion, anchors }: SignalFieldProps) {
  const storeQuality = useOmni((state) => state.quality);
  const resolvedQuality = quality ?? storeQuality;
  const size = SIM_SIZE[resolvedQuality];
  const { gl, camera, pointer, raycaster } = useThree();
  const simulation = useRef<ParticleSimulation | null>(null);
  const [ready, setReady] = useState(false);
  const cursor = useMemo(() => new THREE.Vector3(), []);
  const plane = useMemo(() => new THREE.Plane(), []);
  const center = useMemo(() => new THREE.Vector3(...(anchors?.core?.position ?? [0, 0, 0])), [anchors]);
  const radius = anchors?.core?.radius ?? 1.6;
  const geometry = useMemo(() => {
    const count = size * size;
    const uvs = new Float32Array(count * 2);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 2;
        uvs[i] = (x + 0.5) / size;
        uvs[i + 1] = (y + 0.5) / size;
      }
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    result.setDrawRange(0, count);
    return result;
  }, [size]);
  const uniforms = useMemo(() => ({
    uPositions: { value: null as THREE.Texture | null },
    uPointSize: { value: resolvedQuality === "lite" ? 2.2 : 2.8 },
  }), [resolvedQuality]);

  useEffect(() => {
    const next = createParticleSimulation(gl, size, center, radius);
    simulation.current = next;
    setReady(Boolean(next));
    return () => {
      next?.dispose();
      simulation.current = null;
      setReady(false);
    };
  }, [gl, size, center, radius]);

  useFrame((state, delta) => {
    const sim = simulation.current;
    if (!sim) return;
    const motionReduced = reducedMotion ?? useOmni.getState().reducedMotion;
    const focus = center;
    signal.focus[0] = focus.x;
    signal.focus[1] = focus.y;
    signal.focus[2] = focus.z;
    signal.radius = radius;
    signal.morph = 1;

    const computeUniforms = sim.positionVariable.material.uniforms;
    computeUniforms.uDelta.value = motionReduced ? 0 : Math.min(delta, 0.05);
    computeUniforms.uTime.value = motionReduced ? 0 : state.clock.elapsedTime;
    raycaster.setFromCamera(pointer, camera);
    plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()), focus);
    const hasCursor = !motionReduced && raycaster.ray.intersectPlane(plane, cursor) !== null;
    computeUniforms.uCursor.value.copy(cursor);
    computeUniforms.uCursorActive.value = hasCursor ? 1 : 0;
    sim.compute.compute();
    uniforms.uPositions.value = sim.compute.getCurrentRenderTarget(sim.positionVariable).texture;
  });

  return ready ? (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  ) : null;
}
