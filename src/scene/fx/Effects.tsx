import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  DepthOfField,
  Noise,
  SMAA,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Vector2, Vector3 } from "three";
import { useOmni } from "../../state/store";
import { signal } from "../../state/signal";

const fringe = new Vector2(0.0006, 0.0006);

export default function Effects() {
  const quality = useOmni((s) => s.quality);
  const dofTarget = useRef(new Vector3(signal.focus[0], signal.focus[1], signal.focus[2]));

  useFrame(() => {
    dofTarget.current.set(signal.focus[0], signal.focus[1], signal.focus[2]);
  });

  // LITE tier: tone mapping only
  if (quality === "lite") {
    return (
      <EffectComposer multisampling={0}>
        <ToneMapping mode={ToneMappingMode.AGX} />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      {/* Efficient SMAA edge smoothing without expensive MSAA */}
      <SMAA />

      {/* Subtle bloom on luminous highlights */}
      <Bloom
        intensity={0.38}
        luminanceThreshold={0.82}
        luminanceSmoothing={0.2}
        mipmapBlur
      />

      {/* Depth of field enabled on HIGH only */}
      {quality === "high" && (
        <DepthOfField
          target={dofTarget.current}
          bokehScale={2.2}
          focalLength={0.02}
        />
      )}

      {/* AgX tone mapping for brutalist filmic contrast */}
      <ToneMapping mode={ToneMappingMode.AGX} />

      {/* Subtle chromatic fringe, grain, and vignette */}
      <ChromaticAberration offset={fringe} />
      <Noise opacity={0.03} />
      <Vignette eskil={false} offset={0.14} darkness={0.42} />
    </EffectComposer>
  );
}
