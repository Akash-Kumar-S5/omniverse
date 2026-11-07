// Orchestrator-owned composition.
import Boot from "./boot/Boot";
import Hud from "./hud/Hud";
import Sections from "./sections/Sections";

export default function Overlay() {
  return (
    <>
      <Boot />
      <Hud />
      <main className="overlay">
        <Sections />
      </main>
    </>
  );
}
