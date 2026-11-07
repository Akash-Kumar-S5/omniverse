import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { CHAPTER_SHAPE, signal, type ShapeId, type SignalFieldProps } from "../../state/signal";
import { useOmni } from "../../state/store";
import { anchors as screenAnchors, type AnchorId } from "../../state/anchors";
import { createParticleSimulation, hasFloatRenderTargetSupport, type ParticleSimulation } from "./ParticleSim";
import { createTargetTexture } from "./targets";
import vertexShader from "./particles.vert?raw";
import fragmentShader from "./particles.frag?raw";
import cpuVertexShader from "./cpu.vert?raw";
import cpuFragmentShader from "./cpu.frag?raw";

const GPU_SIM_SIZE = { high: 256, medium: 160, lite: 96 } as const;
const CPU_SIM_SIZE = 192;
const TAU = Math.PI * 2;

type Backend = "gpu" | "cpu";

function SignalFieldCore({ quality, reducedMotion, anchors, shape: requestedShape }: SignalFieldProps) {
  const storeQuality = useOmni((state) => state.quality);
  const section = useOmni((state) => state.section);
  const activeProject = useOmni((state) => state.activeProject);
  const activeRole = useOmni((state) => state.activeRole);
  const storeReducedMotion = useOmni((state) => state.reducedMotion);
  const resolvedQuality = quality ?? storeQuality;
  const shape: ShapeId = requestedShape ?? CHAPTER_SHAPE[section];
  const forceCpu = useMemo(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("nogpgpu"), []);
  const debugEnabled = import.meta.env.DEV && typeof window !== "undefined" && new URLSearchParams(window.location.search).has("debug");
  const debugElement = useMemo(() => {
    if (!debugEnabled) return null;
    const element = document.createElement("div");
    Object.assign(element.style, { position: "fixed", top: "12px", left: "12px", zIndex: "10000", padding: "5px 8px", color: "#f1d9b9", background: "rgba(12,10,8,.78)", font: "11px/1.4 ui-monospace,monospace", pointerEvents: "none", whiteSpace: "nowrap" });
    return element;
  }, [debugEnabled]);
  const { gl, camera, pointer, raycaster, size: viewport } = useThree();
  const [backend, setBackend] = useState<Backend>(() => forceCpu || !hasFloatRenderTargetSupport(gl) ? "cpu" : "gpu");
  const [gpuReady, setGpuReady] = useState(false);
  const [debugStats, setDebugStats] = useState({ meanMs: 0, p95Ms: 0 });
  const simulation = useRef<ParticleSimulation | null>(null);
  const activeGpuTarget = useRef<THREE.Texture | null>(null);
  const morphProgress = useRef(1);
  const activeCpuTarget = useRef<THREE.Texture | null>(null);
  const cpuFromPositions = useRef<Float32Array | null>(null);
  const cpuMorphProgress = useRef(1);
  const cursor = useMemo(() => new THREE.Vector3(), []);
  const previousPointer = useRef(new THREE.Vector2());
  const lastPointerMotion = useRef(-1);
  const plane = useMemo(() => new THREE.Plane(), []);
  const previousDebugFrame = useRef(0);
  const debugSamples = useRef<number[]>([]);
  const simSize = backend === "cpu" ? CPU_SIM_SIZE : GPU_SIM_SIZE[resolvedQuality];
  const count = simSize * simSize;
  const cpuCursorOffsets = useMemo(() => new Float32Array(count * 3), [count]);
  const { scene: bust } = useGLTF("/assets/models/marble_bust_01.glb", false);
  const center = useMemo(() => new THREE.Vector3(...(anchors?.core?.position ?? [0, 0, 0])), [anchors]);
  const radius = anchors?.core?.radius ?? 1.6;
  const target = useMemo(() => createTargetTexture({ shape, count, anchors, activeProject, bust }), [shape, count, anchors, activeProject, bust]);
  const latestTarget = useRef(target);
  latestTarget.current = target;

  const geometry = useMemo(() => {
    const result = new THREE.BufferGeometry();
    if (backend === "gpu") {
      const uvs = new Float32Array(count * 2);
      for (let y = 0; y < simSize; y++) {
        for (let x = 0; x < simSize; x++) {
          const i = (y * simSize + x) * 2;
          uvs[i] = (x + 0.5) / simSize;
          uvs[i + 1] = (y + 0.5) / simSize;
        }
      }
      result.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    } else {
      const positions = new Float32Array(count * 3);
      const groups = new Float32Array(count);
      result.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
      result.setAttribute("aGroup", new THREE.BufferAttribute(groups, 1).setUsage(THREE.DynamicDrawUsage));
    }
    result.setDrawRange(0, count);
    return result;
  }, [backend, count, simSize]);

  const uniforms = useMemo(() => ({
    uPositions: { value: null as THREE.Texture | null },
    uTarget: { value: target as THREE.Texture },
    uActiveGroup: { value: activeRole },
    uPointSize: { value: resolvedQuality === "lite" ? 2.2 : 2.8 },
  }), [resolvedQuality, target, activeRole]);

  const cpuUniforms = useMemo(() => ({
    uActiveGroup: { value: activeRole },
    uPointSize: { value: resolvedQuality === "lite" ? 1.65 : 1.85 },
  }), [resolvedQuality, activeRole]);

  useEffect(() => {
    if (backend === "cpu") return;
    const initialTarget = latestTarget.current;
    const next = createParticleSimulation(gl, simSize, center, radius, initialTarget);
    if (!next) {
      setGpuReady(false);
      setBackend("cpu");
      return;
    }
    simulation.current = next;
    activeGpuTarget.current = initialTarget;
    morphProgress.current = 1;
    setGpuReady(true);
    return () => {
      next.dispose();
      simulation.current = null;
      activeGpuTarget.current = null;
      setGpuReady(false);
    };
  }, [backend, gl, simSize, center, radius]);

  useEffect(() => () => target.dispose(), [target]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => {
    if (!debugElement) return;
    document.body.appendChild(debugElement);
    return () => debugElement.remove();
  }, [debugElement]);
  useEffect(() => {
    if (!debugElement) return;
    debugElement.textContent = `${backend.toUpperCase()} · ${backend === "cpu" ? CPU_SIM_SIZE * CPU_SIM_SIZE : simSize * simSize} pts · ${debugStats.meanMs > 0 ? `${(1000 / debugStats.meanMs).toFixed(0)} fps mean / ${(1000 / debugStats.p95Ms).toFixed(0)} p95` : "sampling…"}`;
  }, [backend, debugElement, debugStats, simSize]);

  useFrame((state, delta) => {
    const motionReduced = reducedMotion ?? storeReducedMotion;
    const anchorName = shape === "project-glyph" ? "glyph" : shape;
    const shapeAnchor = anchors?.[anchorName]
      ? new THREE.Vector3(...anchors[anchorName].position)
      : shape === "beacon" ? new THREE.Vector3(0, 0, 0) : center;
    if (shape === "core") shapeAnchor.x += 5.5;
    const shapeRadius = anchors?.[anchorName]?.radius ?? (shape === "bust" ? 1.35 : shape === "beacon" ? 0.16 : radius);
    signal.focus[0] = shapeAnchor.x;
    signal.focus[1] = shapeAnchor.y;
    signal.focus[2] = shapeAnchor.z;
    signal.radius = shapeRadius;

    raycaster.setFromCamera(pointer, camera);
    plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()), shapeAnchor);
    const hasCursor = !motionReduced && raycaster.ray.intersectPlane(plane, cursor) !== null;
    const pointerDistance = pointer.distanceTo(previousPointer.current);
    const pointerSpeed = delta > 0 ? pointerDistance / delta : 0;
    if (pointerDistance > 0.001) lastPointerMotion.current = state.clock.elapsedTime;
    previousPointer.current.copy(pointer);
    const cursorAge = state.clock.elapsedTime - lastPointerMotion.current;
    const cursorPulse = cursorAge >= 0 && cursorAge < 0.35 ? 0.65 * (1 - cursorAge / 0.35) : 0;
    const cursorStrength = motionReduced ? 0 : Math.min(1, Math.max(pointerSpeed * 0.45, cursorPulse));

    if (backend === "gpu") {
      const sim = simulation.current;
      if (sim) {
        const computeUniforms = sim.positionVariable.material.uniforms;
        computeUniforms.uDelta.value = motionReduced ? 0 : Math.min(delta, 0.05);
        computeUniforms.uTime.value = motionReduced ? 0 : state.clock.elapsedTime;
        if (activeGpuTarget.current !== target) {
          sim.compute.renderTexture(sim.compute.getCurrentRenderTarget(sim.positionVariable).texture, sim.snapshot);
          computeUniforms.uFromTarget.value = sim.snapshot.texture;
          computeUniforms.uTarget.value = target;
          activeGpuTarget.current = target;
          morphProgress.current = motionReduced ? 1 : 0;
        }
        morphProgress.current = motionReduced ? 1 : THREE.MathUtils.damp(morphProgress.current, 1, 4.8, delta);
        if (morphProgress.current > 0.997) morphProgress.current = 1;
        computeUniforms.uMorphProgress.value = morphProgress.current;
        computeUniforms.uTurbulence.value = motionReduced ? 0 : 1;
        computeUniforms.uBeacon.value = shape === "beacon" ? 1 : 0;
        computeUniforms.uFocus.value.copy(shapeAnchor);
        computeUniforms.uCursor.value.copy(cursor);
        computeUniforms.uCursorActive.value = hasCursor ? 1 : 0;
        computeUniforms.uCursorStrength.value = cursorStrength;
        sim.compute.compute();
        uniforms.uPositions.value = sim.compute.getCurrentRenderTarget(sim.positionVariable).texture;
        uniforms.uTarget.value = target;
        uniforms.uActiveGroup.value = activeRole;
        signal.morph = morphProgress.current;
      }
    } else {
      const data = target.image.data as Float32Array;
      const positionAttribute = geometry.getAttribute("position") as THREE.BufferAttribute;
      const groupAttribute = geometry.getAttribute("aGroup") as THREE.BufferAttribute;
      const positions = positionAttribute.array as Float32Array;
      const groups = groupAttribute.array as Float32Array;
      if (activeCpuTarget.current !== target) {
        if (!activeCpuTarget.current) {
          for (let i = 0; i < count; i++) {
            positions[i * 3] = data[i * 4];
            positions[i * 3 + 1] = data[i * 4 + 1];
            positions[i * 3 + 2] = data[i * 4 + 2];
          }
          cpuFromPositions.current = positions.slice();
          cpuMorphProgress.current = 1;
        } else {
          cpuFromPositions.current = positions.slice();
          cpuMorphProgress.current = motionReduced ? 1 : 0;
        }
        activeCpuTarget.current = target;
      }
      cpuMorphProgress.current = motionReduced ? 1 : THREE.MathUtils.damp(cpuMorphProgress.current, 1, 4.8, delta);
      if (cpuMorphProgress.current > 0.997) cpuMorphProgress.current = 1;
      const progress = cpuMorphProgress.current;
      const scatter = Math.sin(Math.PI * progress);
      const from = cpuFromPositions.current ?? positions;
      const time = motionReduced ? 0 : state.clock.elapsedTime;
      const cursorDecay = motionReduced ? 0 : Math.exp(-Math.max(0, delta) * 2.6);
      for (let i = 0; i < count; i++) {
        const p = i * 3;
        const t = i * 4;
        const seed = (i * 0.61803398875) % 1;
        let x = from[p] + (data[t] - from[p]) * progress;
        let y = from[p + 1] + (data[t + 1] - from[p + 1]) * progress;
        let z = from[p + 2] + (data[t + 2] - from[p + 2]) * progress;
        if (!motionReduced) {
          const phase = time * 0.18 + seed * TAU;
          const flowX = Math.sin(y * 1.5 + phase) + Math.sin(z * 1.1 - phase * 1.3);
          const flowY = Math.sin(z * 1.4 + phase * 1.1) + Math.sin(x * 1.2 + phase * 0.7);
          const flowZ = Math.sin(x * 1.3 - phase) + Math.sin(y - phase * 0.9);
          x += flowX * (0.018 + seed * 0.012 + scatter * 0.1);
          y += flowY * (0.018 + seed * 0.012 + scatter * 0.1);
          z += flowZ * (0.018 + seed * 0.012 + scatter * 0.1);
          cpuCursorOffsets[p] *= cursorDecay;
          cpuCursorOffsets[p + 1] *= cursorDecay;
          cpuCursorOffsets[p + 2] *= cursorDecay;
          if (hasCursor) {
            const dx = x - cursor.x, dy = y - cursor.y, dz = z - cursor.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const reach = Math.max(0.7, shapeRadius * 0.62);
            const influence = THREE.MathUtils.clamp(1 - distance / reach, 0, 1);
            const impulse = cursorStrength * influence * Math.min(1, delta * 18) / Math.max(0.5, distance);
            cpuCursorOffsets[p] += dx * impulse;
            cpuCursorOffsets[p + 1] += dy * impulse;
            cpuCursorOffsets[p + 2] += dz * impulse;
          }
          x += cpuCursorOffsets[p];
          y += cpuCursorOffsets[p + 1];
          z += cpuCursorOffsets[p + 2];
          if (shape === "beacon") {
            const pulse = Math.sin(time * 2.2) * 0.035;
            x += pulse * (x - shapeAnchor.x);
            y += pulse * (y - shapeAnchor.y);
            z += pulse * (z - shapeAnchor.z);
          }
        }
        positions[p] = x;
        positions[p + 1] = y;
        positions[p + 2] = z;
        groups[i] = data[t + 3];
      }
      positionAttribute.needsUpdate = true;
      groupAttribute.needsUpdate = true;
      geometry.computeBoundingSphere();
      cpuUniforms.uActiveGroup.value = activeRole;
      signal.morph = progress;
    }

    if (debugEnabled) {
      const now = performance.now();
      if (previousDebugFrame.current > 0) debugSamples.current.push(now - previousDebugFrame.current);
      previousDebugFrame.current = now;
      if (debugSamples.current.length >= 60) {
        const sorted = debugSamples.current.slice().sort((a, b) => a - b);
        const meanMs = debugSamples.current.reduce((sum, value) => sum + value, 0) / debugSamples.current.length;
        setDebugStats({ meanMs, p95Ms: sorted[Math.floor(sorted.length * 0.95)] });
        debugSamples.current.length = 0;
      }
    }

    const candidates: [AnchorId, THREE.Vector3, string][] = [
      ["hero.core", center, "boot"],
      ["about.object", shape === "bust" ? shapeAnchor : new THREE.Vector3(...(anchors?.bust?.position ?? center.toArray())), "about"],
      ["projects.active", shape === "project-glyph" ? shapeAnchor : new THREE.Vector3(...(anchors?.glyph?.position ?? center.toArray())), "projects"],
      ["contact.beacon", shape === "beacon" ? shapeAnchor : new THREE.Vector3(...(anchors?.beacon?.position ?? [0, 0, 0])), "contact"],
    ];
    const projected = new THREE.Vector3();
    for (const [id, point, owner] of candidates) {
      projected.copy(point).project(camera);
      screenAnchors[id].x = (projected.x * 0.5 + 0.5) * viewport.width;
      screenAnchors[id].y = (-projected.y * 0.5 + 0.5) * viewport.height;
      screenAnchors[id].visible = section === owner && projected.z >= -1 && projected.z <= 1 && Math.abs(projected.x) <= 1 && Math.abs(projected.y) <= 1;
    }
  });

  const particleField = backend === "cpu" ? (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial vertexShader={cpuVertexShader} fragmentShader={cpuFragmentShader} uniforms={cpuUniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  ) : gpuReady ? (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  ) : null;

  return <>
    {particleField}
  </>;
}

export default function SignalField(props: SignalFieldProps) {
  return <Suspense fallback={null}><SignalFieldCore {...props} /></Suspense>;
}
