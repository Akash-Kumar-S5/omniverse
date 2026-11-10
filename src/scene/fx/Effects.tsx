import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Noise,
  SMAA,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Vector3 } from "three";
import { useOmni } from "../../state/store";
import { signal } from "../../state/signal";


export default function Effects() {
  const quality = useOmni((s) => s.quality);
  const section = useOmni((s) => s.section);
  const dofTarget = useRef(new Vector3(signal.focus[0], signal.focus[1], signal.focus[2]));

  useFrame(() => {
    // Focus distance = subject distance for each chapter so subjects are sharp and legible
    if (section === "boot") {
      dofTarget.current.set(0.65, 2.8, 0);
    } else if (section === "about") {
      dofTarget.current.set(10.8, 1.48, -1.5);
    } else if (section === "experience") {
      dofTarget.current.set(0.5, 1.25, 12.0);
    } else if (section === "projects") {
      dofTarget.current.set(0, 1.95, 24.0);
    } else if (section === "contact") {
      dofTarget.current.set(0, 0.75, 0);
    } else {
      dofTarget.current.set(signal.focus[0], signal.focus[1], signal.focus[2]);
    }
  });

  // Reduce depth-of-field blur on chapters 1-3 (bokehScale <= 1)
  const isSubjectChapter = section === "about" || section === "experience" || section === "projects";
  const bokehScale = isSubjectChapter ? 0.65 : 1.2;

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

      {/* Subtle bloom on luminous highlights only; threshold tuned so bloom never washes UI text */}
      <Bloom
        intensity={section === "boot" ? 1.7 : 0.13}
        luminanceThreshold={section === "boot" ? 0.5 : 0.96}
        luminanceSmoothing={section === "boot" ? 0.3 : 0.08}
        // Soft halo on the hero like the source viewer, kept tight enough not to fog the frame
        radius={section === "boot" ? 0.8 : 0.85}
        mipmapBlur
      />

      {/* Depth of field enabled on HIGH only; bokehScale <= 1 on chapters 1-3 */}
      {quality === "high" && section !== "boot" && (
        <DepthOfField
          target={dofTarget.current}
          bokehScale={bokehScale}
          focalLength={0.02}
          resolutionScale={0.5}
        />
      )}

      {/* AgX tone mapping for brutalist filmic contrast; the hero skips it because AgX bleaches its painted reds/oranges to salmon */}
      {section !== "boot" && <ToneMapping mode={ToneMappingMode.AGX} />}

      {/* Grain and vignette (the 0.0006 chromatic fringe was invisible and cost a pass) */}
      <Noise opacity={section === "projects" ? 0.024 : 0.03} />
      <Vignette eskil={false} offset={0.14} darkness={0.42} />
    </EffectComposer>
  );
}
