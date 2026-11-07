import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import { useOmni } from "../../state/store";
import { Vector2 } from "three";

const fringe = new Vector2(0.00018, 0.00018);

export default function Effects() {
  const quality = useOmni((s) => s.quality);
  if (quality === "lite") return null;
  return <EffectComposer multisampling={2}>
    <Bloom intensity={0.42} luminanceThreshold={0.82} luminanceSmoothing={0.18} mipmapBlur />
    <ChromaticAberration offset={fringe} />
    <Noise opacity={0.03} />
    <Vignette eskil={false} offset={0.12} darkness={0.48} />
  </EffectComposer>;
}
