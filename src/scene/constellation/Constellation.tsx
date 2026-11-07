import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { beacon, projectEdges, projectNodes, techNodes } from "../layout";
import { useOmni } from "../../state/store";

const nodeVertex = `attribute vec3 instanceColor; varying vec3 vColor; varying vec3 vNormal; varying vec3 vView; void main(){ vColor=instanceColor; vNormal=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*instanceMatrix*vec4(position,1.0); vView=-mv.xyz; gl_Position=projectionMatrix*mv; }`;
const nodeFragment = `uniform vec3 coreColor; uniform float rimPower; varying vec3 vColor; varying vec3 vNormal; varying vec3 vView; void main(){ float rim=pow(1.0-max(dot(normalize(vNormal),normalize(vView)),0.0),rimPower); vec3 c=mix(coreColor*vColor,vec3(0.42,0.82,1.0),rim*0.88); gl_FragColor=vec4(c*(0.8+rim*2.4),1.0); }`;

const edgeVertex = `attribute float lineDistance; varying float vDistance; void main(){ vDistance=lineDistance; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
const edgeFragment = `uniform float uTime; uniform float uSpeed; uniform float uOpacity; varying float vDistance; void main(){ float flow=pow(max(0.0,sin((vDistance*0.48-uTime*uSpeed)*6.28318)),10.0); float halo=0.2+0.35*(0.5+0.5*sin(vDistance*2.2-uTime*uSpeed*2.0)); gl_FragColor=vec4(vec3(0.08,0.48,0.8)*(halo+flow*2.2),uOpacity*(halo+flow)); }`;
const particleVertex = `attribute vec3 start; attribute vec3 control; attribute vec3 end; attribute float phase; uniform float uTime; uniform float uSpeed; uniform float uPointSize; void main(){ float t=fract(phase+uTime*uSpeed); vec3 p=mix(mix(start,control,t),mix(control,end,t),t); vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv; gl_PointSize=uPointSize*(1.0+2.0/max(1.0,-mv.z)); }`;
const particleFragment = `void main(){ vec2 p=gl_PointCoord-0.5; float a=1.0-smoothstep(0.12,0.5,length(p)); gl_FragColor=vec4(0.35,0.82,1.0,a); }`;

export default function Constellation() {
  const root = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const rims = useRef<THREE.InstancedMesh>(null);
  const satellites = useRef<THREE.InstancedMesh>(null);
  const edgeMaterials = useRef<THREE.ShaderMaterial[]>([]);
  const particleMaterial = useRef<THREE.ShaderMaterial>(null);
  const beaconCore = useRef<THREE.Mesh>(null);
  const beaconHalo = useRef<THREE.Mesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const igniteElapsed = useRef(0);
  const nodeMats = useMemo(() => ({ coreColor: { value: new THREE.Color("#153a55") }, rimPower: { value: 2.0 } }), []);

  const edgeData = useMemo(() => projectEdges.map(([a, b]) => {
    const start = new THREE.Vector3(...projectNodes[a].position);
    const end = new THREE.Vector3(...projectNodes[b].position);
    const control = start.clone().add(end).multiplyScalar(0.5);
    control.y += 2.7;
    const curve = new THREE.QuadraticBezierCurve3(start, control, end);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
    const distances = new Float32Array(65);
    for (let i = 0; i < 65; i++) distances[i] = i / 64 * curve.getLength();
    geometry.setAttribute("lineDistance", new THREE.BufferAttribute(distances, 1));
    return { geometry, start: start.toArray(), control: control.toArray(), end: end.toArray() };
  }), []);

  const particleGeometry = useMemo(() => {
    const count = 144;
    const starts = new Float32Array(count * 3), controls = new Float32Array(count * 3), ends = new Float32Array(count * 3), phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const edge = edgeData[i % edgeData.length];
      starts.set(edge.start, i * 3); controls.set(edge.control, i * 3); ends.set(edge.end, i * 3);
      phases[i] = (i / count * 13.7) % 1;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("start", new THREE.BufferAttribute(starts, 3));
    geometry.setAttribute("control", new THREE.BufferAttribute(controls, 3));
    geometry.setAttribute("end", new THREE.BufferAttribute(ends, 3));
    geometry.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
    return geometry;
  }, [edgeData]);

  useFrame((state, delta) => {
    const s = useOmni.getState();
    const t = state.clock.elapsedTime;
    if (s.reducedMotion) igniteElapsed.current = 1.8;
    else if (s.booted && igniteElapsed.current < 1.8) igniteElapsed.current = Math.min(1.8, igniteElapsed.current + delta);
    const ignite = Math.min(1, igniteElapsed.current / 1.8);
    const contact = s.section === "contact" ? 0.22 + 0.78 * (1 - s.sectionProgress) : 1;
    if (root.current) root.current.scale.setScalar(ignite * contact);
    for (let i = 0; i < edgeMaterials.current.length; i++) {
      const material = edgeMaterials.current[i];
      material.uniforms.uTime.value = s.reducedMotion ? 0 : t;
      material.uniforms.uSpeed.value = s.reducedMotion ? 0.012 : 0.12;
      material.uniforms.uOpacity.value = s.quality === "lite" ? 0.22 : 0.42;
    }
    if (particleMaterial.current) {
      particleMaterial.current.uniforms.uTime.value = s.reducedMotion ? 0 : t;
      particleMaterial.current.uniforms.uSpeed.value = s.reducedMotion ? 0.008 : 0.075;
      particleMaterial.current.uniforms.uPointSize.value = s.quality === "lite" ? 0 : 3.0;
    }
    if (nodes.current && rims.current) {
      const active = s.activeProject;
      for (let i = 0; i < projectNodes.length; i++) {
        const pulse = i === active && !s.reducedMotion ? 1 + 0.075 * Math.sin(t * 2.3) : 1;
        dummy.position.set(...projectNodes[i].position); dummy.scale.setScalar(projectNodes[i].size * pulse); dummy.updateMatrix(); nodes.current.setMatrixAt(i, dummy.matrix);
        dummy.scale.setScalar(projectNodes[i].size * 1.17 * pulse); dummy.updateMatrix(); rims.current.setMatrixAt(i, dummy.matrix);
        const brightness = i === active ? 1.65 : 1;
        color.setRGB(brightness, brightness, brightness);
        nodes.current.setColorAt(i, color);
      }
      nodes.current.instanceMatrix.needsUpdate = true; rims.current.instanceMatrix.needsUpdate = true;
      if (nodes.current.instanceColor) nodes.current.instanceColor.needsUpdate = true;
    }
    if (satellites.current) {
      for (let i = 0; i < techNodes.length; i++) {
        const base = techNodes[i].position;
        const spin = s.reducedMotion ? 0 : t * 0.08 + i * 2.1;
        dummy.position.set(base[0] + Math.cos(spin) * 0.24, base[1] + Math.sin(spin * 1.3) * 0.18, base[2] + Math.sin(spin) * 0.24);
        dummy.scale.setScalar(s.quality === "lite" ? 0.065 : 0.075); dummy.updateMatrix(); satellites.current.setMatrixAt(i, dummy.matrix);
      }
      satellites.current.instanceMatrix.needsUpdate = true;
    }
    const beaconScale = s.section === "contact" ? 0.55 + s.sectionProgress * 1.5 : 0.05;
    if (beaconCore.current) beaconCore.current.scale.setScalar(beaconScale);
    if (beaconHalo.current) { beaconHalo.current.scale.setScalar(beaconScale * 1.75); (beaconHalo.current.material as THREE.MeshBasicMaterial).opacity = s.section === "contact" ? 0.2 : 0; }
  });

  return <group ref={root}>
    <instancedMesh ref={nodes} args={[undefined, undefined, projectNodes.length]}>
      <icosahedronGeometry args={[1, 2]} />
      <shaderMaterial vertexShader={nodeVertex} fragmentShader={nodeFragment} uniforms={nodeMats} />
    </instancedMesh>
    <instancedMesh ref={rims} args={[undefined, undefined, projectNodes.length]}>
      <icosahedronGeometry args={[1, 2]} />
      <meshBasicMaterial color="#4bc8ff" wireframe transparent opacity={0.42} blending={THREE.AdditiveBlending} depthWrite={false} />
    </instancedMesh>
    <instancedMesh ref={satellites} args={[undefined, undefined, techNodes.length]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#a8dfff" />
    </instancedMesh>
    {edgeData.map((edge, i) => <mesh key={i} geometry={edge.geometry}>
      <shaderMaterial ref={(m) => { if (m) edgeMaterials.current[i] = m; }} vertexShader={edgeVertex} fragmentShader={edgeFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} uniforms={{ uTime: { value: 0 }, uSpeed: { value: 0.12 }, uOpacity: { value: 0.4 } }} />
    </mesh>)}
    <points geometry={particleGeometry}>
      <shaderMaterial ref={particleMaterial} vertexShader={particleVertex} fragmentShader={particleFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} uniforms={{ uTime: { value: 0 }, uSpeed: { value: 0.075 }, uPointSize: { value: 3 } }} />
    </points>
    <mesh ref={beaconCore} position={beacon}>
      <sphereGeometry args={[0.38, 24, 24]} />
      <meshBasicMaterial color="#c6f6ff" />
    </mesh>
    <mesh ref={beaconHalo} position={beacon}>
      <sphereGeometry args={[0.62, 20, 20]} />
      <meshBasicMaterial color="#38bfff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
    <ambientLight intensity={0.5} />
    <pointLight position={[0, 5, 0]} color="#45bfff" intensity={16} distance={32} />
  </group>;
}
