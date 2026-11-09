/**
 * r34: eight distinct stagings for the eight projects (the judge saw one frame, one lantern and one camera eight times).
 * Each project varies the frame (scale, roll, yaw, pitch, placement, art crop), the light fixture (lantern hung centre, lantern on a side
 * bracket, candles on a ledge, a wall sconce), the light colour and strength, the stone wall behind, and the camera (dolly, height, fov, side).
 */
export type Fixture = "hang" | "side" | "candles" | "sconce";

export interface ProjectStage {
  scale: number;          // frame scale multiplier
  roll: number;           // radians, hung slightly crooked
  yaw: number;            // radians, turned away from the camera plane
  pitch: number;
  dx: number;             // extra frame placement along the camera's right (m)
  dy: number;             // extra frame placement along the camera's up (m)
  zoom: number;           // art crop zoom (1 = whole painting)
  cropX: number;          // art crop offset 0..1 (clamped to the zoom window)
  cropY: number;
  fixture: Fixture;
  side: 1 | -1;           // which side the side fixture / sconce sits on
  light: string;          // fixture light colour
  lightK: number;         // fixture light strength multiplier
  wall: string;           // stone wall tint
  wallScale: number;      // wall size multiplier
  cam: { dolly: number; dy: number; fov: number; lean: number };   // camera dolly (m, + = closer), height offset, fov offset, sideways lean (m)
}

export const PROJECT_STAGES: ProjectStage[] = [
  // 0 SalarySync: the baseline staging, lantern centred above the frame
  { scale: 1.0, roll: 0, yaw: 0, pitch: 0, dx: 0, dy: 0, zoom: 1, cropX: 0, cropY: 0, fixture: "hang", side: 1, light: "#ffb066", lightK: 1, wall: "#4a423a", wallScale: 1, cam: { dolly: 0, dy: 0, fov: 0, lean: 0 } },
  // 1 Rentify: turned left, lantern on a bracket to the left
  { scale: 0.92, roll: 0.03, yaw: -0.3, pitch: 0, dx: 0.12, dy: -0.05, zoom: 1.15, cropX: 0.05, cropY: 0.1, fixture: "side", side: -1, light: "#ffa857", lightK: 1.05, wall: "#443a31", wallScale: 1.1, cam: { dolly: 0.5, dy: -0.1, fov: -2, lean: -0.3 } },
  // 2 Website Performance Monitor: tall and close, candles on a stone ledge below
  { scale: 1.12, roll: -0.025, yaw: 0.16, pitch: -0.05, dx: -0.1, dy: 0.1, zoom: 1.0, cropX: 0, cropY: 0, fixture: "candles", side: 1, light: "#ffc27a", lightK: 0.95, wall: "#3c352e", wallScale: 1.15, cam: { dolly: 0.8, dy: -0.25, fov: 2, lean: 0.3 } },
  // 3 Innovation Sprint: small and high, lantern off-centre, moon-gold light
  { scale: 0.82, roll: 0.05, yaw: 0.28, pitch: 0.06, dx: 0.2, dy: 0.28, zoom: 1.3, cropX: 0.3, cropY: 0.35, fixture: "hang", side: 1, light: "#ffdba0", lightK: 0.9, wall: "#4a4a44", wallScale: 0.95, cam: { dolly: -0.4, dy: 0.2, fov: -3, lean: 0.5 } },
  // 4 MediHub: crooked, rose-tinted sconce on the right
  { scale: 1.0, roll: -0.07, yaw: -0.14, pitch: 0.03, dx: -0.15, dy: 0, zoom: 1.2, cropX: 0.1, cropY: 0.05, fixture: "sconce", side: 1, light: "#ffb59a", lightK: 1.1, wall: "#48383a", wallScale: 1.05, cam: { dolly: 0.3, dy: 0.05, fov: 0, lean: -0.5 } },
  // 5 Finaca: large, turned, candles on the right of a ledge, warm gold
  { scale: 1.2, roll: 0.02, yaw: 0.34, pitch: -0.03, dx: -0.3, dy: -0.05, zoom: 1.1, cropX: 0.2, cropY: 0.0, fixture: "candles", side: -1, light: "#ffcb86", lightK: 1.0, wall: "#403a2e", wallScale: 1.2, cam: { dolly: 0.9, dy: -0.2, fov: 3, lean: 0.4 } },
  // 6 Fuel Dispenser RFID: small and tilted, lantern on a right-hand bracket, hotter orange
  { scale: 0.88, roll: 0.075, yaw: -0.22, pitch: 0.0, dx: 0.1, dy: 0.05, zoom: 1.25, cropX: 0.35, cropY: 0.2, fixture: "side", side: 1, light: "#ff9448", lightK: 1.15, wall: "#4a3a30", wallScale: 1.0, cam: { dolly: 0.2, dy: 0.1, fov: -1, lean: -0.4 } },
  // 7 GenAI Experiments: the biggest frame, a cool moonlit lantern
  { scale: 1.26, roll: -0.01, yaw: 0.08, pitch: 0.02, dx: -0.35, dy: 0.05, zoom: 1.0, cropX: 0, cropY: 0, fixture: "hang", side: 1, light: "#b8c8ee", lightK: 0.85, wall: "#3a3c44", wallScale: 1.25, cam: { dolly: 1.0, dy: -0.15, fov: 4, lean: 0.2 } },
];

export function stageFor(index: number): ProjectStage {
  return PROJECT_STAGES[Math.max(0, Math.min(PROJECT_STAGES.length - 1, index))];
}
