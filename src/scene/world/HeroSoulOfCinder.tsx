import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const URL = "/assets/models/soul_of_cinder_-_dark_souls_3_boss_tilt_brush.glb";
const HEIGHT = 5.6;

export default function HeroSoulOfCinder() {
  const { scene } = useGLTF(URL, "/draco/");
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        const source = child.material;
        // Tilt Brush draws Fire/Light/Highlighter additively, so overlapping strokes stack into hot yellow and bloom
        const glows = ["FireLambert", "LightLambert", "HighlighterLambert"].includes(source.name);
        // Paint vertex colors are authored in sRGB; convert once so they render saturated instead of washed out.
        // Glow brushes stay unconverted: the source viewer adds them raw, which is what keeps the blade yellow-hot.
        const colors = child.geometry.getAttribute("color");
        if (colors && !glows && !child.geometry.userData.srgbConverted) {
          child.geometry = child.geometry.clone();
          const converted = child.geometry.getAttribute("color");
          const c = new THREE.Color();
          for (let i = 0; i < converted.count; i++) {
            c.setRGB(converted.getX(i), converted.getY(i), converted.getZ(i), THREE.SRGBColorSpace);
            converted.setXYZ(i, c.r, c.g, c.b);
          }
          child.geometry.userData.srgbConverted = true;
        }
        // Untextured brush (Disco) is dark polished metal in Tilt Brush, not flat white paint
        if (!source.map) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x3a3330,
            vertexColors: true,
            metalness: 1,
            roughness: 0.4,
            side: THREE.DoubleSide,
          });
          return;
        }
        // Glow strokes are self-lit; paint is lit (Lambert, as in Tilt Brush) so the warm/blue rig tints it like the source viewer
        const Material = glows ? THREE.MeshBasicMaterial : THREE.MeshLambertMaterial;
        const material = new Material({
          map: source.map,
          vertexColors: true,
          alphaTest: glows ? 0 : source.alphaTest || 0.2,
          transparent: glows,
          depthWrite: !glows,
          blending: glows ? THREE.AdditiveBlending : THREE.NormalBlending,
          side: THREE.DoubleSide,
          toneMapped: false,
        });
        // Brush textures are grayscale masks; keep only their alpha so the vertex colors stay vivid
        material.onBeforeCompile = (shader) => {
          shader.fragmentShader = shader.fragmentShader.replace(
            "#include <map_fragment>",
            glows
              ? "#ifdef USE_MAP\ndiffuseColor.rgb *= texture2D( map, vMapUv ).a * diffuseColor.a;\n#endif"
              : "#ifdef USE_MAP\ndiffuseColor.a *= texture2D( map, vMapUv ).a;\n#endif",
          );
        };
        // Above 1 so bright paint and glow strokes cross the bloom threshold and haze like the source
        material.color.setScalar(glows ? 2.4 : 1);
        child.material = material;
      }
    });
    const bounds = new THREE.Box3().setFromObject(clone);
    const center = bounds.getCenter(new THREE.Vector3());
    const height = bounds.max.y - bounds.min.y;

    clone.position.set(-center.x, -bounds.min.y, -center.z);

    const holder = new THREE.Group();
    holder.add(clone);
    holder.scale.setScalar(HEIGHT / height);
    return holder;
  }, [scene]);

  const glow = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Cannot create hero glow texture");
    const gradient = context.createRadialGradient(256, 128, 4, 256, 128, 128);
    gradient.addColorStop(0, "rgba(255, 176, 68, 0.28)");
    gradient.addColorStop(0.35, "rgba(154, 74, 26, 0.18)");
    gradient.addColorStop(0.72, "rgba(57, 22, 12, 0.08)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  useEffect(() => () => glow.dispose(), [glow]);

  const spin = useRef<THREE.Group>(null);
  const yaw = useRef({ current: 0, target: 0 });

  useEffect(() => {
    let startX = 0;
    let startTarget = 0;
    let dragging = false;
    const interactive = (el: EventTarget | null) =>
      el instanceof Element && !!el.closest("a, button, input, select, textarea, [role='button']");
    const down = (e: PointerEvent) => {
      if (interactive(e.target)) return;
      dragging = true;
      startX = e.clientX;
      startTarget = yaw.current.target;
    };
    const move = (e: PointerEvent) => {
      if (dragging) yaw.current.target = startTarget + ((e.clientX - startX) / window.innerWidth) * Math.PI * 2;
    };
    const up = () => {
      dragging = false;
    };
    // Trackpad two-finger horizontal swipes arrive as wheel events
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || interactive(e.target)) return;
      e.preventDefault();
      yaw.current.target -= (e.deltaX / window.innerWidth) * Math.PI * 2;
    };
    const previousTouchAction = document.body.style.touchAction;
    document.body.style.touchAction = "pan-y";
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("wheel", wheel, { passive: false });
    return () => {
      document.body.style.touchAction = previousTouchAction;
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("wheel", wheel);
    };
  }, []);

  useFrame((_, delta) => {
    const y = yaw.current;
    y.current = THREE.MathUtils.damp(y.current, y.target, 8, delta);
    if (spin.current) spin.current.rotation.y = y.current;
  });

  const target = useMemo(() => {
    const object = new THREE.Object3D();
    object.position.set(0.15, 2.8, 0);
    return object;
  }, []);

  return (
    <group position={[0.65, 0, 0]}>
      <mesh position={[0, 2.8, -3.2]} renderOrder={-1}>
        <planeGeometry args={[9, 4.5]} />
        <meshBasicMaterial
          map={glow}
          color="#ffb35a"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <primitive object={target} />
      <group rotation={[0, Math.PI - 0.6, 0]}>
        <group ref={spin}>
          <primitive object={model} />
        </group>
      </group>
      {/* Strong warm fill: Lambert paint keeps its authored reds, the coloured lights below add the blue/orange tint */}
      <ambientLight color="#ffc4a0" intensity={2.6} />
      <directionalLight color="#ff9b45" intensity={1.2} position={[2.8, 5, 4]} />
      <spotLight
        color="#ff5c24"
        intensity={2.5}
        distance={12}
        angle={Math.PI / 4}
        penumbra={0.75}
        position={[-2, 4.5, 2]}
        target={target}
      />
      <pointLight color="#ff9a42" intensity={2.2} distance={6} decay={2} position={[1.5, 2.8, 1.2]} />
      <pointLight color="#428cff" intensity={1.5} distance={5.5} decay={2} position={[-1.2, 2.6, 1.4]} />
    </group>
  );
}

useGLTF.preload(URL, "/draco/");
