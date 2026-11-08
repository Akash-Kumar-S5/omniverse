import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { projects } from "../../content";
import { getProjectGlyphAnchor } from "../particles/targets";

const FRAME_MODEL_URL = "/assets/models/standing_picture_frame_01.glb";
// warm practical that lights the painting: Poly Haven lantern chandelier (CC0), hung above-front of the frame
const LANTERN_URL = "/assets/scans/lantern-chandelier.glb";
const FRAME_SCALE = 6;

const PAINTING_URLS = projects.map(
  (p, i) => p.image || `/assets/paintings/painting_${i % 8}.jpg`
);

export default function ProjectArtefact() {
  const section = useOmni((s) => s.section);
  const activeProject = useOmni((s) => s.activeProject);
  const groupRef = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());
  const lanternDirection = useRef(new THREE.Vector3());

  // Load the ready-made Poly Haven Standing Picture Frame (CC0)
  const { scene } = useGLTF(FRAME_MODEL_URL, false);

  // Load authentic CC0 public domain masterwork paintings (Met Open Access)
  const textures = useTexture(PAINTING_URLS);

  const safeIdx = Math.max(0, Math.min(projects.length - 1, activeProject));
  const activeTexture = textures[safeIdx];
  const isEven = safeIdx % 2 === 0;

  const lantern = useGLTF(LANTERN_URL, false).scene;
  const lanternObj = useMemo(() => {
    const c = lantern.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && m.material) {
        const mat = (m.material as THREE.MeshStandardMaterial).clone();
        mat.emissive = new THREE.Color("#ff9a4a");
        mat.emissiveMap = mat.map;
        mat.emissiveIntensity = 0.5;
        m.material = mat;
      }
    });
    const box = new THREE.Box3().setFromObject(c);
    const size = box.getSize(new THREE.Vector3());
    const k = 0.36 / size.y;
    const ctr = box.getCenter(new THREE.Vector3());
    const holder = new THREE.Group();
    c.position.set(-ctr.x, -ctr.y, -ctr.z);
    holder.add(c);
    holder.scale.setScalar(k);
    return holder;
  }, [lantern]);
  const lightRef = useRef<THREE.PointLight>(null);
  const turnRef = useRef<THREE.Group>(null);
  const lanternRef = useRef<THREE.Group>(null);

  // Build the frame model with custom artwork material and hide occluding glass
  const frameScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.Material;
        const matName = mat?.name || "";

        if (matName.includes("glass")) {
          // Hide glass to avoid reflections or occlusion on the artwork
          mesh.visible = false;
        } else if (matName.includes("artwork")) {
          mesh.material = new THREE.MeshStandardMaterial({
            map: activeTexture,
            color: new THREE.Color("#ffd2a0"),
            roughness: 0.82,
            metalness: 0.0,
            emissive: new THREE.Color("#ffb878"),
            emissiveMap: activeTexture,
            emissiveIntensity: 0.55,
            toneMapped: true,
          });
        } else {
          // Wooden frame and easel stand
          if (mesh.material) {
            const m = (mesh.material as THREE.Material).clone();
            m.toneMapped = true;
            mesh.material = m;
          }
        }
      }
    });
    return clone;
  }, [scene, activeTexture]);

  // Orient towards the camera: model artwork faces +X locally,
  // rotating -PI/2 in Y makes it face +Z, then adjust angle toward aisle
  const rotY = isEven ? -Math.PI * 0.5 + 0.18 : -Math.PI * 0.5 - 0.18;   // initial; useFrame squares it up to the camera

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const dest = getProjectGlyphAnchor(activeProject);
    // The painting is the hero: large, right-centre, where the glyph swarm hangs
    dest.y = 1.95;
    // slide right on screen (clear of the copy column): the chapter camera's right-hand direction in glTF xz
    if (isEven) {
      dest.x += 0.9;
      dest.z += 0.8;
    } else {
      dest.x += 0.9;
      dest.z += 1.3 + 0.9;
    }
    targetPos.current.copy(dest);

    // Smooth lerp on project switch
    const t = Math.min(1, delta * 4.2);
    currentPos.current.lerp(targetPos.current, t);
    groupRef.current.position.copy(currentPos.current);
    if (turnRef.current) {
      // the painting squares up to the camera so it reads as a flat hero picture
      const cam = state.camera.position;
      turnRef.current.rotation.y = Math.atan2(cam.x - currentPos.current.x, cam.z - currentPos.current.z) - Math.PI / 2;
    }
    if (lanternRef.current) {
      const direction = lanternDirection.current.copy(state.camera.position).sub(currentPos.current);
      direction.y = 0;
      direction.normalize().multiplyScalar(0.7);
      lanternRef.current.position.set(0.4 + direction.x, 1.17, direction.z);
    }
    if (lightRef.current) {
      const tt = performance.now() / 1000;
      lightRef.current.intensity = 6 * (1 + 0.12 * (0.6 * Math.sin(tt * 8.3) + 0.4 * Math.sin(tt * 19.1 + 1.3)));
    }
  });

  if (section !== "projects" || !activeTexture) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.04} floatIntensity={0.1} floatingRange={[-0.012, 0.012]}>
        <group ref={turnRef} rotation={[0, rotY, 0]}>
          {/* Authentic CC0 Poly Haven standing picture frame */}
          <primitive object={frameScene} scale={[FRAME_SCALE, FRAME_SCALE, FRAME_SCALE]} position={[0, -0.15, 0]} />

        </group>
      </Float>
      <group ref={lanternRef} position={[0.4, 1.17, 0]}>
        <primitive object={lanternObj} />
        <pointLight ref={lightRef} color="#ffb066" intensity={6} distance={3} decay={2} />
      </group>
    </group>
  );
}

useGLTF.preload(FRAME_MODEL_URL, false);
useGLTF.preload(LANTERN_URL, false);
useTexture.preload(PAINTING_URLS);
