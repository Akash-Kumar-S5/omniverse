import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { CHAPTER_SHAPE, SIM_SIZE, signal, type ShapeId, type SignalFieldProps } from "../../state/signal";
import { useOmni } from "../../state/store";
import { anchors as screenAnchors, type AnchorId } from "../../state/anchors";
import { createParticleSimulation, type ParticleSimulation } from "./ParticleSim";
import { createTargetTexture } from "./targets";
import vertexShader from "./particles.vert?raw";
import fragmentShader from "./particles.frag?raw";

function SignalFieldCore({ quality, reducedMotion, anchors, shape: requestedShape }: SignalFieldProps) {
  const storeQuality = useOmni((state) => state.quality);
  const section = useOmni((state) => state.section);
  const activeProject = useOmni((state) => state.activeProject);
  const activeRole = useOmni((state) => state.activeRole);
  const storeReducedMotion = useOmni((state) => state.reducedMotion);
  const resolvedQuality = quality ?? storeQuality;
  const shape: ShapeId = requestedShape ?? CHAPTER_SHAPE[section];
  const size = SIM_SIZE[resolvedQuality];
  const { scene: bust } = useGLTF("/assets/models/marble_bust_01.glb", false);
  const { gl, camera, pointer, raycaster, size: viewport } = useThree();
  const simulation = useRef<ParticleSimulation | null>(null);
  const [ready, setReady] = useState(false);
  const cursor = useMemo(() => new THREE.Vector3(), []);
  const plane = useMemo(() => new THREE.Plane(), []);
  const center = useMemo(() => new THREE.Vector3(...(anchors?.core?.position ?? [0, 0, 0])), [anchors]);
  const radius = anchors?.core?.radius ?? 1.6;
  const target = useMemo(() => createTargetTexture({
    shape,
    count: size * size,
    anchors,
    activeProject,
    activeRole,
    bust,
  }), [shape, size, anchors, activeProject, activeRole, bust]);
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
    uTarget: { value: target as THREE.Texture },
    uActiveGroup: { value: activeRole },
    uPointSize: { value: resolvedQuality === "lite" ? 2.2 : 2.8 },
  }), [resolvedQuality, target, activeRole]);

  useEffect(() => {
    const next = createParticleSimulation(gl, size, center, radius, target);
    simulation.current = next;
    setReady(Boolean(next));
    return () => {
      next?.dispose();
      target.dispose();
      simulation.current = null;
      setReady(false);
    };
  }, [gl, size, center, radius, target]);

  useFrame((state, delta) => {
    const sim = simulation.current;
    if (!sim) return;
    const motionReduced = reducedMotion ?? storeReducedMotion;
    const focus = shape === "beacon" && anchors?.beacon ? new THREE.Vector3(...anchors.beacon.position) : center;
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
    uniforms.uTarget.value = target;
    uniforms.uActiveGroup.value = activeRole;

    const shapeAnchor = shape === "project-glyph" && anchors?.glyph
      ? new THREE.Vector3(...anchors.glyph.position)
      : shape === "bust" && anchors?.bust
        ? new THREE.Vector3(...anchors.bust.position)
        : focus;
    const candidates: [AnchorId, THREE.Vector3, string][] = [
      ["hero.core", center, "boot"],
      ["about.object", shape === "bust" ? shapeAnchor : new THREE.Vector3(...(anchors?.bust?.position ?? center.toArray())), "about"],
      ["projects.active", shape === "project-glyph" ? shapeAnchor : new THREE.Vector3(...(anchors?.glyph?.position ?? center.toArray())), "projects"],
      ["contact.beacon", shape === "beacon" ? focus : new THREE.Vector3(...(anchors?.beacon?.position ?? [0, 0, 0])), "contact"],
    ];
    const projected = new THREE.Vector3();
    for (const [id, point, owner] of candidates) {
      projected.copy(point).project(camera);
      screenAnchors[id].x = (projected.x * 0.5 + 0.5) * viewport.width;
      screenAnchors[id].y = (-projected.y * 0.5 + 0.5) * viewport.height;
      screenAnchors[id].visible = section === owner && projected.z >= -1 && projected.z <= 1 && Math.abs(projected.x) <= 1 && Math.abs(projected.y) <= 1;
    }
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

export default function SignalField(props: SignalFieldProps) {
  return <Suspense fallback={null}><SignalFieldCore {...props} /></Suspense>;
}
