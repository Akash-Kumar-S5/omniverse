import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useOmni } from "../../state/store";
import { projects, type Project } from "../../content";
import { getProjectGlyphAnchor } from "../particles/targets";

function drawSchematic(ctx: CanvasRenderingContext2D, category: string, accentColor: string) {
  const cx = 512;
  const cy = 410;

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1;

  // Grid backdrop
  for (let x = 80; x <= 944; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 260);
    ctx.lineTo(x, 560);
    ctx.stroke();
  }
  for (let y = 260; y <= 560; y += 30) {
    ctx.beginPath();
    ctx.moveTo(80, y);
    ctx.lineTo(944, y);
    ctx.stroke();
  }

  if (category === "fullstack") {
    // Distributed Client-Server Architecture Diagram
    const nodes = [
      { x: cx - 260, y: cy, label: "CLIENT", sub: "Web/UI" },
      { x: cx - 90, y: cy, label: "GATEWAY", sub: "Auth & Rate" },
      { x: cx + 90, y: cy - 60, label: "CORE API", sub: "Service" },
      { x: cx + 90, y: cy + 60, label: "WORKER", sub: "Queue/Job" },
      { x: cx + 270, y: cy, label: "STORAGE", sub: "SQL/Cache" },
    ];

    // Connecting bus lines
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(nodes[0].x, nodes[0].y);
    ctx.lineTo(nodes[1].x, nodes[1].y);
    ctx.lineTo(nodes[2].x, nodes[2].y);
    ctx.lineTo(nodes[4].x, nodes[4].y);
    ctx.moveTo(nodes[1].x, nodes[1].y);
    ctx.lineTo(nodes[3].x, nodes[3].y);
    ctx.lineTo(nodes[4].x, nodes[4].y);
    ctx.stroke();

    // Nodes
    nodes.forEach((n) => {
      ctx.fillStyle = "#12141a";
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(n.x - 55, n.y - 28, 110, 56, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px 'Cinzel', monospace";
      ctx.textAlign = "center";
      ctx.fillText(n.label, n.x, n.y - 4);

      ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
      ctx.font = "11px monospace";
      ctx.fillText(n.sub, n.x, n.y + 14);
    });
  } else if (category === "opensource") {
    // Autonomous Agent Loop / Neural Graph
    const radius = 95;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    const agentSteps = ["PERCEIVE", "PLAN", "TOOL CALL", "VERIFY", "SYNTHESIZE"];
    agentSteps.forEach((step, i) => {
      const angle = (i / agentSteps.length) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;

      ctx.fillStyle = "#101318";
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(`0${i + 1}`, x, y + 4);

      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = "11px monospace";
      const tx = cx + Math.cos(angle) * (radius + 42);
      const ty = cy + Math.sin(angle) * (radius + 42) + 4;
      ctx.fillText(step, tx, ty);
    });

    // Center nucleus
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Telemetry & Latency Spectrum Waterfall
    const bars = 28;
    const startX = cx - 280;
    const barW = 14;
    const gap = 6;
    for (let i = 0; i < bars; i++) {
      const h = 40 + Math.sin(i * 0.45) * 35 + Math.cos(i * 0.9) * 25;
      const x = startX + i * (barW + gap);
      const y = cy + 70 - h;

      const grad = ctx.createLinearGradient(x, y, x, cy + 70);
      grad.addColorStop(0, accentColor);
      grad.addColorStop(1, "rgba(255, 255, 255, 0.05)");

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barW, h);

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, barW, h);
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    ctx.fillText("RESPONSE HISTOGRAM (p50: 12ms / p95: 38ms / p99: 64ms)", startX, cy - 80);
  }

  ctx.restore();
}

