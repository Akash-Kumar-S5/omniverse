// Owner: fallback agent. Entry point for the no-WebGL page; build it out under src/ui/fallback/.
import { profile } from "../content";
export default function Fallback() {
  return <main><h1>{profile.name}</h1><p>{profile.pitch}</p></main>;
}
