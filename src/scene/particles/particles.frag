varying float vDepth;
void main() {
  float radius = length(gl_PointCoord - 0.5);
  float alpha = 1.0 - smoothstep(0.18, 0.5, radius);
  vec3 nearColor = vec3(0.94, 0.82, 0.68);
  vec3 farColor = vec3(0.48, 0.32, 0.20);
  gl_FragColor = vec4(mix(nearColor, farColor, vDepth), alpha * 0.72);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
