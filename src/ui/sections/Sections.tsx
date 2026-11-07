// Stub. Owner: sections agent. Must render one <section data-section="id"> per SectionId (boot..contact).
import { SECTIONS } from "../../state/store";
export default function Sections() {
  return (
    <>
      {SECTIONS.map((id) => (
        <section key={id} data-section={id} style={{ minHeight: "100vh" }} />
      ))}
    </>
  );
}
