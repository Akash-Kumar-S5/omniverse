// Second-opinion vision review via OpenRouter free models (cross-vendor check on critic shots).
// Usage: bun tools/or-vision-review.ts <png> [png...]   (one request per image; ~50 free requests/day)
// Reads ONLY OPENROUTER_API_KEY from env or ~/.claude/.env. Never prints the key.
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join, basename } from "node:path";

function key(): string {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  const p = join(homedir(), ".claude/.env");
  const m = existsSync(p) && readFileSync(p, "utf8").match(/^OPENROUTER_API_KEY=["']?([^"'\n]+)/m);
  if (!m) { console.error("OPENROUTER_API_KEY not set"); process.exit(2); }
  return m[1];
}

// Daily budget guard (free tier ~50 req/day across all callers).
const DAILY_CAP = 40;
const budgetFile = join(import.meta.dir, "../.orchestrator/openrouter-usage.json");
const today = new Date().toISOString().slice(0, 10);
let usage: { day: string; n: number } = existsSync(budgetFile) ? JSON.parse(readFileSync(budgetFile, "utf8")) : { day: today, n: 0 };
if (usage.day !== today) usage = { day: today, n: 0 };

const MODELS = ["nvidia/nemotron-3.5-super-vl:free", "google/gemma-4-31b-it:free", "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free"];
const PROMPT = `You are a harsh Awwwards jury member reviewing one desktop screenshot of a dark-fantasy 3D portfolio site (ruined gothic hall, firelight, scanned props, editorial typography).
Score it 0-10 for visual craft. Then list the 3 most visible defects with approximate pixel regions (x1-x2, y1-y2), and 1 thing that works.
Be specific and terse. Format:
SCORE: n
DEFECTS:
- ...
WORKS: ...`;

function saveUsage() {
  mkdirSync(join(import.meta.dir, "../.orchestrator"), { recursive: true });
  writeFileSync(budgetFile, JSON.stringify(usage));
}

const files = process.argv.slice(2);
if (!files.length) { console.error("usage: bun tools/or-vision-review.ts <png> [png...]"); process.exit(2); }
const k = key();
for (const f of files) {
  if (usage.n >= DAILY_CAP) { console.log(`## ${basename(f)}\nSKIPPED: daily OpenRouter cap (${DAILY_CAP}) reached`); continue; }
  const b64 = readFileSync(f).toString("base64");
  let out = "";
  for (const model of MODELS) {
    usage.n++;
    let r: Response;
    try {
      r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${k}`, "Content-Type": "application/json", "X-Title": "omniverse-critic" },
      body: JSON.stringify({ model, messages: [{ role: "user", content: [{ type: "text", text: PROMPT }, { type: "image_url", image_url: { url: `data:image/png;base64,${b64}` } }] }] }),
      });
    } catch (e) {
      out = `model ${model} failed: ${(e as Error).message}`; // a thrown fetch (TLS, network) is a model failure; try the next model
      saveUsage();
      continue;
    }
    const j: any = await r.json().catch(() => ({}));
    const txt = j?.choices?.[0]?.message?.content;
    saveUsage();
    if (r.ok && txt) { out = `model: ${model}\n${txt.trim()}`; break; }
    out = `model ${model} failed: ${r.status} ${j?.error?.message ?? ""}`;
    if (usage.n >= DAILY_CAP) break;
  }
  console.log(`## ${basename(f)}\n${out}\n`);
}
mkdirSync(join(import.meta.dir, "../.orchestrator"), { recursive: true });
writeFileSync(budgetFile, JSON.stringify(usage));
