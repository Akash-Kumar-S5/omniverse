import { useOmni } from "../state/store";
import Boot from "./boot/Boot";
import Hud from "./hud/Hud";
import Sections from "./sections/Sections";

export default function Overlay() {
  const booted = useOmni((s) => s.booted);

  return (
    <>
      <Boot />
      <Hud inert={!booted} />
      <main
        className="overlay"
        id="main-content"
        tabIndex={-1}
        inert={!booted}
      >
        <Sections />
      </main>
    </>
  );
}