function buildProjectTexture(project: Project, index: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 680;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const accentColor = index % 2 === 0 ? "#79b8ff" : "#eed8ae";

  // Deep graphite base
  ctx.fillStyle = "#0c0e12";
  ctx.fillRect(0, 0, 1024, 680);

  // Subtle vignette / inner glow
  const radial = ctx.createRadialGradient(512, 340, 100, 512, 340, 500);
  radial.addColorStop(0, "rgba(26, 32, 44, 0.45)");
  radial.addColorStop(1, "rgba(8, 10, 13, 0.95)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 1024, 680);

  // Outer border with accent corners
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, 984, 640);

  // Corner brackets
  const cornerLen = 28;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 4;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(20, 20 + cornerLen);
  ctx.lineTo(20, 20);
  ctx.lineTo(20 + cornerLen, 20);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(1004 - cornerLen, 20);
  ctx.lineTo(1004, 20);
  ctx.lineTo(1004, 20 + cornerLen);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(20, 660 - cornerLen);
  ctx.lineTo(20, 660);
  ctx.lineTo(20 + cornerLen, 660);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(1004 - cornerLen, 660);
  ctx.lineTo(1004, 660);
  ctx.lineTo(1004, 660 - cornerLen);
  ctx.stroke();

  // Top header status bar
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.arc(52, 54, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`SYS.ONLINE  |  ARTEFACT 0${index + 1} OF 0${projects.length}`, 68, 59);

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.textAlign = "right";
  ctx.fillText("AKASH KUMAR  //  AI TOOLING ARCHITECTURE", 972, 59);

  // Divider line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(40, 78);
  ctx.lineTo(984, 78);
  ctx.stroke();

  // Category pill
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(50, 102, 190, 30, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.font = "bold 12px monospace";
  ctx.textAlign = "center";
  ctx.fillText(`[ ${project.category.toUpperCase()} ]`, 145, 122);

  // Project title
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 44px 'Playfair Display', serif";
  ctx.textAlign = "left";
  ctx.fillText(project.title, 50, 185);

  // Tech stack pills
  let tagX = 50;
  const tagY = 222;
  project.tags.slice(0, 4).forEach((tag) => {
    ctx.font = "12px monospace";
    const textW = ctx.measureText(tag).width;
    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(tagX, tagY - 16, textW + 18, 24, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillText(tag, tagX + 9, tagY);
    tagX += textW + 28;
  });

  // Schematic Diagram
  drawSchematic(ctx, project.category, accentColor);

  // Footer status
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.beginPath();
  ctx.moveTo(40, 608);
  ctx.lineTo(984, 608);
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "12px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`STATUS: VERIFIED REPOSITORY  ·  ${project.github?.replace("https://github.com/", "") || "PUBLIC"}`, 50, 632);

  ctx.fillStyle = accentColor;
  ctx.textAlign = "right";
  ctx.fillText("60 FPS PBR REFLECTION READY", 972, 632);

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
    return projects.map((p, idx) => buildProjectTexture(p, idx));
  }, []);

  const safeIdx = Math.max(0, Math.min(projects.length - 1, activeProject));
  const activeTexture = textures[safeIdx];
  const isEven = safeIdx % 2 === 0;

  // Orient towards the camera for Chapter 3 gallery view
  // Even camera: position [0.9, 1.8, -9.9], target [-2.7, 2.9, -13.5] -> faces right-down
  // Odd camera: position [-0.9, 1.8, -9.9], target [2.7, 2.9, -13.5] -> faces left-down
  const rotY = isEven ? Math.PI * 0.26 : -Math.PI * 0.26;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dest = getProjectGlyphAnchor(activeProject);
    // Position framed artefact screen cleanly below the celestial letterform
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
      <Float speed={1.5} rotationIntensity={0.12} floatIntensity={0.22} floatingRange={[-0.03, 0.03]}>
        <group rotation={[0, rotY, 0]}>
          {/* Machined Obsidian/Titanium Frame */}
          <RoundedBox
            args={[1.36, 0.94, 0.05]}
            radius={0.03}
            smoothness={4}
            castShadow={false}
            receiveShadow={false}
          >
            <meshStandardMaterial
              color="#131418"
              roughness={0.28}
              metalness={0.88}
              toneMapped={true}
            />
          </RoundedBox>

          {/* Recessed Lit Display Screen */}
          <mesh position={[0, 0, 0.028]}>
            <planeGeometry args={[1.30, 0.88]} />
            <meshStandardMaterial
              map={activeTexture}
              emissiveMap={activeTexture}
              emissive="#ffffff"
              emissiveIntensity={0.82}
              roughness={0.16}
              metalness={0.06}
              toneMapped={true}
            />
          </mesh>

          {/* Local accent rim light washing the slab and floor */}
          <pointLight
            position={[0, 0, 0.6]}
            intensity={2.2}
            distance={4.2}
            color={isEven ? "#a0c8ff" : "#ffdfa0"}
            decay={1.3}
          />
        </group>
      </Float>
    </group>
  );
}
