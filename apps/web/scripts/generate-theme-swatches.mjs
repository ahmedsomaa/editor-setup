#!/usr/bin/env bun
// Writes src/lib/theme-swatches.json: for each bundled Shiki theme, its background and the colors of
// four token classes (keyword, string, function, number). The Studio draws them as dots in the Theme menu.
// Run it again after Shiki is upgraded: bun scripts/generate-theme-swatches.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { bundledThemesInfo, createHighlighter } from "shiki";

const code = 'const total = sum("abc", 1);';
// Token text to look for, in the order the dots are drawn.
const WANTED = ["const", "abc", "sum", "1"];

const out = {};
for (const { id } of bundledThemesInfo) {
  try {
    const hl = await createHighlighter({ themes: [id], langs: ["typescript"] });
    const { tokens, bg, fg } = hl.codeToTokens(code, { lang: "typescript", theme: id });
    const flat = tokens.flat();
    const dots = WANTED.map((w) => flat.find((t) => t.content.trim() === w.trim() || t.content.includes(w))?.color ?? fg);
    out[id] = { bg, dots };
    hl.dispose();
  } catch (e) {
    console.error(`skipped ${id}: ${e.message}`);
  }
}

const target = fileURLToPath(new URL("../src/lib/theme-swatches.json", import.meta.url));
writeFileSync(target, JSON.stringify(out, null, 1) + "\n");
console.log(`wrote ${Object.keys(out).length} themes to ${target}`);
