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

  // Ember & Ash palette: incandescent yellow core, vibrant fire-orange near, cooling grey ash far
  vec3 coreColor = vec3(1.0, 0.86, 0.48);
  vec3 nearColor = vec3(0.96, 0.42, 0.08);
  vec3 farColor = vec3(0.30, 0.28, 0.28);

  float selected = 1.0 - step(0.25, abs(vGroup - uActiveGroup));
  float depthFalloff = clamp(1.0 - vDepth * 0.65, 0.2, 1.0);

  vec3 baseColor = mix(nearColor, farColor, vDepth);
  vec3 particleColor = mix(baseColor, coreColor, coreGlow * 0.82);
  if (selected > 0.5) {
    particleColor = mix(particleColor, vec3(1.0, 0.68, 0.25), 0.45);
  }

  if (vIsAgent > 0.5) {
    particleColor = mix(vec3(1.0, 0.55, 0.15), vec3(1.0, 0.94, 0.72), coreGlow);
    alpha = mix(alpha * 1.6, 1.0, coreGlow * 0.8);
  } else {
    alpha *= depthFalloff * 0.60;
  }

  gl_FragColor = vec4(particleColor * alpha, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
