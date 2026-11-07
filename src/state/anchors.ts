// Contract (round 2). Orchestrator-owned. Bridge between 3D objects and DOM callout labels.
// Scene side (codex-world) writes projected screen positions every frame, without React renders.
// UI side (agy-type) reads them in its own rAF loop and draws labels plus SVG leader lines.
export interface Anchor {
  /** CSS pixels from the viewport's top-left corner. */
  x: number;
  y: number;
  /** false when behind the camera, off-screen, or its chapter is not active. */
  visible: boolean;
}

export type AnchorId =
  | "hero.core"
  | "about.object"
  | "about.city"
  | "projects.active"
  | "contact.beacon";

export const anchors: Record<AnchorId, Anchor> = {
  "hero.core": { x: 0, y: 0, visible: false },
  "about.object": { x: 0, y: 0, visible: false },
  "about.city": { x: 0, y: 0, visible: false },
  "projects.active": { x: 0, y: 0, visible: false },
  "contact.beacon": { x: 0, y: 0, visible: false },
};
