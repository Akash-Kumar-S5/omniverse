varying float vDepth;
varying float vGroup;
uniform float uActiveGroup;

void main() {
  float radius = length(gl_PointCoord - 0.5);
  float alpha = 1.0 - smoothstep(0.12, 0.5, radius);
  // Rich palette tint: warm amber champagne near, deep bronze far
  vec3 nearColor = vec3(0.96, 0.72, 0.38);
  vec3 farColor = vec3(0.55, 0.32, 0.14);
  float selected = 1.0 - step(0.25, abs(vGroup - uActiveGroup));
  vec3 color = mix(mix(nearColor, farColor, vDepth), vec3(1.0, 0.86, 0.56), selected * 0.35);
  // Tuned brightness so individual particles read crisply without blooming into an overexposed blob
  float brightness = mix(0.38, 0.65, selected);
  gl_FragColor = vec4(color * brightness, alpha * 0.44);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
