#!/usr/bin/env bun
// Render a Carbon-style code image: a self-contained 16:9 HTML page plus a PNG.
// Colors come from a real VS Code theme (via Shiki),
// the typeface is embedded as base64 so the HTML looks the same everywhere.
//
// Usage: bun render.mjs --code-file snippet.py --lang python \
//          --font "JetBrains Mono" --theme "Gruvbox Dark Hard" --out ./out --name pair
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { createHighlighter, bundledThemes, bundledLanguages } from "shiki";
import puppeteer from "puppeteer-core";

// ---------- args ----------
const args = process.argv.slice(2);
const opt = { fontFile: [] };
const flag = (n) => n.replace(/^--/, "").replace(/-([a-z])/g, (_, c) => c.toUpperCase());
for (let i = 0; i < args.length; i++) {
  if (!args[i].startsWith("--")) continue;
  const key = flag(args[i]);
  const val = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : "true";
  if (key === "fontFile") opt.fontFile.push(val);
  else opt[key] = val;
}
const die = (m) => {
  console.error(`render.mjs: ${m}`);
  process.exit(1);
};
if (!opt.codeFile) die("--code-file is required (path to the snippet, or - for stdin)");
if (!opt.lang) die("--lang is required (e.g. typescript, python, rust)");
if (!opt.font && !opt.fontFile.length) die("--font \"Name\" or --font-file <path|url> is required");
if (!opt.theme && !opt.themeFile) die("--theme \"Name\" or --theme-file <path|url> is required");

const outDir = resolve(opt.out ?? ".");
const name = opt.name ?? "snapshot";
const fontSizeMax = Number(opt.fontSize ?? 30);
const W = 1600;
const H = 900;

const code = (opt.codeFile === "-" ? readFileSync(0, "utf8") : readFileSync(opt.codeFile, "utf8")).replace(/\s+$/, "");

// ---------- helpers ----------
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const isUrl = (s) => /^https?:\/\//i.test(s);
const rawUrl = (u) =>
  u
    .replace(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\//, "https://raw.githubusercontent.com/$1/$2/")
    .replace(/^https?:\/\/gitlab\.com\/(.+)\/-\/blob\//, "https://gitlab.com/$1/-/raw/");

async function fetchBuf(url) {
  const res = await fetch(rawUrl(url), { headers: { "user-agent": UA } });
  if (!res.ok) die(`GET ${url} -> ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/** Parse JSON with comments / trailing commas (VS Code theme files are JSONC). */
function parseJsonc(text) {
  let out = "";
  let inStr = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      out += c;
      if (c === "\\") out += text[++i];
      else if (c === '"') inStr = false;
    } else if (c === '"') {
      inStr = true;
      out += c;
    } else if (c === "/" && text[i + 1] === "/") {
      while (i < text.length && text[i] !== "\n") i++;
      out += "\n";
    } else if (c === "/" && text[i + 1] === "*") {
      i += 2;
      while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++;
      i++;
    } else out += c;
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, "$1"));
}

async function loadThemeFile(ref, seen = new Set()) {
  if (seen.has(ref)) return {};
  seen.add(ref);
  const text = isUrl(ref) ? (await fetchBuf(ref)).toString("utf8") : readFileSync(ref, "utf8");
  const theme = parseJsonc(text);
  if (theme.include) {
    const parentRef = isUrl(ref) ? new URL(theme.include, rawUrl(ref)).href : resolve(dirname(ref), theme.include);
    const parent = await loadThemeFile(parentRef, seen);
    theme.colors = { ...(parent.colors ?? {}), ...(theme.colors ?? {}) };
    theme.tokenColors = [...(parent.tokenColors ?? []), ...(theme.tokenColors ?? [])];
    theme.semanticTokenColors = { ...(parent.semanticTokenColors ?? {}), ...(theme.semanticTokenColors ?? {}) };
    theme.type ??= parent.type;
    delete theme.include;
  }
  return theme;
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function resolveBundledTheme(wanted) {
  const keys = Object.keys(bundledThemes);
  const s = slug(wanted);
  const base = s.replace(/-theme$/, "");
  const hit =
    keys.find((k) => k === s) ??
    keys.find((k) => k === base) ??
    keys.find((k) => k.endsWith(`-${base}`)) ??
    keys.find((k) => k.includes(base));
  if (hit) return hit;
  const words = s.split("-").filter(Boolean);
  const near = keys.filter((k) => words.some((w) => k.includes(w))).slice(0, 12);
  die(
    `no bundled Shiki theme matches "${wanted}". Closest: ${near.join(", ") || "(none)"}. ` +
      `Pass --theme-file <raw theme .json path or URL> for any other VS Code theme.`,
  );
}

// ---------- font ----------
function inferFace(file) {
  const f = basename(file).toLowerCase();
  const style = /italic|oblique/.test(f) ? "italic" : "normal";
  let weight = 400;
  if (/thin|hairline/.test(f)) weight = 100;
  else if (/extralight|ultralight/.test(f)) weight = 200;
  else if (/light/.test(f)) weight = 300;
  else if (/medium/.test(f)) weight = 500;
  else if (/semibold|demibold/.test(f)) weight = 600;
  else if (/extrabold|ultrabold/.test(f)) weight = 800;
  else if (/bold/.test(f)) weight = 700;
  else if (/black|heavy/.test(f)) weight = 900;
  return { weight, style };
}

const fmtOf = (file) => {
  const ext = file.split("?")[0].split(".").pop().toLowerCase();
  return { woff2: ["woff2", "font/woff2"], woff: ["woff", "font/woff"], ttf: ["truetype", "font/ttf"], otf: ["opentype", "font/otf"] }[ext] ?? ["truetype", "font/ttf"];
};

async function fontFromFiles(files) {
  const faces = [];
  for (const f of files) {
    if (/\.zip$/i.test(f)) die("zip given to --font-file: extract it and pass the .woff2/.ttf/.otf files (regular, bold, italic)");
    const buf = isUrl(f) ? await fetchBuf(f) : readFileSync(f);
    faces.push({ ...inferFace(f), buf, fmt: fmtOf(f) });
  }
  return faces;
}

async function fontFromFontsource(family) {
  const res = await fetch(`https://api.fontsource.org/v1/fonts/${slug(family)}`, { headers: { "user-agent": UA } });
  if (!res.ok) return null;
  const meta = await res.json();
  const faces = [];
  for (const [weight, styles] of Object.entries(meta.variants ?? {})) {
    if (!["400", "500", "700"].includes(weight)) continue;
    for (const [style, subsets] of Object.entries(styles)) {
      const url = (subsets.latin ?? Object.values(subsets)[0])?.url?.woff2;
      if (!url) continue;
      faces.push({ weight: Number(weight), style, buf: await fetchBuf(url), fmt: ["woff2", "font/woff2"] });
    }
  }
  return faces.length ? faces : null;
}

async function fontFromGoogle(family) {
  const q = encodeURIComponent(family).replace(/%20/g, "+");
  const css = await fetch(`https://fonts.googleapis.com/css2?family=${q}:ital,wght@0,400;0,700;1,400&display=swap`, {
    headers: { "user-agent": UA },
  });
  const text = css.ok ? await css.text() : await (await fetch(`https://fonts.googleapis.com/css2?family=${q}&display=swap`, { headers: { "user-agent": UA } })).text();
  const faces = [];
  for (const m of text.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*{([^}]+)}/g)) {
    if (m[1] !== "latin") continue;
    const url = m[2].match(/url\(([^)]+)\)/)?.[1];
    if (!url) continue;
    faces.push({
      weight: Number(m[2].match(/font-weight:\s*(\d+)/)?.[1] ?? 400),
      style: m[2].match(/font-style:\s*(\w+)/)?.[1] ?? "normal",
      buf: await fetchBuf(url),
      fmt: ["woff2", "font/woff2"],
    });
  }
  return faces.length ? faces : null;
}

