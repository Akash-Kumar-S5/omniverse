import { useOmni } from "../state/store";
import Boot from "./boot/Boot";
import Hud from "./hud/Hud";
import CalloutLayer from "./callouts/CalloutLayer";
import Sections from "./sections/Sections";

export default function Overlay() {
  const entered = useOmni((s) => s.entered);

  return (
    <>
      <Boot />
      <Hud inert={!entered} />
      <CalloutLayer />
      <main
        className="overlay"
        id="main-content"
        tabIndex={-1}
        inert={!entered}
      >
        <Sections />
      </main>
    </>
  );
}
