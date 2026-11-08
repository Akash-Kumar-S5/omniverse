import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { projects, type Project } from "../../content";
import { getProjectGlyphAnchor } from "../particles/targets";

/**
 * Renders an engraved stone tablet / parchment plate for the project.
 * Strictly anti-slop: warm muted stone, ember, and ash palette with classical
 * typography. Zero neon, zero blue glow, zero sci-fi HUD elements.
 */
function buildStonePlateTexture(project: Project, index: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Weathered dark basalt / charcoal stone base
  ctx.fillStyle = "#151311";
  ctx.fillRect(0, 0, 1024, 720);

  // Subtle natural stone grain
  ctx.fillStyle = "rgba(255, 240, 220, 0.015)";
  for (let i = 0; i < 4000; i++) {
    const rx = Math.random() * 1024;
    const ry = Math.random() * 720;
    ctx.fillRect(rx, ry, 1.5, 1.5);
  }

  // Soft vignette simulating ambient shadow across carved surface
  const vignette = ctx.createRadialGradient(512, 360, 120, 512, 360, 520);
  vignette.addColorStop(0, "rgba(32, 28, 25, 0.35)");
  vignette.addColorStop(1, "rgba(8, 7, 6, 0.85)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, 1024, 720);

  // Muted carved border line in weathered ash
  ctx.strokeStyle = "rgba(180, 165, 150, 0.18)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 36, 952, 648);

  // Inner subtle border
  ctx.strokeStyle = "rgba(180, 165, 150, 0.08)";
  ctx.lineWidth = 1;
  ctx.strokeRect(44, 44, 936, 632);

  // Top chapter/index marker
  ctx.fillStyle = "#8a7e72";
  ctx.font = "14px 'Cinzel', serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "0.2em";
  ctx.fillText(`·  PROJECT 0${index + 1} OF 0${projects.length}  ·`, 512, 95);

  // Subtle engraved divider
  ctx.strokeStyle = "rgba(180, 165, 150, 0.15)";
  ctx.beginPath();
  ctx.moveTo(380, 120);
  ctx.lineTo(644, 120);
  ctx.stroke();

  // Project Title (classical serif, carved bone tone)
  ctx.fillStyle = "#e8dfd5";
  ctx.font = "500 52px 'Playfair Display', 'Cinzel', serif";
  ctx.textAlign = "center";
  ctx.fillText(project.title, 512, 215);

  // Category descriptor (muted warm ash)
  ctx.fillStyle = "#a89a8a";
  ctx.font = "13px 'Cinzel', serif";
  ctx.letterSpacing = "0.18em";
  ctx.fillText(project.category.toUpperCase(), 512, 260);

  // Project hook / brief in classical serif
  if (project.hook) {
    ctx.fillStyle = "#c8beb4";
    ctx.font = "italic 22px 'Playfair Display', serif";
    ctx.textAlign = "center";
    ctx.fillText(`"${project.hook}"`, 512, 340);
  }

  // Description body copy (split into two lines if needed)
  ctx.fillStyle = "#9a8e82";
  ctx.font = "17px sans-serif";
  ctx.textAlign = "center";
  const descWords = project.description.split(" ");
  const mid = Math.ceil(descWords.length / 2);
  const line1 = descWords.slice(0, mid).join(" ");
  const line2 = descWords.slice(mid).join(" ");
  ctx.fillText(line1, 512, 430);
  ctx.fillText(line2, 512, 465);

  // Bottom divider
  ctx.strokeStyle = "rgba(180, 165, 150, 0.12)";
  ctx.beginPath();
  ctx.moveTo(120, 540);
  ctx.lineTo(904, 540);
  ctx.stroke();

  // Tech stack pills in quiet stone tones
  ctx.fillStyle = "#8a7e72";
  ctx.font = "14px 'Cinzel', monospace";
  ctx.textAlign = "center";
  ctx.fillText(project.tags.join("   ·   "), 512, 595);

  // Quiet footer
  ctx.fillStyle = "#5c544c";
  ctx.font = "12px monospace";
  ctx.fillText(project.github?.replace("https://github.com/", "") || "", 512, 645);

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

  // Pre-generate textures for all projects to guarantee 0 runtime allocations
  const textures = useMemo(() => {
    if (typeof document === "undefined") return [];
    return projects.map((p, idx) => buildStonePlateTexture(p, idx));
  }, []);

  const safeIdx = Math.max(0, Math.min(projects.length - 1, activeProject));
  const activeTexture = textures[safeIdx];
  const isEven = safeIdx % 2 === 0;

  // Orient towards the camera for Chapter 3 gallery view
  const rotY = isEven ? Math.PI * 0.26 : -Math.PI * 0.26;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dest = getProjectGlyphAnchor(activeProject);
    dest.y = 1.68;
    if (isEven) {
      dest.x = -1.18;
    } else {
      dest.x = 1.18;
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
      <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.16} floatingRange={[-0.02, 0.02]}>
        <group rotation={[0, rotY, 0]}>
          {/* Carved Dark Stone Tablet / Ruin Easel */}
          <RoundedBox
            args={[1.34, 0.94, 0.07]}
            radius={0.025}
            smoothness={3}
            castShadow={false}
            receiveShadow={false}
          >
            <meshStandardMaterial
              color="#1a1816"
              roughness={0.92}
              metalness={0.05}
              toneMapped={true}
            />
          </RoundedBox>

          {/* Inset Inscription Stone Surface */}
          <mesh position={[0, 0, 0.036]}>
            <planeGeometry args={[1.28, 0.88]} />
            <meshStandardMaterial
              map={activeTexture}
              roughness={0.88}
              metalness={0.02}
              emissive="#18120c"
              emissiveIntensity={0.25}
              toneMapped={true}
            />
          </mesh>

          {/* Soft warm hearth firelight illuminating the tablet */}
          <pointLight
            position={[0, 0, 0.7]}
            intensity={1.6}
            distance={4.0}
            color="#d6782a"
            decay={1.3}
          />
        </group>
      </Float>
    </group>
  );
}