let faces;
let fontLabel = opt.font ?? "custom";
if (opt.fontFile.length) faces = await fontFromFiles(opt.fontFile);
else {
  faces = (await fontFromFontsource(opt.font)) ?? (await fontFromGoogle(opt.font));
  if (!faces)
    die(`could not find "${opt.font}" on Fontsource or Google Fonts. Download the font file(s) from its official page and pass --font-file <path|url> (repeat for bold/italic).`);
}
const fontFaceCss = faces
  .map(
    (f) =>
      `@font-face{font-family:"SnapFont";font-weight:${f.weight};font-style:${f.style};src:url(data:${f.fmt[1]};base64,${f.buf.toString("base64")}) format("${f.fmt[0]}");}`,
  )
  .join("\n");

// ---------- theme + tokens ----------
let themeInput;
let themeName;
if (opt.themeFile) {
  themeInput = await loadThemeFile(opt.themeFile);
  themeInput.name ??= opt.theme ?? slug(basename(opt.themeFile));
  themeName = themeInput.name;
} else {
  themeName = resolveBundledTheme(opt.theme);
  themeInput = themeName;
}

const lang = opt.lang in bundledLanguages ? opt.lang : "text";
if (lang === "text" && opt.lang !== "text") console.error(`warning: unknown language "${opt.lang}", rendering as plain text`);

const hl = await createHighlighter({ themes: [themeInput], langs: lang === "text" ? [] : [lang] });
const { tokens, bg, fg, themeName: resolvedName } = hl.codeToTokens(code, { lang, theme: themeName });
const themeObj = hl.getTheme(themeName);
const colors = themeObj.colors ?? {};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const lines = tokens
  .map((line) =>
    line
      .map((t) => {
        const st = [];
        if (t.color && t.color.toLowerCase() !== fg.toLowerCase()) st.push(`color:${t.color}`);
        if (t.fontStyle & 1) st.push("font-style:italic");
        if (t.fontStyle & 2) st.push("font-weight:700");
        if (t.fontStyle & 4) st.push("text-decoration:underline");
        return st.length ? `<span style="${st.join(";")}">${esc(t.content)}</span>` : esc(t.content);
      })
      .join("") || " ",
  )
  .map((html, i) => `<div class="ln"><span class="no">${i + 1}</span><span class="tx">${html}</span></div>`)
  .join("");

