#!/usr/bin/env bun
// Download a Sketchfab model by UID with Akash's API token (read from ~/.claude/.env, never printed).
// Usage: bun tools/sketchfab-dl.ts <uid> <outDir>
// Refuses anything not CC0 / CC-BY / CC-BY-SA, and anything named after game characters or studios.
import { readFileSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const [uid, outDir] = process.argv.slice(2);
if (!uid || !outDir) { console.error("usage: bun tools/sketchfab-dl.ts <uid> <outDir>"); process.exit(1); }

let token = process.env.SKETCHFAB_API_TOKEN || "";
try {
  for (const line of readFileSync(join(homedir(), ".claude", ".env"), "utf-8").split("\n")) {
    const m = line.match(/^SKETCHFAB_API_TOKEN=(.*)$/);
    if (m) token = m[1].trim().replace(/^["']|["']$/g, "");
  }
} catch {}
if (!token) { console.error("SKETCHFAB_API_TOKEN not set"); process.exit(1); }
const H = { Authorization: `Token ${token}` };

const meta = await (await fetch(`https://api.sketchfab.com/v3/models/${uid}`)).json() as any;
const lic: string = meta?.license?.slug ?? meta?.license?.label ?? "unknown";
const text = `${meta?.name} ${meta?.description ?? ""} ${(meta?.tags ?? []).map((t: any) => t.name).join(" ")}`.toLowerCase();
const BLOCK = /fire ?keeper|malenia|elden|dark ?souls|fromsoft|bloodborne|sekiro|estus|solaire|artorias|ranni|melina/;
if (BLOCK.test(text)) { console.error(`REFUSED: "${meta?.name}" references a game character/studio`); process.exit(2); }
if (!/^(cc0|by|by-sa)$/.test(lic) && !/CC0|CC Attribution(?!-Non)/i.test(meta?.license?.label ?? "")) {
  console.error(`REFUSED: licence "${meta?.license?.label ?? lic}" is not CC0/CC-BY/CC-BY-SA`); process.exit(2);
}
const dl = await (await fetch(`https://api.sketchfab.com/v3/models/${uid}/download`, { headers: H })).json() as any;
const src = dl?.glb?.url ?? dl?.gltf?.url;
if (!src) { console.error("no downloadable glb/gltf for this model (not downloadable or token rejected)"); process.exit(3); }
mkdirSync(outDir, { recursive: true });
const ext = dl?.glb?.url ? "glb" : "zip";
const file = join(outDir, `${uid}.${ext}`);
writeFileSync(file, Buffer.from(await (await fetch(src)).arrayBuffer()));
console.log(JSON.stringify({ file, name: meta?.name, author: meta?.user?.displayName ?? meta?.user?.username,
  licence: meta?.license?.label ?? lic, url: meta?.viewerUrl, faces: meta?.faceCount }, null, 2));
