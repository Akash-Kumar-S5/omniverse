uniform float uDelta;
uniform float uTime;
uniform vec3 uCursor;
uniform float uCursorActive;
uniform float uCursorRadius;
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 state = texture2D(texturePosition, uv);
  vec3 position = state.xyz;
  vec3 direction = normalize(position + vec3(0.0001));
  vec3 home = direction * state.a;
  vec3 cursorDelta = position - uCursor;
  float cursorDistance = length(cursorDelta);
  float influence = (1.0 - smoothstep(0.0, uCursorRadius, cursorDistance)) * uCursorActive;
  vec3 repel = normalize(cursorDelta + vec3(0.0001)) * influence * 5.0;
  float breath = 1.0 + 0.025 * sin(uTime * 0.7);
  position += (home * breath - position) * min(1.0, uDelta * 2.4);
  position += repel * uDelta;
  gl_FragColor = vec4(position, state.a);
}
