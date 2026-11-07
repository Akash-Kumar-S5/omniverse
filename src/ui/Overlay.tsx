import Boot from "./boot/Boot";
import Hud from "./hud/Hud";
import Sections from "./sections/Sections";

export default function Overlay() {
  return (
    <>
      <Boot />
      <Hud />
      <main className="overlay" id="main-content" tabIndex={-1}>
        <Sections />
      </main>
    </>
  );
}
