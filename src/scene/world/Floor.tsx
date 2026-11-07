import { MeshReflectorMaterial } from "@react-three/drei";
import { useOmni } from "../../state/store";
import { TIERS } from "../../state/signal";

export default function Floor() {
  const quality = useOmni((s) => s.quality);
  const tier = TIERS[quality];

  // Plain non-reflective ground on LITE tier for performance
  if (!tier.reflector) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.8, 0]} receiveShadow>
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial color="#08090c" roughness={0.94} metalness={0.06} />
      </mesh>
    );
  }

  // Drei MeshReflectorMaterial on HIGH / MEDIUM tiers:
  // Tuned dark wet polished concrete, deep falloff, blending into scene fog
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.8, 0]} receiveShadow>
      <planeGeometry args={[140, 140]} />
      <MeshReflectorMaterial
        color="#0a0c10"
        roughness={0.68}
        metalness={0.22}
        blur={quality === "high" ? [300, 120] : [150, 60]}
        resolution={quality === "high" ? 512 : 256}
        mixBlur={0.88}
        mixStrength={0.42}
        mirror={0.34}
        depthScale={0.9}
        minDepthThreshold={0.3}
        maxDepthThreshold={1.5}
        depthToBlurRatioBias={0.25}
      />
    </mesh>
  );
}
