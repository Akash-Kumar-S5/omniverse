import { Component, type ReactNode } from "react";

/**
 * r32: a transient asset fetch failure ("Could not load sanctum.glb: Failed to fetch") used to leave the 3D layer blank for good, because a
 * suspended loader's rejection is cached and nothing caught it. This boundary keeps the page alive and reloads once or twice to recover.
 * The retry count lives in sessionStorage and is cleared after the scene has run for 20 s.
 */
const KEY = "omni-scene-retry";
const MAX_RETRIES = 2;

function readRetries(): number {
  try {
    return Number(window.sessionStorage.getItem(KEY) ?? "0") || 0;
  } catch {
    return MAX_RETRIES;
  }
}

export default class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  private clearTimer = 0;

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("3D scene failed to load, retrying:", error instanceof Error ? error.message : error);
    const tries = readRetries();
    if (tries < MAX_RETRIES) {
      try {
        window.sessionStorage.setItem(KEY, String(tries + 1));
      } catch {
        return;
      }
      window.setTimeout(() => window.location.reload(), 500);
    }
  }

  componentDidMount() {
    // a scene that stays up for 20 s counts as a good load: forget earlier retries
    this.clearTimer = window.setTimeout(() => {
      try {
        window.sessionStorage.removeItem(KEY);
      } catch {
        /* storage unavailable */
      }
    }, 20000);
  }

  componentWillUnmount() {
    window.clearTimeout(this.clearTimer);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
