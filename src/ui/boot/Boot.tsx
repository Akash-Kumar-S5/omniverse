// Stub. Owner: hud agent. Must call useOmni.getState().setBooted() when done.
import { useEffect } from "react";
import { useOmni } from "../../state/store";
export default function Boot() {
  useEffect(() => { useOmni.getState().setBooted(); }, []);
  return null;
}
