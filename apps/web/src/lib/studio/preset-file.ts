import type { Appearance, EditorId } from "@/lib/presets/presets";

/** Left empty or spelled out so `bun run check` fails until the author fills it in. */
const FILL_LICENSE = "open or free";

export type PresetDraftInput = {
  editor: EditorId;
  font: { name: string; /** From the Studio's Font list, which only holds Open fonts. */ listed: boolean };
  theme: { name: string; appearance: Appearance; url?: string };
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The file name both downloads share: the Preset file and its Snapshot differ only by extension. */
export function presetStem(fontName: string, themeName: string) {
  return `${slugify(fontName)}--${slugify(themeName)}`;
}

/** Plain-text Settings for one Editor, in the same shape the Presets in the repository use. */
export function settingsText(editor: EditorId, fontName: string, themeName: string): string {
  const body =
    editor === "zed"
      ? {
          buffer_font_family: fontName,
          buffer_font_size: 14,
          buffer_font_weight: 400,
          buffer_line_height: { custom: 1.5 },
          buffer_font_features: { calt: true },
          theme: themeName,
        }
      : {
          "editor.fontFamily": fontName,
          "editor.fontSize": 14,
          "editor.fontWeight": "400",
          "editor.lineHeight": 1.5,
          "editor.fontLigatures": true,
          "workbench.colorTheme": themeName,
        };
  return JSON.stringify(body, null, 2);
}

/**
 * A draft Preset file from what the Studio knows. What it cannot know (the author, links and
 * Licenses it has no source for) is left blank, so the Preset check fails until it is filled in.
 */
export function buildPresetDraft({ editor, font, theme }: PresetDraftInput): string {
  const file = {
    font: {
      name: font.name,
      links: [""],
      license: font.listed ? "open" : FILL_LICENSE,
    },
    theme: {
      name: theme.name,
      links: [theme.url ?? ""],
      license: FILL_LICENSE,
      appearance: theme.appearance,
    },
    author: { name: "" },
    snapshot: `${presetStem(font.name, theme.name)}.png`,
    editors: [{ id: editor, settings: settingsText(editor, font.name, theme.name) }],
  };
  return `${JSON.stringify(file, null, 2)}\n`;
}
