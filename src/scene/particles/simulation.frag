uniform float uDelta;
uniform float uTime;
uniform vec3 uCursor;
uniform float uCursorActive;
uniform float uCursorStrength;
uniform float uCursorWake;
uniform vec3 uCursorVelocity;
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

  // Cursor interaction: larger repulsion radius + lingering curl wake
  vec3 cursorDelta = position - uCursor;
  float cursorDistance = length(cursorDelta);
  float cursorRadius = 2.4;
  float normDist = clamp(cursorDistance / cursorRadius, 0.0, 1.0);
  float repelFalloff = (1.0 - normDist) * (1.0 - normDist);

  // Radial repulsion impulse
  float repulsion = clamp(uCursorStrength, 0.0, 1.0) * repelFalloff * 0.75;
  vec3 repelDir = normalize(cursorDelta + vec3(0.0001));
  vec3 repel = repelDir * repulsion * uCursorActive;

  // Lingering curl wake: tangential circulation along cursor velocity + turbulent eddies
  vec3 wakeCirculation = cross(vec3(0.0, 1.0, 0.0), repelDir) * length(uCursorVelocity) * 0.25;
  vec3 wakeCurl = pseudoCurl(position * 1.6 + cursorDelta * 0.8, uTime * 1.2, seed);
  vec3 curlWake = (wakeCirculation + wakeCurl * 0.35) * uCursorWake * repelFalloff * uCursorActive;

  position += (repel + curlWake) * uTurbulence;
  // Rising thermal updraft: embers drift naturally upward towards the light shaft and ceiling
  position += vec3(0.0, (0.022 + sin(uTime * 1.5 + seed * 6.28) * 0.008) * uTurbulence, 0.0);
  gl_FragColor = vec4(position, target.a);
}
