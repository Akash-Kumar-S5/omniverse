uniform float uPointSize;
uniform float uTime;
attribute float aGroup;
varying float vDepth;
varying float vGroup;
varying float vIsAgent;

void main() {
  vGroup = aGroup;
  float isAgent = step(8.5, aGroup);
  vIsAgent = isAgent;

  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  float dist = max(0.5, -viewPosition.z);
  vDepth = clamp((dist - 2.0) / 32.0, 0.0, 1.0);

  // Size attenuation: 3-4x smaller base particles, agent particles ~2.2x larger with subtle pulse
  float pulse = isAgent * 0.2 * sin(uTime * 2.8 + position.x * 5.0 + position.y * 3.0);
  float agentScale = mix(1.0, 2.2 + pulse, isAgent);

  float pSize = uPointSize * agentScale * (18.0 / dist);
  gl_PointSize = clamp(pSize, 1.0, 10.0);

  gl_Position = projectionMatrix * viewPosition;
}
