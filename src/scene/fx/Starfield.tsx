import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useOmni } from "../../state/store";

function random(seed: number) {
  let value = seed | 0;
  return () => {
    value = (value + 0x6d2b79f5) | 0;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Starfield() {
  const isNarrow = useThree((s) => s.size.width < 600);
  const section = useOmni((s) => s.section);
  const quality = useOmni((s) => s.quality);
  const count = quality === "lite" ? 1000 : 3000;

  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    const rand = random(4821);
    for (let i = 0; i < count; i++) {
      const radius = 18 + rand() * 68;
      const theta = rand() * Math.PI * 2;
      const y = (rand() - 0.5) * 52;
      values[i * 3] = Math.cos(theta) * radius;
      values[i * 3 + 1] = y;
      values[i * 3 + 2] = Math.sin(theta) * radius;
    }
    return values;
  }, [count]);

  // Stars are only visible when looking up through the open oculus to the sky (boot and contact)
  // Cull starfield at narrow aspect (<600px) so no speckle cloud reads as a render glitch
  if (isNarrow || section === "boot" || section === "about" || section === "experience" || section === "projects") {
    return null;
  }

  return <points>
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" args={[positions, 3]} />
    </bufferGeometry>
    <pointsMaterial color="#c5b7a5" size={0.045} transparent opacity={0.38} sizeAttenuation depthWrite={false} />
  </points>;
}
