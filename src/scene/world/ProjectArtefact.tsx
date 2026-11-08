import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { projects, type Project } from "../../content";
import { getProjectGlyphAnchor } from "../particles/targets";

const FRAME_MODEL_URL = "/assets/models/standing_picture_frame_01.glb";

/**
 * Generates a muted, desaturated project screenshot texture without text.
 * Strictly adheres to art direction: muted charcoal, ash, and stone tones,
 * stylized UI wireframe / architectural blueprint composition.
 * Zero duplicate text, zero neon/slop.
 */
function buildDesaturatedScreenshot(project: Project, index: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Weathered dark slate background
  ctx.fillStyle = "#181513";
  ctx.fillRect(0, 0, 720, 1024);

  // Paper / parchment grain
  ctx.fillStyle = "rgba(230, 215, 195, 0.025)";
  for (let i = 0; i < 4000; i++) {
    const rx = Math.random() * 720;
    const ry = Math.random() * 1024;
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  // Soft atmospheric vignette
  const vignette = ctx.createRadialGradient(360, 512, 160, 360, 512, 540);
  vignette.addColorStop(0, "rgba(42, 36, 30, 0.25)");
  vignette.addColorStop(1, "rgba(10, 8, 7, 0.92)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, 720, 1024);

  // Window chrome header (abstract browser / dashboard frame)
  ctx.fillStyle = "#221e1a";
  ctx.fillRect(36, 44, 648, 48);

  // 3 window status dots
  ctx.fillStyle = "rgba(180, 160, 140, 0.5)";
  ctx.beginPath();
  ctx.arc(66, 68, 6, 0, Math.PI * 2);
  ctx.arc(86, 68, 6, 0, Math.PI * 2);
  ctx.arc(106, 68, 6, 0, Math.PI * 2);
  ctx.fill();

  // Search / address bar placeholder
  ctx.fillStyle = "rgba(255, 240, 220, 0.08)";
  ctx.fillRect(136, 56, 380, 24);

  // Main UI viewport border
  ctx.strokeStyle = "rgba(180, 165, 150, 0.22)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 44, 648, 936);

  // Inner content layout based on project category (zero text characters)
  const isNetwork = project.category === "opensource";
  const isDashboard = project.category === "fullstack";

  if (isNetwork) {
    // Neural / agent network graph composition
    ctx.strokeStyle = "rgba(200, 185, 165, 0.25)";
    ctx.lineWidth = 1.5;
    const nodes = [
      [180, 220], [360, 170], [540, 230],
      [150, 410], [360, 380], [550, 400],
      [200, 610], [370, 650], [520, 600],
      [270, 820], [450, 840],
    ];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i][0] - nodes[j][0];
        const dy = nodes[i][1] - nodes[j][1];
        if (Math.hypot(dx, dy) < 270) {
          ctx.beginPath();
          ctx.moveTo(nodes[i][0], nodes[i][1]);
          ctx.lineTo(nodes[j][0], nodes[j][1]);
          ctx.stroke();
        }
      }
    }
    // Node dots
    for (const [x, y] of nodes) {
      ctx.fillStyle = "rgba(240, 220, 190, 0.75)";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(215, 160, 95, 0.5)";
      ctx.stroke();
    }
  } else if (isDashboard) {
    // Metric cards across top
    const cardWidth = 192;
    for (let c = 0; c < 3; c++) {
      const cx = 56 + c * 212;
      ctx.fillStyle = "rgba(255, 240, 220, 0.06)";
      ctx.fillRect(cx, 114, cardWidth, 86);
      ctx.fillStyle = "rgba(220, 200, 175, 0.4)";
      ctx.fillRect(cx + 16, 134, 75, 12);
      ctx.fillStyle = "rgba(240, 220, 195, 0.75)";
      ctx.fillRect(cx + 16, 156, 120, 24);
    }

    // Main data table / split view
    ctx.fillStyle = "rgba(255, 240, 220, 0.045)";
    ctx.fillRect(56, 224, 608, 380);

    // Table rows
    for (let r = 0; r < 7; r++) {
      const ry = 240 + r * 50;
      ctx.strokeStyle = "rgba(180, 165, 150, 0.14)";
      ctx.beginPath();
      ctx.moveTo(74, ry + 40);
      ctx.lineTo(644, ry + 40);
      ctx.stroke();

      // Row block indicators
      ctx.fillStyle = "rgba(230, 210, 185, 0.55)";
      ctx.fillRect(80, ry + 12, 130, 16);
      ctx.fillStyle = "rgba(220, 200, 175, 0.35)";
      ctx.fillRect(250, ry + 14, 90, 12);
      ctx.fillRect(380, ry + 14, 100, 12);
      ctx.fillStyle = "rgba(235, 165, 95, 0.65)";
      ctx.fillRect(550, ry + 12, 70, 16);
    }

    // Bottom analytics chart waveform
    ctx.fillStyle = "rgba(255, 240, 220, 0.045)";
    ctx.fillRect(56, 630, 608, 320);

    ctx.strokeStyle = "rgba(235, 165, 95, 0.7)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 74; x <= 644; x += 15) {
      const progress = (x - 74) / 570;
      const wave =
        Math.sin(progress * 13 + index * 1.5) * 48 +
        Math.cos(progress * 6.5 + index) * 36;
      const y = 780 + wave;
      if (x === 74) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Chart fill gradient
    ctx.lineTo(644, 920);
    ctx.lineTo(74, 920);
    ctx.closePath();
    ctx.fillStyle = "rgba(235, 165, 95, 0.1)";
    ctx.fill();
  } else {
    // Frontend / catalog wireframe layout
    ctx.fillStyle = "rgba(255, 240, 220, 0.05)";
    ctx.fillRect(56, 116, 608, 260); // Hero banner

    ctx.fillStyle = "rgba(240, 220, 195, 0.65)";
    ctx.fillRect(86, 156, 260, 32);
    ctx.fillStyle = "rgba(220, 200, 175, 0.35)";
    ctx.fillRect(86, 204, 360, 16);
    ctx.fillRect(86, 230, 300, 16);
    ctx.fillStyle = "rgba(235, 165, 95, 0.7)";
    ctx.fillRect(86, 272, 120, 38);

    // 2-column card grid below
    const gridCols = 2;
    const cardW = 292;
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < gridCols; col++) {
        const gx = 56 + col * (cardW + 24);
        const gy = 404 + row * 260;
        ctx.fillStyle = "rgba(255, 240, 220, 0.045)";
        ctx.fillRect(gx, gy, cardW, 230);
        ctx.fillStyle = "rgba(255, 240, 220, 0.08)";
        ctx.fillRect(gx + 16, gy + 16, cardW - 32, 110);
        ctx.fillStyle = "rgba(230, 210, 185, 0.45)";
        ctx.fillRect(gx + 16, gy + 145, 160, 16);
        ctx.fillStyle = "rgba(220, 200, 175, 0.25)";
        ctx.fillRect(gx + 16, gy + 172, 220, 12);
        ctx.fillRect(gx + 16, gy + 192, 180, 12);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

export default function ProjectArtefact() {
  const section = useOmni((s) => s.section);
  const activeProject = useOmni((s) => s.activeProject);
  const groupRef = useRef<THREE.Group>(null);
  const currentPos = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());

  // Load the ready-made Poly Haven Standing Picture Frame (CC0)
  const { scene } = useGLTF(FRAME_MODEL_URL, false);

  // Pre-generate desaturated screenshot textures for all projects (0 runtime allocations)
  const textures = useMemo(() => {
    if (typeof document === "undefined") return [];
    return projects.map((p, idx) => buildDesaturatedScreenshot(p, idx));
  }, []);

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
          // Hide glass to avoid reflections or occlusion on the screenshot
          mesh.visible = false;
        } else if (matName.includes("artwork")) {
          mesh.material = new THREE.MeshStandardMaterial({
            map: activeTexture,
            roughness: 0.72,
            metalness: 0.0,
            emissive: new THREE.Color("#443526"),
            emissiveIntensity: 0.5,
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
  const rotY = isEven ? -Math.PI * 0.5 + 0.16 : -Math.PI * 0.5 - 0.16;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dest = getProjectGlyphAnchor(activeProject);
    dest.y = 1.72;
    if (isEven) {
      dest.x = -1.2;
    } else {
      dest.x = 1.2;
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
          <primitive object={frameScene} scale={[6.8, 6.8, 6.8]} position={[0, -0.65, 0]} />

          {/* Soft warm firelight illuminating the easel frame */}
          <pointLight
            position={[0.8, 0.4, 0.7]}
            intensity={2.2}
            distance={4.5}
            color="#d6782a"
            decay={1.2}
          />
        </group>
      </Float>
    </group>
  );
}

useGLTF.preload(FRAME_MODEL_URL, false);
