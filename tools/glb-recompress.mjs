// r33: shrink the JPEG textures embedded in a GLB (resize by pct, re-encode at quality q) and rewrite the file in place.
// usage: node tools/glb-recompress.mjs <pct> <quality> file.glb ...   (needs ImageMagick `magick`)
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const [pct, q, ...files] = process.argv.slice(2);
const pad = (n) => (4 - (n % 4)) % 4;
for (const f of files) {
  const b = readFileSync(f);
  const jl = b.readUInt32LE(12);
  const j = JSON.parse(b.subarray(20, 20 + jl).toString());
  const binLen = b.readUInt32LE(20 + jl);
  const bin = b.subarray(28 + jl, 28 + jl + binLen);
  const imgViews = new Map((j.images || []).map((im) => [im.bufferView, im]));
  const chunks = [];
  let off = 0;
  j.bufferViews.forEach((bv, i) => {
    let data = bin.subarray(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength);
    const im = imgViews.get(i);
    if (im && im.mimeType === "image/jpeg") {
      const out = execFileSync("magick", ["jpg:-", "-resize", `${pct}%`, "-quality", q, "-strip", "jpg:-"], { input: data, maxBuffer: 1 << 28 });
      if (out.length < data.length) data = out;
    }
    bv.byteOffset = off;
    bv.byteLength = data.length;
    chunks.push(data, Buffer.alloc(pad(data.length)));
    off += data.length + pad(data.length);
  });
  j.buffers[0].byteLength = off;
  const newBin = Buffer.concat(chunks);
  let js = Buffer.from(JSON.stringify(j));
  js = Buffer.concat([js, Buffer.alloc(pad(js.length), 0x20)]);
  const total = 12 + 8 + js.length + 8 + newBin.length;
  const head = Buffer.alloc(12); head.write("glTF", 0); head.writeUInt32LE(2, 4); head.writeUInt32LE(total, 8);
  const jh = Buffer.alloc(8); jh.writeUInt32LE(js.length, 0); jh.write("JSON", 4);
  const bh = Buffer.alloc(8); bh.writeUInt32LE(newBin.length, 0); bh.write("BIN\0", 4);
  writeFileSync(f, Buffer.concat([head, jh, js, bh, newBin]));
  console.log(f, (b.length / 1024) | 0, "->", (total / 1024) | 0, "KB");
}
