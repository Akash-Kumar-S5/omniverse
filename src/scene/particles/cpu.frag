varying float vDepth;
varying float vGroup;
uniform float uActiveGroup;

void main() {
  float radius = length(gl_PointCoord - 0.5);
  float alpha = 1.0 - smoothstep(0.18, 0.5, radius);
  vec3 nearColor = vec3(0.68, 0.46, 0.28);
  vec3 farColor = vec3(0.29, 0.18, 0.12);
  float selected = 1.0 - step(0.25, abs(vGroup - uActiveGroup));
  vec3 color = mix(mix(nearColor, farColor, vDepth), vec3(0.92, 0.71, 0.46), selected * 0.32);
  float brightness = mix(0.72, 1.0, selected);
  gl_FragColor = vec4(color * brightness, alpha * 0.2);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
