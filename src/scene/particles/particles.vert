uniform sampler2D uPositions;
uniform sampler2D uTarget;
uniform float uPointSize;
varying float vGroup;
varying float vDepth;
void main() {
  vec3 position = texture2D(uPositions, uv).xyz;
  vGroup = texture2D(uTarget, uv).a;
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vDepth = clamp((-viewPosition.z - 2.0) / 36.0, 0.0, 1.0);
  gl_PointSize = uPointSize * (1.0 + 7.0 / max(1.0, -viewPosition.z));
  gl_Position = projectionMatrix * viewPosition;
}
