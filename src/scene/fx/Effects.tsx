import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useOmni } from "../../state/store";

export default function Effects() {
  const quality = useOmni((s) => s.quality);
  if (quality === "lite") return null;
  return <EffectComposer multisampling={4}>
    <Bloom intensity={1.05} luminanceThreshold={0.18} luminanceSmoothing={0.22} mipmapBlur />
  </EffectComposer>;
}
