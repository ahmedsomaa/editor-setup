
export const EDITOR_IDS = ["vscode", "zed"] as const;
export type EditorId = (typeof EDITOR_IDS)[number];
export type License = "open" | "free";
export type Appearance = "dark" | "light";

/** Who made the Preset, as written in its file. The link is optional. */
export type Author = {
  name: string;
  url?: string;
};

/** The Settings text for one Editor. */
export type EditorConfig = { id: EditorId; settings: string };

export type PresetRecord = {
  slug: string;
  /** Set only when resolved from the merged PR (or git fallback) for a real Preset file. */
  author: Author;
  font: {
    name: string;
    links: string[];
    license: License;
    fontFamily: string;
  };
  theme: {
    name: string;
    links: string[];
    license: License;
    appearance: Appearance;
    bg: string;
    fg: string;
  };
  /** Filename under presets/snapshots. One image for the Preset, whatever the Editor. */
  snapshot: string;
  editors: EditorConfig[];
};

export function getEditorConfig(
  preset: PresetRecord,
  editorId: EditorId,
): EditorConfig | undefined {
  return preset.editors.find((editor) => editor.id === editorId);
}

/** Prefer requested Editor when it has a Config; otherwise first Config. */
export function resolveEditorId(
  preset: PresetRecord,
  preferred?: EditorId | null,
): EditorId {
  if (preferred && getEditorConfig(preset, preferred)) return preferred;
  const first = preset.editors[0]?.id;
  if (!first) {
    throw new Error(`Preset ${preset.slug} has no Editor Config`);
  }
  return first;
}

export const EDITOR_LABELS: Record<EditorId, string> = {
  vscode: "VS Code",
  zed: "Zed",
};

export const LICENSE_LABELS: Record<License, string> = {
  open: "Open",
  free: "Free",
};

export type PresetFilters = {
  q?: string;
  editor?: EditorId;
  appearance?: Appearance;
};

/** Pure filter shared by the server function and tests. */
export function filterPresets(
  presets: PresetRecord[],
  { q, editor, appearance }: PresetFilters,
): PresetRecord[] {
  const needle = q?.trim().toLowerCase();
  return presets.filter((preset) => {
    if (needle) {
      const hay =
        `${preset.font.name} ${preset.theme.name} ${preset.author.name}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    if (editor && !preset.editors.some((e) => e.id === editor)) return false;
    if (appearance && preset.theme.appearance !== appearance) return false;
    return true;
  });
}

/** How a Preset is named in dropdowns: Theme · Font. */
export function presetLabel(preset: PresetRecord): string {
  return `${preset.theme.name} · ${preset.font.name}`;
}
