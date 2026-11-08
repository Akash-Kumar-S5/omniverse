varying float vDepth;
varying float vGroup;
varying float vIsAgent;
uniform float uActiveGroup;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  if (dist > 0.5) discard;

  // Additive soft-disc sprite: hot luminous core with smooth, dim gaussian edges
  float softDisc = exp(-dist * dist * 18.0);
  float coreGlow = exp(-dist * dist * 50.0);
  float edgeFade = smoothstep(0.5, 0.15, dist);
  float alpha = softDisc * edgeFade;

  // Celestial palette: warm amber champagne near, deep bronze far
  vec3 coreColor = vec3(1.0, 0.96, 0.88);
  vec3 nearColor = vec3(0.98, 0.80, 0.48);
  vec3 farColor = vec3(0.52, 0.28, 0.14);

  float selected = 1.0 - step(0.25, abs(vGroup - uActiveGroup));
  float depthFalloff = clamp(1.0 - vDepth * 0.65, 0.2, 1.0);

  vec3 baseColor = mix(nearColor, farColor, vDepth);
  vec3 particleColor = mix(baseColor, coreColor, coreGlow * 0.75);
  if (selected > 0.5) {
    particleColor = mix(particleColor, vec3(1.0, 0.88, 0.62), 0.35);
  }

  if (vIsAgent > 0.5) {
    particleColor = mix(vec3(1.0, 0.94, 0.82), vec3(1.0, 1.0, 0.98), coreGlow);
    alpha = mix(alpha * 1.5, 1.0, coreGlow * 0.8);
  } else {
    alpha *= depthFalloff * 0.55;
  }

  gl_FragColor = vec4(particleColor * alpha, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
