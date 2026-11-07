varying float vDepth;
varying float vGroup;
uniform float uActiveGroup;

void main() {
  float radius = length(gl_PointCoord - 0.5);
  float alpha = 1.0 - smoothstep(0.18, 0.5, radius);
  vec3 nearColor = vec3(0.94, 0.82, 0.68);
  vec3 farColor = vec3(0.48, 0.32, 0.20);
  float selected = 1.0 - step(0.25, abs(vGroup - uActiveGroup));
  vec3 color = mix(mix(nearColor, farColor, vDepth), vec3(1.0, 0.91, 0.76), selected * 0.32);
  float brightness = mix(0.62, 1.2, selected);
  gl_FragColor = vec4(color * brightness, alpha * 0.38);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
