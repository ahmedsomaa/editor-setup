import type { ThemedToken } from "shiki/core";
import type { FontFace } from "@/lib/schemas";

export const STAGE_W = 1600;
export const STAGE_H = 900;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const hex = (c: string) => {
  const h = c.replace("#", "");
  const full = h.length <= 4 ? [...h].map((x) => x + x).join("") : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};
const toHex = (rgb: number[]) =>
  "#" + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
const mix = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  return toHex(A.map((v, i) => v + (B[i] - v) * t));
};
const lum = (c: string) => {
  const [r, g, b] = hex(c);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};

/** Theme files are untrusted input that lands in a same-origin iframe: only plain hex colors get through. */
const safeHex = (c: string | undefined, fallback: string) =>
  c && /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(c) ? c : fallback;

export type SnapshotInput = {
  lines: ThemedToken[][];
  bg: string;
  fg: string;
  colors: Record<string, string>;
  faces: FontFace[];
  label: string;
  /** Window around the code: title bar with the dots and label, a file tree, tabs and a status bar. */
  showBar?: boolean;
  fontSizeMax?: number;
  lineHeight?: number;
  /** Language id: names the open file in the window. */
  lang?: string;
};

const EXTENSIONS: Record<string, string> = {
  typescript: "ts", tsx: "tsx", javascript: "js", jsx: "jsx", python: "py", rust: "rs", ruby: "rb",
  bash: "sh", shellscript: "sh", markdown: "md", yaml: "yml", csharp: "cs", kotlin: "kt",
};
const fileFor = (lang: string) => `main.${EXTENSIONS[lang] ?? lang}`;

/** 24x24 outline icons (Feather, MIT). */
const ICONS = {
  files: '<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M13 2v7h7"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>',
  branch: '<path d="M6 3v12"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  columns: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/>',
  more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  right: '<path d="M9 18l6-6-6-6"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
} as const;

const icon = (name: keyof typeof ICONS, size: number, color?: string) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="${color ?? "currentColor"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

/** The code as the editable `<pre>` holds it: colored spans, one line per newline, and a final newline so the last line can be typed into. */
export function codeHtml(lines: ThemedToken[][], fgColor: string): string {
  const fg = safeHex(fgColor, "#d4d4d4");
  return (
    lines
      .map((line) =>
        line
          .map((t) => {
            const st: string[] = [];
            const tc = safeHex(t.color, "");
            if (tc && tc.toLowerCase() !== fg.toLowerCase()) st.push(`color:${tc}`);
            const fs = t.fontStyle ?? 0;
            if (fs & 1) st.push("font-style:italic");
            if (fs & 2) st.push("font-weight:700");
            if (fs & 4) st.push("text-decoration:underline");
            return st.length ? `<span style="${st.join(";")}">${esc(t.content)}</span>` : esc(t.content);
          })
          .join(""),
      )
      .join("\n") + "\n"
  );
}

export function isDarkBg(bg: string) {
  return lum(bg) < 0.5;
}

