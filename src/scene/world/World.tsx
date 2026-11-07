import { useMemo } from "react";
import {
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  MeshTransmissionMaterial,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";
import { projects } from "../../content";
import { useOmni } from "../../state/store";
import { beacon, projectNodes } from "../layout";

function AgentCore() {
  const quality = useOmni((s) => s.quality);
  const positions = useMemo(() => {
    const count = 1800;
    const values = new Float32Array(count * 3);
    let seed = 91;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      const y = random() * 2 - 1;
      const angle = random() * Math.PI * 2;
      const radius = 1.25 + random() * 2.1;
      const ring = Math.sqrt(1 - y * y);
      values[i * 3] = Math.cos(angle) * ring * radius;
      values[i * 3 + 1] = y * radius * 0.72;
      values[i * 3 + 2] = Math.sin(angle) * ring * radius;
    }
    return values;
  }, []);
  return <group>
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d4c4ad" size={quality === "lite" ? 0.035 : 0.045} transparent opacity={0.52} sizeAttenuation depthWrite={false} />
    </points>
    <mesh>
      <icosahedronGeometry args={[0.92, 1]} />
      {quality === "lite" ? (
        <meshPhysicalMaterial color="#8f7255" roughness={0.14} metalness={0.32} clearcoat={0.9} />
      ) : (
        <MeshTransmissionMaterial backside samples={4} resolution={256} thickness={0.8} chromaticAberration={0.025} roughness={0.1} transmission={1} ior={1.36} color="#e8d8c2" />
      )}
    </mesh>
    <mesh scale={1.1}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#dfc7a5" wireframe transparent opacity={0.12} depthWrite={false} />
    </mesh>
  </group>;
}

function ProjectMonoliths() {
  const activeProject = useOmni((s) => s.activeProject);
  const quality = useOmni((s) => s.quality);
  const active = projectNodes[Math.max(0, Math.min(activeProject, projectNodes.length - 1))];
  return <group>
    {projectNodes.map((node, index) => {
      const kind = index % 3;
      const scale = node.size * (index === activeProject ? 1.3 : 1);
      const [x, y, z] = node.position;
      return <group key={projects[index]?.title ?? index} position={[x, y, z]} scale={scale} rotation={[0.08 * index, 0.17 * index, 0.04 * index]}>
        <mesh castShadow>
          {kind === 0 ? <boxGeometry args={[0.8, 1.5, 0.46, 1, 2, 1]} /> : kind === 1 ? <octahedronGeometry args={[0.84, 0]} /> : <coneGeometry args={[0.62, 1.75, 5, 1]} />}
          <meshPhysicalMaterial color={index % 2 ? "#665542" : "#8b7760"} roughness={0.28} metalness={0.46} clearcoat={0.76} />
        </mesh>
        <mesh position={[0, 0, 0.25]} scale={[0.12, 0.25, 0.12]}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial color="#edc99c" emissive="#c58d55" emissiveIntensity={index === activeProject ? 1.1 : 0.3} roughness={0.25} />
        </mesh>
      </group>;
    })}
    {active && <>
      <pointLight position={[active.position[0], active.position[1] + 1.3, active.position[2] + 1]} color="#edc99c" intensity={quality === "lite" ? 1.2 : 2.1} distance={7} />
      {quality === "high" && <Sparkles position={active.position} count={18} scale={[2.4, 2.4, 2.4]} size={1.5} speed={0.18} color="#dec29e" opacity={0.55} />}
    </>}
  </group>;
}

function AboutSculpture() {
  const quality = useOmni((s) => s.quality);
  const object = useMemo(() => new THREE.TorusKnotGeometry(1.28, 0.29, 160, 16, 2, 5), []);
  return <group position={[0, 0, 0]} rotation={[0.16, -0.2, 0.12]}>
    <mesh geometry={object}>
      {quality === "lite" ? <meshPhysicalMaterial color="#9c8061" roughness={0.2} metalness={0.3} clearcoat={1} /> : <MeshTransmissionMaterial backside samples={4} resolution={256} thickness={0.52} chromaticAberration={0.012} roughness={0.14} transmission={0.92} ior={1.42} color="#dfcfb8" />}
    </mesh>
    <mesh scale={1.32}>
      <torusKnotGeometry args={[1.28, 0.018, 128, 8, 2, 5]} />
      <meshStandardMaterial color="#d5bb96" metalness={0.72} roughness={0.24} />
    </mesh>
    <Sparkles count={quality === "lite" ? 0 : 22} scale={[5, 5, 5]} size={1.8} speed={0.12} color="#d8c5a9" opacity={0.42} />
  </group>;
}

function WorldLighting() {
  const quality = useOmni((s) => s.quality);
  return <>
    <ambientLight intensity={0.22} color="#d7c5ae" />
    <hemisphereLight args={["#b8a58b", "#171310", 0.42]} />
    <directionalLight position={[-7, 10, 5]} intensity={2.1} color="#f0dbc0" />
    <pointLight position={[5, 3, -5]} intensity={quality === "lite" ? 1 : 1.8} color="#c8a77e" distance={28} />
    {quality === "high" && <Environment resolution={128} background={false}>
      <Lightformer form="rect" intensity={1.5} color="#f3e5d2" position={[-4, 4, 3]} scale={[5, 2, 1]} />
      <Lightformer form="rect" intensity={1.1} color="#bf9a70" position={[4, 2, -3]} scale={[4, 3, 1]} />
      <Lightformer form="ring" intensity={0.8} color="#e3d4c0" position={[0, 6, -1]} rotation={[Math.PI / 2, 0, 0]} scale={3} />
    </Environment>}
  </>;
}

function ReflectiveFloor() {
  const quality = useOmni((s) => s.quality);
  if (quality === "lite") return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.8, 0]}>
    <planeGeometry args={[100, 100]} />
    <meshStandardMaterial color="#100e0c" roughness={0.94} metalness={0.08} />
  </mesh>;
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.8, 0]}>
    <planeGeometry args={[100, 100]} />
    <MeshReflectorMaterial color="#100e0c" roughness={0.82} metalness={0.2} blur={[256, 128]} resolution={512} mixBlur={0.84} mixStrength={0.34} mirror={0.28} depthScale={0.12} minDepthThreshold={0.2} maxDepthThreshold={1.4} />
  </mesh>;
}

function LightShafts() {
  const shafts = useMemo(() => [-5, 0, 5].map((x, i) => ({ x, z: i % 2 ? -4 : -9, rotation: (i - 1) * 0.1 })), []);
  return <group>
    {shafts.map((shaft, i) => <mesh key={i} position={[shaft.x, 1.4, shaft.z]} rotation={[0, 0, shaft.rotation]}>
      <coneGeometry args={[1.25, 13, 20, 1, true]} />
      <meshBasicMaterial color="#c8aa83" transparent opacity={0.025} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>)}
  </group>;
}

export default function World() {
  const quality = useOmni((s) => s.quality);
  const section = useOmni((s) => s.section);
  return <>
    <WorldLighting />
    <fog attach="fog" args={["#0b0a09", 24, 78]} />
    <ReflectiveFloor />
    <LightShafts />
    <group visible={section === "boot"}><AgentCore /></group>
    <group visible={section === "about"}><AboutSculpture /></group>
    <group visible={section === "projects"}><ProjectMonoliths /></group>
    <mesh position={beacon} visible={section === "contact"}>
      <icosahedronGeometry args={[0.55, 1]} />
      <meshStandardMaterial color="#e7d3b5" emissive="#9a7047" emissiveIntensity={0.42} metalness={0.46} roughness={0.22} />
    </mesh>
  </>;
}
