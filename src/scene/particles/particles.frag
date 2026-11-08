varying float vDepth;
varying float vGroup;
varying float vIsAgent;
uniform float uActiveGroup;

void main() {
  // Distance from center of point sprite: 0.0 at center, 0.5 at square boundary
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  // Additive soft-disc sprite: hot luminous core with smooth, dim gaussian edges
  float softDisc = exp(-dist * dist * 18.0);
  float coreGlow = exp(-dist * dist * 50.0);
  float edgeFade = smoothstep(0.5, 0.15, dist);
  float alpha = softDisc * edgeFade;

  // Ember palette: warm glowing orange embers only
  vec3 coreColor = vec3(1.0, 0.72, 0.24);
  vec3 nearColor = vec3(0.96, 0.42, 0.08);
  vec3 farColor = vec3(0.38, 0.18, 0.06);

  // Selection highlight for role clusters in Experience
  float selected = 1.0 - step(0.25, abs(vGroup - uActiveGroup));

  // Depth falloff: distant particles dissolve into warm twilight
  float depthFalloff = clamp(1.0 - vDepth * 0.65, 0.2, 1.0);

  vec3 baseColor = mix(nearColor, farColor, vDepth);
  vec3 particleColor = mix(baseColor, coreColor, coreGlow * 0.82);
  if (selected > 0.5) {
    particleColor = mix(particleColor, vec3(1.0, 0.62, 0.20), 0.45);
  }

  // Brighter agent particles: radiant warm embers
  if (vIsAgent > 0.5) {
    particleColor = mix(vec3(1.0, 0.52, 0.12), vec3(1.0, 0.76, 0.30), coreGlow);
    alpha = mix(alpha * 1.6, 1.0, coreGlow * 0.8);
  } else {
    alpha *= depthFalloff * 0.60;
  }

  gl_FragColor = vec4(particleColor * alpha, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
