import { useMemo } from "react";
import * as THREE from "three";

/**
 * r45 ch1: a room for the statue.
 * A faint cool mist glow stands behind the statue as a back-wall falloff (additive, so the black behind the statue gains depth),
 * and a soft dark pool feathers the lit floor edge at the bottom right so it no longer reads as the cut edge of a plane.
 */
function radial(stops: [number, string][]) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot create gradient");
  const g = ctx.createRadialGradient(128, 128, 4, 128, 128, 128);
  for (const [at, colour] of stops) g.addColorStop(at, colour);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

export default function AboutRoom() {
  const fade = useMemo(() => radial([[0, "rgba(6,5,4,1)"], [0.6, "rgba(6,5,4,0.9)"], [1, "rgba(6,5,4,0)"]]), []);
  const mist = useMemo(() => radial([[0, "rgba(255,255,255,0.9)"], [0.5, "rgba(255,255,255,0.35)"], [1, "rgba(255,255,255,0)"]]), []);
  return (
    <>
      {/* back-wall mist: a tall pale-blue glow and a low warm one, behind the statue (camera looks +x, screen right is +z) */}
      <mesh position={[14.5, 2.6, -1.3]} rotation={[0, -Math.PI / 2, 0]} renderOrder={1}>
        <planeGeometry args={[9, 7]} />
        <meshBasicMaterial map={mist} color="#7f93bd" transparent opacity={0.24} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} toneMapped={false} />
      </mesh>
      <mesh position={[14.2, 0.9, -1.3]} rotation={[0, -Math.PI / 2, 0]} renderOrder={1}>
        <planeGeometry args={[10, 3]} />
        <meshBasicMaterial map={mist} color="#ff9a52" transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} toneMapped={false} />
      </mesh>
      <mesh position={[14, 0.05, 2.6]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
        <planeGeometry args={[11, 11]} />
        <meshBasicMaterial map={fade} transparent depthWrite={false} fog={false} toneMapped={false} />
      </mesh>
    </>
  );
}
