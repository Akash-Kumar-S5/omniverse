import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { projects } from "../../content";
import { getProjectGlyphAnchor } from "../particles/targets";

const FRAME_MODEL_URL = "/assets/models/standing_picture_frame_01.glb";

const PAINTING_URLS = [
  "/assets/paintings/painting_0.jpg",
  "/assets/paintings/painting_1.jpg",
  "/assets/paintings/painting_2.jpg",
  "/assets/paintings/painting_3.jpg",
  "/assets/paintings/painting_4.jpg",
  "/assets/paintings/painting_5.jpg",
  "/assets/paintings/painting_6.jpg",
  "/assets/paintings/painting_7.jpg",
];

export default function ProjectArtefact() {
  const section = useOmni((s) => s.section);
  const activeProject = useOmni((s) => s.activeProject);
  const groupRef = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());

  // Load the ready-made Poly Haven Standing Picture Frame (CC0)
  const { scene } = useGLTF(FRAME_MODEL_URL, false);

  // Load authentic CC0 public domain masterwork paintings (Met Open Access)
  const textures = useTexture(PAINTING_URLS);

  const safeIdx = Math.max(0, Math.min(projects.length - 1, activeProject));
  const activeTexture = textures[safeIdx];
  const isEven = safeIdx % 2 === 0;

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
            roughness: 0.82,
            metalness: 0.0,
            emissive: new THREE.Color("#1e1710"),
            emissiveIntensity: 0.38,
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
  const rotY = isEven ? -Math.PI * 0.5 + 0.18 : -Math.PI * 0.5 - 0.18;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dest = getProjectGlyphAnchor(activeProject);
    // Position frame easel lower and to the side of the celestial ember glyph,
    // pulled fully inside the 1440x900 viewport without bottom or right cropping.
    dest.y = 1.78;
    if (isEven) {
      dest.x = -1.35;
      dest.z += 0.22;
    } else {
      dest.x = 2.05;
      dest.z -= 0.22;
    }
    targetPos.current.copy(dest);

    // Smooth lerp on project switch
    const t = Math.min(1, delta * 4.2);
    currentPos.current.lerp(targetPos.current, t);
    groupRef.current.position.copy(currentPos.current);
  });

  if (section !== "projects" || !activeTexture) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.04} floatIntensity={0.1} floatingRange={[-0.012, 0.012]}>
        <group rotation={[0, rotY, 0]}>
          {/* Authentic CC0 Poly Haven standing picture frame */}
          <primitive object={frameScene} scale={[4.2, 4.2, 4.2]} position={[0, -0.15, 0]} />

        </group>
      </Float>
    </group>
  );
}

useGLTF.preload(FRAME_MODEL_URL, false);
useTexture.preload(PAINTING_URLS);
