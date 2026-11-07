vec3 curlNoise(vec3 p) {
  const float e = 0.06;
  float n1a = snoise(p + vec3(0.0, e, 0.0));
  float n1b = snoise(p - vec3(0.0, e, 0.0));
  float n2a = snoise(p + vec3(0.0, 0.0, e));
  float n2b = snoise(p - vec3(0.0, 0.0, e));
  float n3a = snoise(p + vec3(e, 0.0, 0.0));
  float n3b = snoise(p - vec3(e, 0.0, 0.0));
  return vec3(n2a - n2b - n1a + n1b, n3a - n3b - n2a + n2b, n1a - n1b - n3a + n3b) / (2.0 * e);
}
