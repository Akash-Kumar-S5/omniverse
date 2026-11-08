uniform float uDelta;
uniform float uTime;
uniform vec3 uCursor;
uniform float uCursorActive;
uniform float uCursorStrength;
uniform sampler2D uTarget;
uniform sampler2D uFromTarget;
uniform float uMorphProgress;
uniform float uTurbulence;
uniform float uBeacon;
uniform vec3 uFocus;
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 target = texture2D(uTarget, uv);
  vec4 from = texture2D(uFromTarget, uv);
  float progress = uMorphProgress;
  vec3 position = mix(from.xyz, target.xyz, progress);
  float seed = fract(uv.x * 157.0 + uv.y * 311.0);
  vec3 beaconDirection = normalize(target.xyz - uFocus + vec3(0.0001));
  position += beaconDirection * sin(uTime * 2.2) * 0.035 * uBeacon * uTurbulence;
  float transitionNoise = sin(3.14159265 * progress);
  vec3 flow = flowField(position * 0.8, uTime * 0.2 + seed * 6.2831853);
  vec3 organic = pseudoCurl(position * 0.75, uTime * 0.35, seed);
  position += flow * (0.012 + seed * 0.008) * uTurbulence;
  position += organic * (0.024 * uTurbulence + transitionNoise * 0.14);

  // Slow organic breathing: gentle radial pulse of the living swarm
  vec3 toFocus = position - uFocus;
  float breathing = sin(uTime * 0.85 + seed * 1.5) * 0.04 * (1.0 - uBeacon);
  position += normalize(toFocus + vec3(0.0001)) * breathing * uTurbulence;

  vec3 cursorDelta = position - uCursor;
  float cursorDistance = length(cursorDelta);
  float repulsion = clamp(uCursorStrength, 0.0, 1.0) / max(0.08, cursorDistance * (cursorDistance + 1.0));
  vec3 repel = normalize(cursorDelta + vec3(0.0001)) * repulsion * uCursorActive;
  position += repel * min(1.0, uDelta * 12.0);
  position += vec3(0.0, sin(uTime * 0.7) * 0.018 * uTurbulence, 0.0);
  gl_FragColor = vec4(position, target.a);
}
