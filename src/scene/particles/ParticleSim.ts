import * as THREE from "three";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";
import simulationShader from "./simulation.frag?raw";

export interface ParticleSimulation {
  compute: GPUComputationRenderer;
  positionVariable: ReturnType<GPUComputationRenderer["addVariable"]>;
  dispose: () => void;
}

export function createParticleSimulation(
  renderer: THREE.WebGLRenderer,
  size: number,
  center: THREE.Vector3,
  radius: number,
  target: THREE.Texture,
): ParticleSimulation | null {
  const compute = new GPUComputationRenderer(size, size, renderer);
  const initial = compute.createTexture();
  const values = initial.image.data as Float32Array;
  for (let i = 0; i < values.length; i += 4) {
    const y = Math.random() * 2 - 1;
    const angle = Math.random() * Math.PI * 2;
    const radial = Math.sqrt(1 - y * y);
    const distance = radius * Math.cbrt(Math.random());
    values[i] = center.x + Math.cos(angle) * radial * distance;
    values[i + 1] = center.y + y * distance;
    values[i + 2] = center.z + Math.sin(angle) * radial * distance;
    values[i + 3] = Math.max(0.12, distance);
  }

  const positionVariable = compute.addVariable("texturePosition", simulationShader, initial);
  compute.setVariableDependencies(positionVariable, [positionVariable]);
  positionVariable.material.uniforms.uDelta = { value: 0 };
  positionVariable.material.uniforms.uTime = { value: 0 };
  positionVariable.material.uniforms.uCursor = { value: new THREE.Vector3() };
  positionVariable.material.uniforms.uCursorActive = { value: 0 };
  positionVariable.material.uniforms.uCursorRadius = { value: radius * 0.72 };
  positionVariable.material.uniforms.uTarget = { value: target };

  const error = compute.init();
  initial.dispose();
  if (error) {
    console.error("SignalField GPU simulation failed to initialize:", error);
    compute.dispose();
    return null;
  }
  return { compute, positionVariable, dispose: () => compute.dispose() };
}
