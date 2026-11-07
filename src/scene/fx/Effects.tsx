import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  DepthOfField,
  Noise,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Vector2, Vector3 } from "three";
import { useOmni } from "../../state/store";
import { TIERS, signal } from "../../state/signal";

const fringe = new Vector2(0.0008, 0.0008);

export default function Effects() {
  const quality = useOmni((s) => s.quality);
  const tier = TIERS[quality];
  const dofTarget = useRef(new Vector3(signal.focus[0], signal.focus[1], signal.focus[2]));

  useFrame(() => {
    dofTarget.current.set(signal.focus[0], signal.focus[1], signal.focus[2]);
  });

  // LITE tier: tone mapping only (no heavy post passes)
  if (quality === "lite") {
    return (
      <EffectComposer multisampling={0}>
        <ToneMapping mode={ToneMappingMode.AGX} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={quality === "high" ? 2 : 0}>
      {/* Subtle cinematic bloom with high threshold */}
      <Bloom
        intensity={0.42}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.18}
        mipmapBlur
      />

      {/* Depth of field enabled on HIGH tier; focus follows signal.focus */}
      {tier.dof && (
        <DepthOfField
          target={dofTarget.current}
          bokehScale={2.4}
          focalLength={0.02}
        />
      )}

      {/* AgX tone mapping for rich brutalist filmic contrast */}
      <ToneMapping mode={ToneMappingMode.AGX} />

      {/* Micro chromatic fringe, subtle film grain, and lens vignette */}
      <ChromaticAberration offset={fringe} />
      <Noise opacity={0.035} />
      <Vignette eskil={false} offset={0.14} darkness={0.44} />
    </EffectComposer>
  );
}
