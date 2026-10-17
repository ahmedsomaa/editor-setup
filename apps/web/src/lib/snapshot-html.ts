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
  /** Window around the code: title bar with the dots and label, a tab bar and a breadcrumb. */
  showBar?: boolean;
  fontSizeMax?: number;
  /** Language id: names the open file in the window. */
  lang?: string;
};

const EXTENSIONS: Record<string, string> = {
  typescript: "ts", tsx: "tsx", javascript: "js", jsx: "jsx", python: "py", rust: "rs", ruby: "rb",
  bash: "sh", shellscript: "sh", markdown: "md", yaml: "yml", csharp: "cs", kotlin: "kt",
};
const fileFor = (lang: string) => `main.${EXTENSIONS[lang] ?? lang}`;

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
  const sideFg = safeHex(colors["foreground"], fg);
  const tabBg = safeHex(colors["editorGroupHeader.tabsBackground"], chrome);
  const tabOn = safeHex(colors["tab.activeBackground"], bg);
  const line = safeHex(colors["panel.border"], mix(bg, fg, 0.12));
  const pad = showBar ? 28 : 60;
  const padX = showBar ? 40 : 80;

  const fontFaceCss = i.faces
    .map(
      (f) =>
        `@font-face{font-family:"SnapFont";font-weight:${f.weight};font-style:${f.style};src:url(data:${f.mime};base64,${f.base64}) format("${f.format}");}`,
    )
    .join("\n");

  const lines = i.lines
    .map((line, n) => {
      const body =
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
          .join("") || " ";
      return `<div class="ln"><span class="no">${n + 1}</span><span class="tx">${body}</span></div>`;
    })
    .join("");

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
#main{flex:1;min-width:0;display:flex;flex-direction:column}
#tabs{height:52px;flex:none;display:flex;background:${tabBg};border-bottom:1px solid ${line};font:400 18px/1 "SnapFont",ui-monospace,monospace;color:${dim}}
#tabs span{display:flex;align-items:center;padding:0 26px}
#tabs .on{background:${tabOn};color:${sideFg}}
#crumb{flex:none;padding:18px ${padX}px 0;font:400 17px/1 "SnapFont",ui-monospace,monospace;color:${dim}}
#code{font-family:"SnapFont",ui-monospace,monospace;font-size:${fontSizeMax}px;line-height:1.55;white-space:pre;font-variant-ligatures:normal;font-feature-settings:"calt" 1,"liga" 1;tab-size:2;-webkit-font-smoothing:antialiased}
.ln{display:flex}
.no{flex:none;width:2.4em;padding-right:1.2em;text-align:right;color:${gutter};user-select:none}
.tx{min-width:0}
</style>
</head>
<body>
<div id="stage">${
    showBar
      ? `<div id="bar"><i></i><i></i><i></i><b>${esc(label)}</b></div><div id="body"><div id="main"><div id="tabs"><span class="on">${esc(file)}</span><span>package.json</span></div><div id="crumb">src &gt; ${esc(file)}</div><div id="area"><pre id="code">${lines}</pre></div></div></div>`
      : `<div id="area"><pre id="code">${lines}</pre></div>`
  }</div>
<script>
(async function(){
  await document.fonts.ready;
  const code=document.getElementById('code'), area=document.getElementById('area'), stage=document.getElementById('stage');
  const maxW=area.clientWidth-${padX * 2}, maxH=area.clientHeight-${pad}-48;
  let size=${fontSizeMax};
  const need=()=>{const r=code.getBoundingClientRect();return r.width>maxW||r.height>maxH;};
  while(size>8&&need()){size-=0.5;code.style.fontSize=size+'px';}
  window.__fontSize=size;
  const fit=()=>{const s=Math.min(innerWidth/${STAGE_W},innerHeight/${STAGE_H});stage.style.transform='scale('+s+')';stage.style.left=((innerWidth-${STAGE_W}*s)/2)+'px';stage.style.top=((innerHeight-${STAGE_H}*s)/2)+'px';};
  fit();addEventListener('resize',fit);
  window.__ready=true;
})();
</script>
</body>
</html>`;
}
