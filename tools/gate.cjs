// Merge gate: build + lint, then ch0-4, the 4 Work roles and the 8 projects at 1920x1080@1 and 1512x982@2
// in ONE headed Chrome with a fresh context per load. FAIL on any console error/pageerror or a dark frame
// (right-half mean luma < 9). A load that fails once and passes on a fresh retry is reported FLAKY.
// Usage, from the repo or worktree root: node tools/gate.cjs --port 47xx [--no-build] [--out DIR] [--motion | --motion-only]
// --motion adds a 1920 wheel-scroll pass that FAILs on any frame with full-frame mean luma < 6 (transition dips).
// Writes DIR/gate.json, DIR/*.png and DIR/sheet-<size>.jpg; stops its own preview by pid.
const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { chromium } = require("/Users/akashkumars/.npm/_npx/314abffa6aaf2cd1/node_modules/playwright");

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const PORT = Number(arg("--port"));
if (!PORT || [5173, 5197].includes(PORT)) { console.error("need --port, never 5173/5197"); process.exit(2); }
const OUT = path.resolve(arg("--out", `.orchestrator/tmp/gate-${PORT}`));
fs.mkdirSync(OUT, { recursive: true });
const BASE = `http://localhost:${PORT}/`;
const MIN_MEAN = 9;
const VPS = [
  { tag: "1920", width: 1920, height: 1080, dpr: 1 },
  { tag: "1512", width: 1512, height: 982, dpr: 2 },
];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const sh = (c) => execSync(c, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const portPids = () => { try { return sh(`lsof -ti tcp:${PORT} -sTCP:LISTEN`); } catch { return ""; } };

if (!process.argv.includes("--no-build")) {
  for (const s of ["build", "lint"]) {
    try { sh(`npm run ${s}`); console.log(`${s}: ok`); } catch (e) { console.log(`${s}: FAIL\n${String(e.stdout).slice(-1500)}`); console.log("GATE FAIL"); process.exit(1); }
  }
}
if (portPids()) { console.error(`port ${PORT} busy (pid ${portPids()}); pick another`); process.exit(2); }

// Shots: [name, query, section?, index?, count?]
const plan = [];
for (let c = 0; c <= 4; c++) plan.push([`ch${c}`, `?skipgate&chapter=${c}`]);
for (let i = 0; i < 4; i++) plan.push([`role${i}`, "?skipgate&chapter=2", "experience", i, 4]);
for (let i = 0; i < 8; i++) plan.push([`proj${i}`, "?skipgate&chapter=3", "projects", i, 8]);

async function shoot(browser, vp, [name, q, section, i, n]) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.dpr });
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 160)); });
  page.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 160)));
  await page.goto(BASE + q, { waitUntil: "load" });
  await wait(section ? 6000 : 8000);
  if (section) {
    await page.evaluate(([s, i, n]) => {
      const el = document.querySelector(`[data-section="${s}"]`);
      const top = scrollY + el.getBoundingClientRect().top;
      scrollTo({ top: top + el.offsetHeight * ((i + 0.5) / n) - innerHeight * 0.5, behavior: "instant" });
    }, [section, i, n]);
    await wait(3000);
  }
  const file = `${OUT}/${name}-${vp.tag}.png`;
  const png = await page.screenshot({ path: file });
  // Mean luma of the right half, decoded in the page (no image deps).
  const mean = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = 192; c.height = 108;
    const g = c.getContext("2d");
    g.drawImage(img, img.width / 2, 0, img.width / 2, img.height, 0, 0, 192, 108);
    const d = g.getImageData(0, 0, 192, 108).data;
    let s = 0;
    for (let k = 0; k < d.length; k += 4) s += 0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2];
    return s / (d.length / 4);
  }, png.toString("base64"));
  const diag = await page.evaluate(() => { const d = window.__omniDiag; if (!d) return null; const { lost, blankSamples, remounts, firstFrameMs } = d; return { lost, blankSamples, remounts, firstFrameMs }; });
  await ctx.close();
  return { shot: `${name}-${vp.tag}`, mean: +mean.toFixed(1), errs, diag, ok: errs.length === 0 && mean >= MIN_MEAN };
}