// ---------- colors ----------
const hex = (c) => {
  const h = c.replace("#", "");
  const full = h.length <= 4 ? [...h].map((x) => x + x).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};
const toHex = (rgb) => "#" + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
const mix = (a, b, t) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
const lum = (c) => {
  const [r, g, b] = hex(c);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};
const dark = lum(bg) < 0.5;
const backdrop = opt.backdrop ?? (dark ? mix(bg, "#ffffff", 0.14) : mix(bg, "#000000", 0.1));
const chrome = colors["editorGroupHeader.tabsBackground"] ?? colors["titleBar.activeBackground"] ?? mix(bg, dark ? "#000000" : "#ffffff", 0.18);
const dim = mix(bg, fg, 0.45);
const gutter = mix(bg, fg, 0.3);
const label = opt.title ?? `${fontLabel} · ${opt.theme ?? themeName}`;

// ---------- html ----------
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(label)}</title>
<style>
${fontFaceCss}
*{box-sizing:border-box;margin:0}
html,body{height:100%;background:${backdrop};overflow:hidden}
#stage{position:fixed;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;background:${backdrop};display:flex;align-items:center;justify-content:center;padding:70px 90px}
#win{width:100%;max-height:100%;display:flex;flex-direction:column;background:${bg};color:${fg};border-radius:18px;overflow:hidden;box-shadow:0 40px 80px -20px rgba(0,0,0,.55),0 0 0 1px ${mix(bg, fg, 0.16)}}
#bar{height:56px;flex:none;display:flex;align-items:center;gap:10px;padding:0 24px;background:${chrome};border-bottom:1px solid ${mix(bg, fg, 0.12)}}
#bar i{width:14px;height:14px;border-radius:50%;background:${mix(chrome, fg, 0.28)}}
#bar b{margin-left:14px;font:500 16px/1 "SnapFont",ui-monospace,monospace;color:${dim}}
#code{padding:34px 40px 40px 28px;font-family:"SnapFont",ui-monospace,monospace;font-size:${fontSizeMax}px;line-height:1.55;white-space:pre;font-variant-ligatures:normal;font-feature-settings:"calt" 1,"liga" 1;tab-size:2;-webkit-font-smoothing:antialiased}
.ln{display:flex}
.no{flex:none;width:2.4em;padding-right:1.2em;text-align:right;color:${gutter};user-select:none}
.tx{min-width:0}
</style>
</head>
<body>
<div id="stage"><div id="win"><div id="bar"><i></i><i></i><i></i><b>${esc(label)}</b></div><pre id="code">${lines}</pre></div></div>
<script>
// Pick the largest font size (<= ${fontSizeMax}px) at which the code fits the 16:9 window.
(async function(){
  await document.fonts.ready;
  const code=document.getElementById('code'), win=document.getElementById('win'), stage=document.getElementById('stage');
  const maxW=stage.clientWidth-180, maxH=stage.clientHeight-140-56;
  let size=${fontSizeMax};
  code.style.width='max-content';
  const need=()=>code.getBoundingClientRect().width>maxW||code.getBoundingClientRect().height>maxH;
  while(size>8&&need()){size-=0.5;code.style.fontSize=size+'px';}
  code.style.width='';
  window.__fontSize=size;
  const fit=()=>{const s=Math.min(innerWidth/${W},innerHeight/${H});stage.style.transform='scale('+s+')';stage.style.left=((innerWidth-${W}*s)/2)+'px';stage.style.top=((innerHeight-${H}*s)/2)+'px';};
  fit();addEventListener('resize',fit);
  window.__ready=true;
})();
</script>
</body>
</html>`;

mkdirSync(outDir, { recursive: true });
const htmlPath = resolve(outDir, `${name}.html`);
const pngPath = resolve(outDir, `${name}.png`);
writeFileSync(htmlPath, html);

// ---------- screenshots ----------
const candidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);
const chrome_ = candidates.find((p) => existsSync(p));
if (!chrome_) die("no Chrome/Chromium found. Set CHROME_PATH. The HTML was still written to " + htmlPath);

const browser = await puppeteer.launch({ executablePath: chrome_, headless: true });
let fontSize;
try {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`file://${htmlPath}`, { waitUntil: "load" });
  await page.waitForFunction("window.__ready === true", { timeout: 15000 });
  fontSize = await page.evaluate("window.__fontSize");
  await page.screenshot({ path: pngPath, clip: { x: 0, y: 0, width: W, height: H } });
} finally {
  await browser.close();
}

if (fontSize < 14) console.error(`warning: code was shrunk to ${fontSize}px to fit 16:9; use a shorter snippet (<= ~20 lines, <= ~70 columns) for a more legible image`);
console.log(JSON.stringify({ html: htmlPath, png: pngPath, size: [W, H], theme: resolvedName ?? themeName, themeType: dark ? "dark" : "light", background: bg, foreground: fg, font: fontLabel, fontSizePx: fontSize, lines: tokens.length }, null, 2));
