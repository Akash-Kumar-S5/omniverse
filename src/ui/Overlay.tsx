// agy owns src/ui/**. Placeholder so the scaffold builds.
import { SECTIONS } from "../state/store";
export default function Overlay() {
  return (
    <main style={{ position: "relative", zIndex: 1 }}>
      {SECTIONS.map((id) => (
        <section key={id} data-section={id} style={{ minHeight: "100vh" }}>{id}</section>
      ))}
    </main>
  );
}