/** A self-contained 16:9 page: theme colors, embedded font, auto-fit code size. */
export function buildSnapshotHtml(i: SnapshotInput): string {
  const { label } = i;
  const bg = safeHex(i.bg, "#1e1e1e");
  const fg = safeHex(i.fg, "#d4d4d4");
  const colors = i.colors;
  const fontSizeMax = i.fontSizeMax ?? 30;
  const lineHeight = i.lineHeight ?? 1.55;
  const dark = isDarkBg(bg);
  const showBar = i.showBar ?? true;
  const chromeFallback = mix(bg, dark ? "#000000" : "#ffffff", 0.18);
  const chrome = safeHex(
    colors["editorGroupHeader.tabsBackground"] ?? colors["titleBar.activeBackground"],
    chromeFallback,
  );
  const dim = mix(bg, fg, 0.45);
  const gutter = mix(bg, fg, 0.3);
  const file = fileFor(i.lang ?? "typescript");
  // The sibling files follow the language too, so the tree always matches the code.
  const ext = file.slice("main.".length);
  const utils = `utils.${ext}`;
  const index = `index.${ext}`;
  const sideFg = safeHex(colors["foreground"], fg);
  const tabBg = safeHex(colors["editorGroupHeader.tabsBackground"], chrome);
  const tabOn = safeHex(colors["tab.activeBackground"], bg);
  const line = safeHex(colors["panel.border"], mix(bg, fg, 0.12));
  const sideBg = safeHex(colors["sideBar.background"], mix(bg, dark ? "#000000" : "#ffffff", 0.1));
  const rowOn = safeHex(colors["list.activeSelectionBackground"], mix(sideBg, fg, 0.12));
  const hue = (key: string) => safeHex(colors[key], dim);
  const tsColor = hue("terminal.ansiBlue");
  const jsonColor = hue("terminal.ansiYellow");
  const mdColor = hue("terminal.ansiCyan");
  const fileColor = (name: string) =>
    name.endsWith(".json") ? jsonColor : name.endsWith(".md") ? mdColor : tsColor;
  const fileIcon = (name: string, size: number) => icon("files", size, fileColor(name));
  const row = (depth: number, glyph: string, name: string, on = false) =>
    `<div class="r${on ? " on" : ""}" style="padding-left:${12 + depth * 22}px">${glyph}<span>${esc(name)}</span></div>`;
  const tree = [
    row(0, icon("down", 16) + icon("folder", 18), "src"),
    row(1, fileIcon(file, 18), file, true),
    row(1, fileIcon(utils, 18), utils),
    row(1, fileIcon(index, 18), index),
    row(0, icon("right", 16) + icon("folder", 18), "components"),
    row(0, `<span style="width:16px"></span>` + fileIcon("README.md", 18), "README.md"),
    row(0, `<span style="width:16px"></span>` + fileIcon("LICENSE", 18), "LICENSE"),
  ].join("");
  const pad = showBar ? 28 : 60;
  const padX = showBar ? 40 : 80;

  const fontFaceCss = i.faces
    .map(
      (f) =>
        `@font-face{font-family:"SnapFont";font-weight:${f.weight};font-style:${f.style};src:url(data:${f.mime};base64,${f.base64}) format("${f.format}");}`,
    )
    .join("\n");

  const lines = codeHtml(i.lines, fg);

  const editor = `<div id="editor"><div id="nums">${i.lines.map((_, n) => n + 1).join("\n")}\n</div><pre id="code" aria-hidden="true">
${lines}</pre></div>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(label)}</title>
<style>
${fontFaceCss}
*{box-sizing:border-box;margin:0}
html,body{height:100%;background:${bg};overflow:hidden}
#stage{position:fixed;left:0;top:0;width:${STAGE_W}px;height:${STAGE_H}px;transform-origin:0 0;background:${bg};color:${fg};display:flex;flex-direction:column}
#bar{height:56px;flex:none;display:flex;align-items:center;gap:10px;padding:0 28px;background:${chrome};border-bottom:1px solid ${mix(bg, fg, 0.12)}}
#bar i{width:14px;height:14px;border-radius:50%;background:${mix(chrome, fg, 0.28)}}
#bar b{margin-left:14px;font:500 16px/1 "SnapFont",ui-monospace,monospace;color:${sideFg}}
#area{flex:1;min-height:0;display:flex;align-items:flex-start;padding:${pad}px ${padX}px 0}
#body{flex:1;min-height:0;display:flex}
#side{width:280px;flex:none;background:${sideBg};border-right:1px solid ${line};color:${dim};font:400 17px/1 "SnapFont",ui-monospace,monospace;padding:18px 12px 0;overflow:hidden}
#side .ph{display:flex;align-items:center;gap:10px;padding:0 12px 16px;font-size:18px;font-weight:500;color:${sideFg}}
#side .r{display:flex;align-items:center;gap:8px;height:36px;border-radius:9px;color:${sideFg};white-space:nowrap}
#side .r svg{flex:none}
#side .r.on{background:${rowOn}}
#tabs svg{margin-right:10px}
#tools{margin-left:auto;display:flex;align-items:center;gap:22px;padding:0 26px;color:${dim}}
#status{height:40px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:0 24px;background:${chrome};border-top:1px solid ${line};font:400 15px/1 "SnapFont",ui-monospace,monospace;color:${dim}}
#status span{display:flex;align-items:center;gap:8px}
#status .end{gap:24px}
#main{flex:1;min-width:0;display:flex;flex-direction:column}
#tabs{height:56px;flex:none;display:flex;align-items:flex-end;gap:6px;padding:0 14px;background:${tabBg};border-bottom:1px solid ${line};font:400 18px/1 "SnapFont",ui-monospace,monospace;color:${dim}}
#tabs span{display:flex;align-items:center;height:44px;padding:0 22px;border-radius:12px 12px 0 0}
#tabs .on{background:${tabOn};color:${sideFg}}
#tabs #tools{height:44px;padding:0 12px;border-radius:0}
#editor{display:flex;align-items:flex-start;min-width:0;font-family:"SnapFont",ui-monospace,monospace;font-size:${fontSizeMax}px;line-height:${lineHeight};font-variant-ligatures:normal;font-feature-settings:"calt" 1,"liga" 1;tab-size:2;-webkit-font-smoothing:antialiased}
#nums{flex:none;width:2.4em;padding-right:1.2em;text-align:right;white-space:pre;color:${gutter};user-select:none}
#code{flex:1;min-width:0;min-height:${lineHeight}em;margin:0;font:inherit;white-space:pre}
</style>
</head>
<body>
<div id="stage">${
    showBar
      ? `<div id="bar"><i></i><i></i><i></i><b>${esc(label)}</b></div><div id="body"><div id="side"><div class="ph">${icon("folder", 20)}editor-setup</div>${tree}</div><div id="main"><div id="tabs"><span class="on">${fileIcon(file, 18)}${esc(file)}</span><span>${fileIcon(utils, 18)}${esc(utils)}</span><span id="tools">${icon("search", 20)}${icon("columns", 20)}${icon("more", 20)}</span></div><div id="area">${editor}</div></div></div><div id="status"><span>${icon("branch", 16)}main</span><span class="end"><span>${esc(i.lang ?? "typescript")}</span><span>UTF-8</span><span id="lnno">Ln ${i.lines.length}</span></span></div>`
      : `<div id="area">${editor}</div>`
  }</div>
<script>
(async function(){
  await document.fonts.ready;
  const ed=document.getElementById('editor'), area=document.getElementById('area'), stage=document.getElementById('stage');
  const maxW=area.clientWidth-${padX * 2}, maxH=area.clientHeight-${pad}-48;
  let size=${fontSizeMax};
  ed.style.fontSize=size+'px';
  while(size>8&&(ed.offsetWidth>maxW||ed.offsetHeight>maxH)){size-=0.5;ed.style.fontSize=size+'px';}
  window.__fontSize=size;
  const fit=()=>{const s=Math.min(innerWidth/${STAGE_W},innerHeight/${STAGE_H});stage.style.transform='scale('+s+')';stage.style.left=((innerWidth-${STAGE_W}*s)/2)+'px';stage.style.top=((innerHeight-${STAGE_H}*s)/2)+'px';};
  fit();addEventListener('resize',fit);
  window.__ready=true;
})();
</script>
</body>
</html>`;
}
