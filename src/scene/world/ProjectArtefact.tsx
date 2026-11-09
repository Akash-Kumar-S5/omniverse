import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { projects } from "../../content";
import { getProjectGlyphAnchor } from "../particles/targets";
import { stageFor } from "./projectStaging";

const FRAME_MODEL_URL = "/assets/models/fancy_picture_frame_02.glb";
// warm practical that lights the painting: Poly Haven lantern chandelier (CC0), hung above-front of the frame
const LANTERN_URL = "/assets/scans/lantern-chandelier.glb";
// Poly Haven Fancy Picture Frame 02 native height is 0.771m; scale 2.0 gives ~1.54m hero presence
const FRAME_SCALE = 2.0;

const PAINTING_URLS = projects.map(
  (p, i) => p.image || `/assets/paintings/painting_${i % 8}.webp`
);

/**
 * r37: uploads all eight project screens to the GPU ahead of time (same filters the artefact applies), so stepping to the next project
 * swaps a texture that is already resident instead of decoding and uploading it mid-step (the 14 fps hitch).
 */
export function PaintingWarm() {
  const gl = useThree((s) => s.gl);
  const textures = useTexture(PAINTING_URLS);
  useEffect(() => {
    textures.forEach((t, i) => {
      t.generateMipmaps = false;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.anisotropy = 16;
      // initialise one per 150 ms so the uploads never land in the same frame
      window.setTimeout(() => gl.initTexture(t), i * 150);
    });
  }, [gl, textures]);
  return null;
}

