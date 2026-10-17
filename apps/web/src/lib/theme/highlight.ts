import { createHighlighterCore, type HighlighterCore, type ThemedToken } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import { bundledLanguages, bundledThemes, bundledThemesInfo } from "shiki";

export const THEMES = bundledThemesInfo
  .map((t) => ({ id: t.id, name: t.displayName, type: t.type }))
  .sort((a, b) => a.name.localeCompare(b.name));
export const LANGUAGE_IDS = Object.keys(bundledLanguages).sort();

export type Highlighted = {
  lines: ThemedToken[][];
  bg: string;
  fg: string;
  colors: Record<string, string>;
  themeName: string;
};

const cache = new Map<string, Promise<HighlighterCore>>();

function highlighterFor(key: string, theme: unknown, lang: string) {
  let hit = cache.get(key);
  if (!hit) {
    hit = createHighlighterCore({
      themes: [theme as never],
      langs: lang in bundledLanguages ? [bundledLanguages[lang as keyof typeof bundledLanguages]] : [],
      engine: createJavaScriptRegexEngine(),
    });
    cache.set(key, hit);
  }
  return hit;
}

export async function highlight(opts: {
  code: string;
  lang: string;
  themeId: string;
  customTheme?: Record<string, unknown> | null;
}): Promise<Highlighted> {
  const { code, lang, themeId, customTheme } = opts;
  const useLang = lang in bundledLanguages ? lang : "text";

  let themeInput: unknown;
  let themeKey: string;
  let themeName: string;
  if (customTheme) {
    themeName = String(customTheme.name ?? "custom-theme");
    themeInput = { ...customTheme, name: themeName };
    themeKey = `custom:${themeName}:${JSON.stringify(customTheme).length}`;
  } else {
    if (!(themeId in bundledThemes)) throw new Error(`Unknown theme "${themeId}".`);
    themeInput = bundledThemes[themeId as keyof typeof bundledThemes];
    themeKey = themeId;
    themeName = themeId;
  }

  const hl = await highlighterFor(`${themeKey}|${useLang}`, themeInput, useLang);
  const { tokens, bg, fg } = hl.codeToTokens(code, { lang: useLang, theme: themeName });
  const colors = (hl.getTheme(themeName).colors ?? {}) as Record<string, string>;
  return { lines: tokens, bg: bg ?? "#000000", fg: fg ?? "#ffffff", colors, themeName };
}
