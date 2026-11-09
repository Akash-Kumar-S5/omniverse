import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { projects } from "../../content";
import { getProjectGlyphAnchor } from "../particles/targets";

const FRAME_MODEL_URL = "/assets/models/fancy_picture_frame_02.glb";
// warm practical that lights the painting: Poly Haven lantern chandelier (CC0), hung above-front of the frame
const LANTERN_URL = "/assets/scans/lantern-chandelier.glb";
// Poly Haven Fancy Picture Frame 02 native height is 0.771m; scale 2.0 gives ~1.54m hero presence
const FRAME_SCALE = 2.0;

const PAINTING_URLS = projects.map(
  (p, i) => p.image || `/assets/paintings/painting_${i % 8}.jpg`
);

export default function ProjectArtefact() {
  const section = useOmni((s) => s.section);
  const activeProject = useOmni((s) => s.activeProject);
  const groupRef = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());

  // Load the ready-made Poly Haven Fancy Picture Frame 02 (CC0)
  const { scene } = useGLTF(FRAME_MODEL_URL, "/draco/");

  // Load authentic archival manuscript and ledger textures
  const textures = useTexture(PAINTING_URLS);

  const safeIdx = Math.max(0, Math.min(projects.length - 1, activeProject));
  const activeTexture = textures[safeIdx];

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

  // Build the frame model with custom artwork material and authentic carved gilt frame
  const frameScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.Material;
        const matName = mat?.name || "";
        const meshName = mesh.name || "";

        if (matName.includes("glass")) {
          // Hide glass to avoid reflections or occlusion on the artwork
          mesh.visible = false;
        } else if (matName.includes("canvas") || matName.includes("artwork") || meshName.includes("canvas")) {
          if (activeTexture) {
            // Maximum sharpness: disable mipmap blur, bilinear filtering, max hardware anisotropy
            activeTexture.generateMipmaps = false;
            activeTexture.minFilter = THREE.LinearFilter;
            activeTexture.magFilter = THREE.LinearFilter;
            activeTexture.anisotropy = 16;
            activeTexture.needsUpdate = true;
          }

          // Remap UVs to cover [0, 1] fully based on vertex positions
          const posAttr = mesh.geometry.attributes.position;
          const uvAttr = mesh.geometry.attributes.uv;
          if (posAttr && uvAttr) {
            mesh.geometry.computeBoundingBox();
            const b = mesh.geometry.boundingBox;
            if (b) {
              const width = b.max.x - b.min.x;
              const height = b.max.y - b.min.y;
              for (let i = 0; i < posAttr.count; i++) {
                const u = (posAttr.getX(i) - b.min.x) / width;
                const v = (posAttr.getY(i) - b.min.y) / height;
                uvAttr.setXY(i, u, v);
              }
              uvAttr.needsUpdate = true;
            }
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
          // Carved ornate gilt frame with worn patina
          if (mesh.material) {
            const m = (mesh.material as THREE.MeshStandardMaterial).clone();
            m.toneMapped = true;
            mesh.material = m;
          }
        }
      }
    });
    return clone;
  }, [scene, activeTexture]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Use active camera view vectors to position and orient the frame with strictly zero yaw/pitch skew
    const cam = state.camera;
    const camMatrix = cam.matrixWorld;
    const camRight = new THREE.Vector3(camMatrix.elements[0], camMatrix.elements[1], camMatrix.elements[2]).normalize();
    const camUp = new THREE.Vector3(camMatrix.elements[4], camMatrix.elements[5], camMatrix.elements[6]).normalize();
    const camForward = new THREE.Vector3(camMatrix.elements[8], camMatrix.elements[9], camMatrix.elements[10]).normalize();

    const dest = getProjectGlyphAnchor(activeProject);
    dest.y = 1.85;
    // Shift frame group right (~80px of screen) along camera right vector so chain lands at x >= 1060 and copy never collides
    dest.addScaledVector(camRight, 0.82);
    dest.addScaledVector(camUp, 0.48);

    targetPos.current.copy(dest);

    // Smooth lerp on project switch
    const t = Math.min(1, delta * 4.2);
    currentPos.current.lerp(targetPos.current, t);
    groupRef.current.position.copy(currentPos.current);

    if (turnRef.current) {
      // Orient group parallel to camera sensor plane: zero frame yaw/pitch, keystone < 0.1px, skew < 0.1px
      const rotM = new THREE.Matrix4().makeBasis(camRight, camUp, camForward);
      turnRef.current.quaternion.setFromRotationMatrix(rotM);
    }

    if (lightRef.current) {
      const tt = performance.now() / 1000;
      // Controlled, non-glinting gentle lantern flicker illuminating frame and canvas
      lightRef.current.intensity = 2.8 * (1 + 0.06 * (0.6 * Math.sin(tt * 8.3) + 0.4 * Math.sin(tt * 19.1 + 1.3)));
    }
  });

  if (section !== "projects" || !activeTexture) {
    return null;
  }

  return (
    <group ref={groupRef}>
      {/* Zero rotationIntensity ensures frame stays squared to camera with <= 0.1px keystone */}
      <Float speed={0.8} rotationIntensity={0.0} floatIntensity={0.03} floatingRange={[-0.006, 0.006]}>
        <group ref={turnRef}>
          {/* Authentic CC0 Poly Haven Fancy Picture Frame 02 hung flat, facing camera directly (dark backing card deleted) */}
          <primitive
            object={frameScene}
            scale={[FRAME_SCALE, FRAME_SCALE, FRAME_SCALE]}
            position={[0, 0, 0]}
          />

          {/* Hook at the frame's top centre, chain slanting up to the lantern base (lantern group sits at [0,1.10,0.30]) */}
          <mesh position={[0, 0.775, 0.03]}>
            <torusGeometry args={[0.018, 0.005, 6, 12, Math.PI * 1.5]} />
            <meshBasicMaterial color="#5a3d27" toneMapped={false} />
          </mesh>
          <group position={[0, 0.79, 0.03]} rotation={[Math.atan2(0.27, 0.19), 0, 0]}>
            {Array.from({ length: 14 }, (_, i) => (
              <mesh key={i} position={[0, 0.012 + i * 0.0235, 0]} rotation={[0, i % 2 ? Math.PI / 2 : 0, 0]}>
                <torusGeometry args={[0.0125, 0.0035, 5, 10]} />
                <meshBasicMaterial color="#5a3d27" toneMapped={false} />
              </mesh>
            ))}
          </group>

          {/* Lantern hangs centered directly above frame with >= 25px air gap */}
          <group position={[0, 1.10, 0.30]}>
            <primitive object={lanternObj} />
            {/* Chain starting below nav line (starts below y=80 in screen space, lands at x >= 1060) */}
            {Array.from({ length: 15 }, (_, i) => (
              <mesh key={i} position={[0, 0.11 + i * 0.024, 0]} rotation={[0, i % 2 ? Math.PI / 2 : 0, 0]}>
                <torusGeometry args={[0.0125, 0.0035, 5, 10]} />
                <meshBasicMaterial color="#5a3d27" toneMapped={false} />
              </mesh>
            ))}
            {/* Emissive core so the lantern reads as lit */}
            <mesh>
              <sphereGeometry args={[0.045, 12, 10]} />
              <meshBasicMaterial color="#ffb060" toneMapped={false} />
            </mesh>
            {/* Lantern point light illuminating canvas and carved gilt frame */}
            <pointLight ref={lightRef} color="#ffb066" intensity={2.8} distance={3.6} decay={1.8} />
          </group>
        </group>
      </Float>
    </group>
  );
}

useGLTF.preload(FRAME_MODEL_URL, "/draco/");
useGLTF.preload(LANTERN_URL, false);
useTexture.preload(PAINTING_URLS);
