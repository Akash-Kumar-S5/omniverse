uniform float uPointSize;
attribute float aGroup;
varying float vDepth;
varying float vGroup;

void main() {
  vGroup = aGroup;
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vDepth = clamp((-viewPosition.z - 2.0) / 36.0, 0.0, 1.0);
  gl_PointSize = uPointSize * (1.0 + 7.0 / max(1.0, -viewPosition.z));
  gl_Position = projectionMatrix * viewPosition;
}
