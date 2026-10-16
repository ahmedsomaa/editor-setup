import type { EditorId } from "@/lib/pairs";

export type TokenKind = "k" | "s" | "p";
export type CodeLine = ReadonlyArray<readonly [string, TokenKind]>;

type SnippetPair = { theme: string; font: string };

/** Illustrative Settings for the landing page; real Configs live in the Registry. */
export function settingsFor(
  editor: EditorId,
  { theme, font }: SnippetPair,
): { filename: string; lines: CodeLine[] } {
  if (editor === "neovim") {
    return {
      filename: "init.lua",
      lines: [
        [[`-- the terminal sets the Font: ${font}`, "p"]],
        [
          ["vim.cmd.colorscheme(", "k"],
          [`"${theme.toLowerCase().replace(/\s+/g, "-")}"`, "s"],
          [")", "k"],
        ],
      ],
    };
  }

  if (editor === "zed") {
    return {
      filename: "settings.json",
      lines: [
        [["{", "p"]],
        [["  ", "p"], ['"buffer_font_family"', "k"], [": ", "p"], [`"${font}"`, "s"], [",", "p"]],
        [["  ", "p"], ['"buffer_font_size"', "k"], [": ", "p"], ["14", "s"], [",", "p"]],
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

export function linesToText(lines: CodeLine[]): string {
  return lines.map((l) => l.map(([t]) => t).join("")).join("\n");
}

/** Perceived brightness of a #rrggbb colour, 0-255. */
export function isDarkHex(hex: string): boolean {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
}