(async () => {
  const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], { detached: true, stdio: "ignore" });
  const stop = () => { try { process.kill(-server.pid, "SIGTERM"); } catch { /* already gone */ } };
  process.on("exit", stop);
  let up = false;
  for (let t = 0; t < 60 && !up; t++) { await wait(500); up = await fetch(BASE).then((r) => r.ok, () => false); }
  if (!up) { console.log("preview did not start"); console.log("GATE FAIL"); process.exit(1); }

  const results = [];
  const browser = await chromium.launch({ headless: false, channel: "chrome", args: ["--use-angle=metal", "--enable-gpu"] });
  if (process.argv.some((a) => a.startsWith("--motion"))) {
    // Wheel-scroll the whole site at 1920 like a visitor; full-frame mean luma per step; darkest frame near each chapter change.
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => { if (m.type() === "error") errs.push(m.text().slice(0, 160)); });
    page.on("pageerror", (e) => errs.push("pageerror: " + e.message.slice(0, 160)));
    await page.goto(BASE + "?skipgate", { waitUntil: "load" });
    await wait(7000);
    await page.mouse.move(960, 540);
    const H = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    const seq = [];
    for (let k = 0; k < 600 && (await page.evaluate(() => scrollY)) < H - 5; k++) {
      await page.mouse.wheel(0, 240);
      await wait(120);
      const jpg = await page.screenshot({ type: "jpeg", quality: 50 });
      const m = await page.evaluate(async (b64) => {
        const img = new Image();
        img.src = "data:image/jpeg;base64," + b64;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = 240; c.height = 135;
        const g = c.getContext("2d");
        g.drawImage(img, 0, 0, 240, 135);
        const d = g.getImageData(0, 0, 240, 135).data;
        let s = 0;
        for (let i = 0; i < d.length; i += 4) s += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
        return { mean: s / (d.length / 4), sec: document.querySelector('.hud-nav-link[aria-current="true"]')?.textContent.trim() || "-" };
      }, jpg.toString("base64"));
      seq.push({ k, mean: +m.mean.toFixed(1), sec: m.sec });
      if (m.mean < 6) fs.writeFileSync(`${OUT}/dip-${String(k).padStart(3, "0")}.jpg`, jpg);
    }
    await ctx.close();
    const changes = seq.flatMap((s, i) => (i && s.sec !== seq[i - 1].sec ? [i] : []));
    const rows = changes.map((i) => {
      const win = seq.slice(Math.max(0, i - 8), i + 14);
      const low = win.reduce((a, s) => (s.mean < a.mean ? s : a));
      return `${seq[i - 1].sec} -> ${seq[i].sec}: min ${low.mean} at step ${low.k}, frames<6: ${win.filter((s) => s.mean < 6).length}`;
    });
    fs.writeFileSync(`${OUT}/motion.json`, JSON.stringify({ seq, errs }, null, 1));
    rows.forEach((r) => console.log("motion " + r));
    const dark = seq.filter((s) => s.mean < 6).length;
    console.log(`motion: ${seq.length} steps, frames<6: ${dark}, console errors: ${errs.length}${errs[0] ? " " + errs[0] : ""}`);
    results.push({ shot: "motion", mean: Math.min(...seq.map((s) => s.mean)), errs, ok: errs.length === 0 && dark === 0 });
  }
  for (const vp of process.argv.includes("--motion-only") ? [] : VPS) {
    for (const p of plan) {
      let r = await shoot(browser, vp, p);
      if (!r.ok) { const retry = await shoot(browser, vp, p); r = retry.ok ? { ...r, flaky: true, retry } : { ...r, retry }; }
      results.push(r);
      console.log(`${r.ok ? "ok   " : r.flaky ? "FLAKY" : "FAIL "} ${r.shot.padEnd(11)} mean ${String(r.mean).padStart(5)} errs ${r.errs.length}${r.errs.length ? " " + r.errs[0] : ""}`);
    }
    try { sh(`cd "${OUT}" && montage -label %t ${plan.map((p) => `${p[0]}-${vp.tag}.png`).join(" ")} -tile 5x -geometry 384x216+4+4 -background '#222' -fill '#ddd' -quality 80 sheet-${vp.tag}.jpg`); } catch { /* montage optional */ }
  }
  await browser.close();
  stop();
  await wait(1000);
  fs.writeFileSync(`${OUT}/gate.json`, JSON.stringify(results, null, 1));
  const fails = results.filter((r) => !r.ok && !r.flaky);
  const flaky = results.filter((r) => r.flaky);
  const low = results.reduce((a, r) => (r.mean < a.mean ? r : a));
  console.log(`lowest mean ${low.mean} (${low.shot}); flaky ${flaky.length}; port ${PORT} ${portPids() ? "STILL BUSY" : "free"}`);
  console.log(fails.length ? `GATE FAIL (${fails.length}): ${fails.map((r) => r.shot).join(", ")}` : "GATE PASS");
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error(e); console.log("GATE FAIL"); process.exit(1); });