/** a lantern on its chain with an emissive core and two warm lights; colour and strength come from the project's stage */
function LanternRig({ lantern, position, chain = 15, color, k, lightRef }: {
  lantern: THREE.Object3D;
  position: [number, number, number];
  chain?: number;
  color: string;
  k: number;
  lightRef: React.RefObject<THREE.PointLight | null>;
}) {
  return (
    <group position={position}>
      <primitive object={lantern} />
      {Array.from({ length: chain }, (_, i) => (
        <mesh key={i} position={[0, 0.11 + i * 0.024, 0]} rotation={[0, i % 2 ? Math.PI / 2 : 0, 0]}>
          <torusGeometry args={[0.0125, 0.0035, 5, 10]} />
          <meshBasicMaterial color="#5a3d27" toneMapped={false} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.065, 12, 10]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <pointLight color={color} intensity={2 * k} distance={1} decay={2} position={[0, -0.12, 0.1]} />
      <pointLight ref={lightRef} color={color} intensity={2.8 * k} distance={3.6} decay={1.8} />
    </group>
  );
}

export default function ProjectArtefact() {
  const section = useOmni((s) => s.section);
  const activeProject = useOmni((s) => s.activeProject);
  const groupRef = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());

  // Load the ready-made Poly Haven Fancy Picture Frame 02 (CC0)
  const { scene } = useGLTF(FRAME_MODEL_URL, "/draco/");

  // r32: only the active painting blocks the first paint; the rest stream in right after, so later swaps hit the cache
  const stage = stageFor(activeProject);
  const safeIdx = Math.max(0, Math.min(projects.length - 1, activeProject));
  const activeTexture = useTexture(PAINTING_URLS[safeIdx]);
  useEffect(() => {
    const id = window.setTimeout(() => PAINTING_URLS.forEach((u) => useTexture.preload(u)), 2500);
    return () => window.clearTimeout(id);
  }, []);

  // r30: the frame floated in a black void. A feathered stone wall behind it (the CC0 stone block texture already in the repo, very dark and
  // lit only by the lantern light) plus a soft offset shadow gives it something to hang on.
  const stoneSrc = useTexture("/assets/ruins/textures/stone_block_512.jpg");
  const wall = useMemo(() => {
    const stone = stoneSrc.clone();
    stone.colorSpace = THREE.SRGBColorSpace;
    stone.wrapS = stone.wrapT = THREE.RepeatWrapping;
    stone.repeat.set(1.6, 2);
    stone.needsUpdate = true;
    const mk = (draw: (g: CanvasRenderingContext2D) => void) => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const g = c.getContext("2d");
      if (g) draw(g);
      return new THREE.CanvasTexture(c);
    };
    // alpha map: opaque centre, fully transparent well before the quad edge, so the wall dissolves into the dark
    const feather = mk((g) => {
      const r = g.createRadialGradient(64, 64, 6, 64, 64, 62);
      r.addColorStop(0, "#ffffff");
      r.addColorStop(0.55, "#9a9a9a");
      r.addColorStop(1, "#000000");
      g.fillStyle = r;
      g.fillRect(0, 0, 128, 128);
    });
    const shade = mk((g) => {
      const r = g.createRadialGradient(64, 64, 10, 64, 64, 62);
      r.addColorStop(0, "rgba(0,0,0,0.85)");
      r.addColorStop(0.6, "rgba(0,0,0,0.45)");
      r.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = r;
      g.fillRect(0, 0, 128, 128);
    });
    return { stone, feather, shade };
  }, [stoneSrc]);


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
    const k = 0.36 / size.y; // r27: 1.5x so it stops reading as a jewel
    const ctr = box.getCenter(new THREE.Vector3());
    const holder = new THREE.Group();
    c.position.set(-ctr.x, -ctr.y, -ctr.z);
    holder.add(c);
    holder.scale.setScalar(k);
    return holder;
  }, [lantern]);
  const bandFog = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 64; c.height = 4;
    const g = c.getContext("2d");
    if (g) {
      const gr = g.createLinearGradient(0, 0, 64, 0);
      gr.addColorStop(0, "rgba(5,4,3,0)");
      gr.addColorStop(0.5, "rgba(5,4,3,0.95)");
      gr.addColorStop(1, "rgba(5,4,3,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 64, 4);
    }
    return new THREE.CanvasTexture(c);
  }, []);
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
            // r37: configure and upload once; flagging an already uploaded texture again re-uploads it (the swap hitch)
            const firstUse = activeTexture.generateMipmaps;
            activeTexture.generateMipmaps = false;
            activeTexture.minFilter = THREE.LinearFilter;
            activeTexture.magFilter = THREE.LinearFilter;
            activeTexture.anisotropy = 16;
            if (firstUse) activeTexture.needsUpdate = true;
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

          // r34: a per-project crop of the artwork (zoom window), so each frame shows a different part of its own painting
          const win = 1 / stage.zoom;
          activeTexture.repeat.set(win, win);
          activeTexture.offset.set(stage.cropX * (1 - win), stage.cropY * (1 - win));
          activeTexture.needsUpdate = true;
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
  }, [scene, activeTexture, stage]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Use active camera view vectors to position and orient the frame with strictly zero yaw/pitch skew
    const cam = state.camera;
    const camMatrix = cam.matrixWorld;
    const camRight = new THREE.Vector3(camMatrix.elements[0], camMatrix.elements[1], camMatrix.elements[2]).normalize();
    const camUp = new THREE.Vector3(camMatrix.elements[4], camMatrix.elements[5], camMatrix.elements[6]).normalize();
    const camForward = new THREE.Vector3(camMatrix.elements[8], camMatrix.elements[9], camMatrix.elements[10]).normalize();

    // r32: the camera moves to each project's own slab, so the frame must follow that project's anchor (a fixed anchor left projects 2-8 empty)
    const dest = getProjectGlyphAnchor(activeProject);
    dest.y = 1.85;
    // Shift frame group right (~80px of screen) along camera right vector so chain lands at x >= 1060 and copy never collides
    dest.addScaledVector(camRight, 0.82 + stage.dx);
    dest.addScaledVector(camUp, 0.48 + stage.dy);

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
      lightRef.current.intensity = 2.8 * stage.lightK * (1 + 0.06 * (0.6 * Math.sin(tt * 8.3) + 0.4 * Math.sin(tt * 19.1 + 1.3)));
    }
  });

  if (!activeTexture) {
    return null;
  }

  // r39: also visible during Work, so the frame (and its lights) is already in the scene when the camera flies to Projects:
  // no mount, no light-count change and no empty right half at the chapter switch
  return (
    <group ref={groupRef} visible={section === "projects" || section === "experience"}>
      {/* Zero rotationIntensity ensures frame stays squared to camera with <= 0.1px keystone */}
      <Float speed={0.8} rotationIntensity={0.0} floatIntensity={0.03} floatingRange={[-0.006, 0.006]}>
        <group ref={turnRef}>
          {/* r27: dark feathered card between the frame and the back wall; hides the hard vertical wall band at the left */}
          <mesh position={[-1.55, -0.2, 0.4]}>
            <planeGeometry args={[1.5, 6]} />
            <meshBasicMaterial map={bandFog} transparent depthWrite={false} toneMapped={false} />
          </mesh>

          {/* r34: the staged group: this project's own scale, roll, yaw and pitch */}
          <group rotation={[stage.pitch, stage.yaw, stage.roll]} scale={stage.scale}>
            {/* Authentic CC0 Poly Haven Fancy Picture Frame 02 */}
            <primitive object={frameScene} scale={[FRAME_SCALE, FRAME_SCALE, FRAME_SCALE]} position={[0, 0, 0]} />

            {/* r30: feathered stone wall behind the frame, and a soft shadow thrown down-right onto it (r34: tint and size per project) */}
            <mesh position={[0, -0.02, -0.2]} scale={stage.wallScale}>
              <planeGeometry args={[3.4, 3.8]} />
              <meshStandardMaterial map={wall.stone} alphaMap={wall.feather} transparent depthWrite={false} color={stage.wall} roughness={1} metalness={0} />
            </mesh>
            <mesh position={[0.1, -0.1, -0.18]}>
              <planeGeometry args={[2.1, 2.45]} />
              <meshBasicMaterial map={wall.shade} transparent depthWrite={false} toneMapped={false} />
            </mesh>

            {stage.fixture === "hang" && (
              <>
                {/* r37: the lantern hangs on its own chain out of the dark (no second chain slanting down to the frame hook) */}
                <LanternRig lantern={lanternObj} position={[0, 1.1, 0.3]} chain={52} color={stage.light} k={stage.lightK} lightRef={lightRef} />
              </>
            )}

            {stage.fixture === "side" && (
              <>
                {/* a short iron arm out of the wall; the lantern hangs from its end beside the frame */}
                <mesh position={[stage.side * 1.0, 1.0, 0.04]}>
                  <boxGeometry args={[0.5, 0.035, 0.05]} />
                  <meshStandardMaterial color="#1c1814" roughness={0.8} metalness={0.4} />
                </mesh>
                <LanternRig lantern={lanternObj} position={[stage.side * 1.18, 0.62, 0.25]} chain={11} color={stage.light} k={stage.lightK} lightRef={lightRef} />
              </>
            )}

            {stage.fixture === "candles" && (
              <>
                {/* a stone ledge under the frame with three candles; the light comes from below */}
                <mesh position={[0, -0.84, 0.16]}>
                  <boxGeometry args={[1.5, 0.07, 0.42]} />
                  <meshStandardMaterial map={wall.stone} color="#4a443c" roughness={0.95} />
                </mesh>
                {[-0.32, 0.05, 0.36].map((cx, i) => (
                  <group key={i} position={[cx * (stage.side === 1 ? 1 : -1), -0.805, 0.18]}>
                    <mesh position={[0, 0.07 + (i % 2) * 0.03, 0]}>
                      <cylinderGeometry args={[0.02, 0.024, 0.14 + (i % 2) * 0.06, 14]} />
                      <meshStandardMaterial color="#cdb98c" roughness={0.92} />
                    </mesh>
                    <mesh position={[0, 0.17 + (i % 2) * 0.06, 0]} scale={[1, 1.9, 1]}>
                      <sphereGeometry args={[0.011, 10, 8]} />
                      <meshBasicMaterial color="#ffd9a0" toneMapped={false} />
                    </mesh>
                  </group>
                ))}
                <pointLight ref={lightRef} color={stage.light} intensity={2.6 * stage.lightK} distance={3.2} decay={1.8} position={[0, -0.55, 0.45]} />
              </>
            )}

            {stage.fixture === "sconce" && (
              <>
                {/* a wall sconce beside the frame: iron arm, a small cup and a steady flame */}
                <mesh position={[stage.side * 1.12, 0.35, 0.05]}>
                  <boxGeometry args={[0.04, 0.5, 0.04]} />
                  <meshStandardMaterial color="#1c1814" roughness={0.8} metalness={0.4} />
                </mesh>
                <mesh position={[stage.side * 1.12, 0.62, 0.11]}>
                  <cylinderGeometry args={[0.07, 0.04, 0.07, 14]} />
                  <meshStandardMaterial color="#2a241d" roughness={0.7} metalness={0.5} />
                </mesh>
                <mesh position={[stage.side * 1.12, 0.72, 0.11]}>
                  <sphereGeometry args={[0.028, 10, 8]} />
                  <meshBasicMaterial color="#ffc890" toneMapped={false} />
                </mesh>
                <pointLight ref={lightRef} color={stage.light} intensity={2.8 * stage.lightK} distance={3.6} decay={1.8} position={[stage.side * 1.0, 0.7, 0.35]} />
              </>
            )}
          </group>
        </group>
      </Float>
    </group>
  );
}

// r34: warm the chapter's assets shortly after first paint, so scrolling into the projects never meets an empty stage
window.setTimeout(() => {
  useGLTF.preload(FRAME_MODEL_URL, "/draco/");
  useGLTF.preload(LANTERN_URL, false);
  useTexture.preload("/assets/ruins/textures/stone_block_512.jpg");
}, 1500);
