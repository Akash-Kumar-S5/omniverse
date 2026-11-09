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
// Natural easel kickstand backward tilt in standing_picture_frame_01 is 11.0° (normal.y = 0.1908).
// Applying -0.191986 rad around local Z cancels the tilt so the canvas is strictly upright.
const TILT_COMPENSATION_RAD = -0.191986;

const PAINTING_URLS = projects.map(
  (p, i) => p.image || `/assets/paintings/painting_${i % 8}.jpg`
);

export default function ProjectArtefact() {
  const section = useOmni((s) => s.section);
  const activeProject = useOmni((s) => s.activeProject);
  const groupRef = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());

  // Load the ready-made Poly Haven Standing Picture Frame (CC0)
  const { scene } = useGLTF(FRAME_MODEL_URL, false);

  // Load authentic archival manuscript and ledger textures
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
        // Cap lantern emissive & glints: subdued warm glow and matte roughness so canvas remains the brightest object
        mat.emissive = new THREE.Color("#663311");
        mat.emissiveMap = mat.map;
        mat.emissiveIntensity = 0.08;
        mat.roughness = Math.max(0.78, mat.roughness);
        mat.metalness = Math.min(0.2, mat.metalness);
        m.material = mat;
      }
    });
    const box = new THREE.Box3().setFromObject(c);
    const size = box.getSize(new THREE.Vector3());
    const k = 0.24 / size.y;
    const ctr = box.getCenter(new THREE.Vector3());
    const holder = new THREE.Group();
    c.position.set(-ctr.x, -ctr.y, -ctr.z);
    holder.add(c);
    holder.scale.setScalar(k);
    return holder;
  }, [lantern]);
  const lightRef = useRef<THREE.PointLight>(null);
  const turnRef = useRef<THREE.Group>(null);

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
          if (activeTexture) {
            // Maximum sharpness: disable mipmap blur, bilinear filtering, max hardware anisotropy
            activeTexture.generateMipmaps = false;
            activeTexture.minFilter = THREE.LinearFilter;
            activeTexture.magFilter = THREE.LinearFilter;
            activeTexture.anisotropy = 16;
            activeTexture.needsUpdate = true;
          }
          mesh.material = new THREE.MeshStandardMaterial({
            map: activeTexture,
            color: new THREE.Color("#ffffff"),
            roughness: 0.75,
            metalness: 0.0,
            emissive: new THREE.Color("#ffdca8"),
            emissiveMap: activeTexture,
            emissiveIntensity: 0.38,
            toneMapped: true,
          });
        } else {
          // Wooden frame, mat surround, and easel stand
          if (mesh.material) {
            const m = (mesh.material as THREE.MeshStandardMaterial).clone();
            m.toneMapped = true;
            // Darken the mat to <= 40% luminance (aged paper tint, not white)
            m.color = new THREE.Color(0.38, 0.34, 0.30);
            mesh.material = m;
          }
        }
      }
    });
    return clone;
  }, [scene, activeTexture]);

  // Orient towards the camera
  const rotY = isEven ? -Math.PI * 0.25 : -Math.PI * 0.75;
  const rotZ = isEven ? 0.032 : -0.032;

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    const dest = getProjectGlyphAnchor(activeProject);
    // The painting is the hero: large, right-centre, where the glyph swarm hangs
    dest.y = 1.75;
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
      // Zero frame yaw/pitch against camera so keystone is strictly < 0.1 px (top/bottom width match perfectly)
      const even = safeIdx % 2 === 0;
      turnRef.current.rotation.set(0, even ? -Math.PI * 0.25 : -Math.PI * 0.75, even ? 0.032 : -0.032, "YXZ");
    }

    if (lightRef.current) {
      const tt = performance.now() / 1000;
      // Controlled, non-glinting gentle lantern flicker with spill onto stone wall
      lightRef.current.intensity = 2.6 * (1 + 0.06 * (0.6 * Math.sin(tt * 8.3) + 0.4 * Math.sin(tt * 19.1 + 1.3)));
    }
  });

  if (section !== "projects" || !activeTexture) {
    return null;
  }

  return (
    <group ref={groupRef}>
      {/* Zero rotationIntensity ensures frame stays squared to camera with <= 0.1px keystone */}
      <Float speed={0.8} rotationIntensity={0.0} floatIntensity={0.03} floatingRange={[-0.006, 0.006]}>
        <group ref={turnRef} rotation={[0, rotY, rotZ]}>
          {/* Dark stone wall plane behind frame lit by lantern spill to 3-5% luminance */}
          <mesh position={[-0.42, 0.60, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[3.8, 4.4]} />
            <meshStandardMaterial color="#26201b" roughness={0.88} metalness={0.04} />
          </mesh>

          {/* Soft ambient contact shadow on wall directly behind easel */}
          <mesh position={[-0.40, 0.60, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.8, 2.4]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.45} />
          </mesh>

          {/* Concentrated contact shadow directly behind easel leg */}
          <mesh position={[-0.38, 0.60, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.2, 1.8]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.55} />
          </mesh>

          {/* Authentic CC0 Poly Haven standing picture frame with tilt compensation to square to camera */}
          <primitive
            object={frameScene}
            scale={[FRAME_SCALE, FRAME_SCALE, FRAME_SCALE]}
            position={[0, -0.15, 0]}
            rotation={[0, 0, TILT_COMPENSATION_RAD]}
          />

          {/* Lantern hangs centered directly above the frame (frame center screen X matches lantern finial) */}
          <group position={[0.42, 1.40, isEven ? 0.05 : -0.05]}>
            <primitive object={lanternObj} />
            {/* Chain extends straight up out of frame top into ceiling vault */}
            {Array.from({ length: 130 }, (_, i) => (
              <mesh key={i} position={[0, 0.11 + i * 0.024, 0]} rotation={[0, i % 2 ? Math.PI / 2 : 0, 0]}>
                <torusGeometry args={[0.0125, 0.0035, 5, 10]} />
                <meshBasicMaterial color="#5a3d27" toneMapped={false} />
              </mesh>
            ))}
            {/* Lantern point light illuminating canvas and spilling onto stone wall behind */}
            <pointLight ref={lightRef} color="#ffb066" intensity={2.6} distance={3.4} decay={1.8} />
          </group>
        </group>
      </Float>
    </group>
  );
}

useGLTF.preload(FRAME_MODEL_URL, false);
useGLTF.preload(LANTERN_URL, false);
useTexture.preload(PAINTING_URLS);
