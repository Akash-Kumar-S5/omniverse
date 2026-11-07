// agy owns src/ui/**. Placeholder no-WebGL page.
import { profile } from "../content";
export default function Fallback() {
  return <main><h1>{profile.name}</h1><p>{profile.pitch}</p></main>;
}
