import type { EditorId } from "@/lib/pairs";

export type TokenKind = "k" | "s" | "p";
export type CodeLine = ReadonlyArray<readonly [string, TokenKind]>;

type SnippetPair = { theme: string; font: string };

/** Illustrative Settings for the landing page; real Configs live in the Registry. */
export function settingsFor(
  editor: EditorId,
  { theme, font }: SnippetPair,
): { filename: string; lines: CodeLine[] } {
  if (editor === "zed") {
    return {
      filename: "settings.json",
      lines: [
        [["{", "p"]],
        [["  ", "p"], ['"buffer_font_family"', "k"], [": ", "p"], [`"${font}"`, "s"], [",", "p"]],
        [["  ", "p"], ['"buffer_font_size"', "k"], [": ", "p"], ["14", "s"], [",", "p"]],
        [["  ", "p"], ['"buffer_font_features"', "k"], [": ", "p"], ['{ "calt": true }', "s"], [",", "p"]],
        [["  ", "p"], ['"theme"', "k"], [": ", "p"], [`"${theme}"`, "s"]],
        [["}", "p"]],
      ],
    };
  }
  return {
    filename: "settings.json",
    lines: [
      [["{", "p"]],
      [["  ", "p"], ['"editor.fontFamily"', "k"], [": ", "p"], [`"${font}"`, "s"], [",", "p"]],
      [["  ", "p"], ['"editor.fontSize"', "k"], [": ", "p"], ["14", "s"], [",", "p"]],
      [["  ", "p"], ['"editor.fontLigatures"', "k"], [": ", "p"], ["true", "s"], [",", "p"]],
      [["  ", "p"], ['"workbench.colorTheme"', "k"], [": ", "p"], [`"${theme}"`, "s"]],
      [["}", "p"]],
    ],
  };
}
