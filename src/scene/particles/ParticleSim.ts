import * as THREE from "three";
import { GPUComputationRenderer } from "three/addons/misc/GPUComputationRenderer.js";
import simulationShader from "./simulation.frag?raw";
import curlShader from "../shaders/curl.glsl?raw";
import noiseShader from "../shaders/lib/noise4D.glsl?raw";

export interface ParticleSimulation {
  compute: GPUComputationRenderer;
  positionVariable: ReturnType<GPUComputationRenderer["addVariable"]>;
  snapshot: THREE.WebGLRenderTarget;
  dispose: () => void;
}

type ComputeDataType = typeof THREE.FloatType | typeof THREE.HalfFloatType;
const dataTypeCache = new WeakMap<THREE.WebGLRenderer, ComputeDataType | null>();
const probeShader = `
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  gl_FragColor = texture2D(textureProbe, uv) * 2.0;
}`;

function halfToFloat(value: number) {
  const sign = (value & 0x8000) ? -1 : 1;
  const exponent = (value >> 10) & 0x1f;
  const fraction = value & 0x03ff;
  if (exponent === 0) return sign * Math.pow(2, -14) * (fraction / 1024);
  if (exponent === 0x1f) return fraction ? Number.NaN : sign * Infinity;
  return sign * Math.pow(2, exponent - 15) * (1 + fraction / 1024);
}

function sanityCheckTarget(renderer: THREE.WebGLRenderer, type: ComputeDataType) {
  const probe = new GPUComputationRenderer(2, 2, renderer);
  probe.setDataType(type);
  const initial = probe.createTexture();
  (initial.image.data as Float32Array).set([
    0.125, 0.25, 0.375, 1, 0.125, 0.25, 0.375, 1,
    0.125, 0.25, 0.375, 1, 0.125, 0.25, 0.375, 1,
  ]);
  initial.needsUpdate = true;
  const variable = probe.addVariable("textureProbe", probeShader, initial);
  probe.setVariableDependencies(variable, [variable]);
  try {
    if (probe.init()) return false;
    probe.compute();
    const target = probe.getCurrentRenderTarget(variable);
    const data = type === THREE.HalfFloatType ? new Uint16Array(16) : new Float32Array(16);
    renderer.readRenderTargetPixels(target, 0, 0, 2, 2, data);
    const red = type === THREE.HalfFloatType ? halfToFloat(data[0]) : data[0];
    const green = type === THREE.HalfFloatType ? halfToFloat(data[1]) : data[1];
    const blue = type === THREE.HalfFloatType ? halfToFloat(data[2]) : data[2];
    return Number.isFinite(red) && Math.abs(red - 0.25) < 0.025 && Math.abs(green - 0.5) < 0.025 && Math.abs(blue - 0.75) < 0.025;
  } catch {
    return false;
  } finally {
    initial.dispose();
    probe.dispose();
  }
}

/** Check both WebGL2 render-target extensions and verify one compute/readback pass. */
export function getSupportedComputeDataType(renderer: THREE.WebGLRenderer) {
  if (dataTypeCache.has(renderer)) return dataTypeCache.get(renderer) ?? null;
  let supported: ComputeDataType | null = null;
  if (renderer.capabilities.isWebGL2) {
    const candidates: ComputeDataType[] = [];
    if (renderer.extensions.has("EXT_color_buffer_float")) candidates.push(THREE.FloatType);
    if (renderer.extensions.has("EXT_color_buffer_half_float")) candidates.push(THREE.HalfFloatType);
    for (const type of candidates) {
      if (sanityCheckTarget(renderer, type)) {
        supported = type;
        break;
      }
    }
  }
  dataTypeCache.set(renderer, supported);
  return supported;
}

export function hasFloatRenderTargetSupport(renderer: THREE.WebGLRenderer) {
  return renderer.capabilities.isWebGL2 && (
    renderer.extensions.has("EXT_color_buffer_float") ||
    renderer.extensions.has("EXT_color_buffer_half_float")
  );
}

export function createParticleSimulation(
  renderer: THREE.WebGLRenderer,
  size: number,
  center: THREE.Vector3,
  radius: number,
  target: THREE.Texture,
): ParticleSimulation | null {
  const dataType = getSupportedComputeDataType(renderer);
  if (dataType === null) return null;
  const compute = new GPUComputationRenderer(size, size, renderer);
  compute.setDataType(dataType);
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

  const positionVariable = compute.addVariable("texturePosition", `${noiseShader}\n${curlShader}\n${simulationShader}`, initial);
  compute.setVariableDependencies(positionVariable, [positionVariable]);
  positionVariable.material.uniforms.uDelta = { value: 0 };
  positionVariable.material.uniforms.uTime = { value: 0 };
  positionVariable.material.uniforms.uCursor = { value: new THREE.Vector3() };
  positionVariable.material.uniforms.uCursorActive = { value: 0 };
  positionVariable.material.uniforms.uCursorStrength = { value: 0 };
  positionVariable.material.uniforms.uCursorWake = { value: 0 };
  positionVariable.material.uniforms.uCursorVelocity = { value: new THREE.Vector3() };
  positionVariable.material.uniforms.uTarget = { value: target };
  positionVariable.material.uniforms.uFromTarget = { value: initial };
  positionVariable.material.uniforms.uMorphProgress = { value: 0 };
  positionVariable.material.uniforms.uTurbulence = { value: 1 };
  positionVariable.material.uniforms.uBeacon = { value: 0 };
  positionVariable.material.uniforms.uFocus = { value: center.clone() };

  const snapshot = compute.createRenderTarget(size, size, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.NearestFilter);

  const error = compute.init();
  initial.dispose();
  if (error) {
    console.error("SignalField GPU simulation failed to initialize:", error);
    compute.dispose();
    return null;
  }
  return { compute, positionVariable, snapshot, dispose: () => { snapshot.dispose(); compute.dispose(); } };
}
