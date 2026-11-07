varying float vDepth;
varying float vGroup;
uniform float uActiveGroup;

void main() {
  float radius = length(gl_PointCoord - 0.5);
  float alpha = 1.0 - smoothstep(0.18, 0.5, radius);
  // Palette tint: warm amber near, deep bronze far. Brightness is held below
  // bloom threshold so individual particles read instead of one white blob.
  vec3 nearColor = vec3(0.78, 0.54, 0.30);
  vec3 farColor = vec3(0.34, 0.20, 0.12);
  float selected = 1.0 - step(0.25, abs(vGroup - uActiveGroup));
  vec3 color = mix(mix(nearColor, farColor, vDepth), vec3(0.95, 0.74, 0.48), selected * 0.32);
  float brightness = mix(0.8, 1.0, selected);
  gl_FragColor = vec4(color * brightness, alpha * 0.34);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
