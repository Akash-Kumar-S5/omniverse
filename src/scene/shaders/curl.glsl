// Adapted from Nova's particle-field pseudo-curl and FlowFieldParticles' 4D noise flow.
// Copyright (c) 2026 Somnath Khadanga and Copyright (c) 2022 Benjamin Miles.
// Both sources are MIT licensed; full notices are preserved in THIRD-PARTY-NOTICES.md.
vec3 flowField(vec3 p, float time) {
  // FlowFieldParticles: decorrelated 4D simplex samples make a time-varying flow vector.
  return vec3(
    sin(snoise(vec4(p, time)) * 6.2831853 + time) * 2.0,
    sin(snoise(vec4(p.yxz, time)) * 6.2831853 + time) * 2.0,
    sin(snoise(vec4(p.zxy, time)) * 6.2831853 + time) * 2.0
  );
}

vec3 pseudoCurl(vec3 p, float time, float seed) {
  // Nova: cheap coupled sine flow avoids a second texture pass for the morph scatter.
  float t = time * 0.18 + seed * 6.2831853;
  return vec3(
    sin(p.y * 1.5 + t) + sin(p.z * 1.1 - t * 1.3),
    sin(p.z * 1.4 + t * 1.1) + sin(p.x * 1.2 + t * 0.7),
    sin(p.x * 1.3 - t) + sin(p.y * 1.0 + t * 0.9)
  );
}
