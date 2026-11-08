import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard, useGLTF, useTexture } from "@react-three/drei";
import { useOmni } from "../../state/store";

/**
 * The real fire. Everything here is an existing asset or an existing drei component:
 *  - stone_fire_pit.draco.glb: Poly Haven scan (CC0), Draco-compressed with blender/scripts/compress_fire_pit.py
 *  - flame-spritesheet-6x1.png: Kenney particle pack (CC0) as a flipbook on a drei <Billboard>
 *  - ONE warm point light (#ff8a3d), the only warm source in the scene, flickering +-15%
 * Coordinates are glTF space (Y up); the sanctum bake uses the same space.
 */
const PIT_URL = "/assets/ruins/stone_fire_pit.draco.glb";
const FLAME_URL = "/assets/props/textures/flame-spritesheet-6x1.png";
const PIT_SCALE = 1.7;
const PLINTH_TOP = 0.42;
const FRAMES = 6;

/** The one fire sits on the plinth at the origin; the contact chapter now looks at it from the side. */
const PLINTH_FLAME: [number, number, number] = [0, 0.62, 0];

export function FirePit() {
  const { scene } = useGLTF(PIT_URL, "/draco/");
  const pit = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const centre = box.getCenter(new THREE.Vector3());
    const holder = new THREE.Group();
    // centre on x/z; the scaled base sinks a hand's width into the plinth top
    clone.position.set(-centre.x, -box.min.y, -centre.z);
    holder.add(clone);
    return holder;
  }, [scene]);
  return <primitive object={pit} position={[0, PLINTH_TOP - 0.085, 0]} scale={[PIT_SCALE, PIT_SCALE, PIT_SCALE]} />;
}

function Flame({ position, size = 1.1, phase = 0 }: { position: [number, number, number]; size?: number; phase?: number }) {
  const sheet = useTexture(FLAME_URL);
  const tex = useMemo(() => {
    const t = sheet.clone();
    t.needsUpdate = true;
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.ClampToEdgeWrapping;
    t.repeat.set(1 / FRAMES, 1);
    return t;
  }, [sheet]);
  useEffect(() => () => tex.dispose(), [tex]);

  useFrame((state) => {
    const frame = Math.floor(state.clock.elapsedTime * 12 + phase * FRAMES) % FRAMES;
    tex.offset.x = frame / FRAMES;
  });

  return (
    <Billboard position={position} follow lockX={false} lockY={false} lockZ={false}>
      {/* the plane sits on its bottom edge so the flame grows up from the coals */}
      <mesh position={[0, size / 2, 0]} renderOrder={5}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          map={tex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          color="#ffb070"
        />
      </mesh>
    </Billboard>
  );
}

/** The one warm light, on the plinth fire. */
function FireLight() {
  const ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const l = ref.current;
    if (!l) return;
    const t = state.clock.elapsedTime;
    const flicker = 0.55 * Math.sin(t * 9.1) + 0.3 * Math.sin(t * 17.3 + 1.7) + 0.15 * Math.sin(t * 31.9 + 0.4); // |.|<=1
    l.intensity = 7 * (1 + 0.15 * flicker);
  });

  return (
    <pointLight
      ref={ref}
      color="#ff8a3d"
      intensity={7}
      distance={10}
      decay={2}
      position={[0, 1.1, 0]}
    />
  );
}

export default function Fire() {
  const quality = useOmni((s) => s.quality);
  return (
    <group>
      <FirePit />
      <FireLight />
      <Flame position={PLINTH_FLAME} size={quality === "lite" ? 1.0 : 1.2} />
    </group>
  );
}

useGLTF.preload(PIT_URL, "/draco/");
useTexture.preload(FLAME_URL);
