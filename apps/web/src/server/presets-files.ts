import type { Appearance, EditorId, License } from "@/lib/presets/presets";

export type PresetFile = {
  font: { name: string; links: string[]; license: License };
  theme: { name: string; links: string[]; license: License; appearance: Appearance };
  author: { name: string; url?: string };
  contributors?: Array<{ name: string; url?: string; editors: EditorId[] }>;
  snapshot: string;
  editors: Array<{ id: EditorId; settings: string }>;
};

/** Every presets/*.json, bundled at build time. Split out so tests can replace it. */
export const PRESET_FILES = import.meta.glob("../../../../presets/*.json", {
  eager: true,
  import: "default",
}) as Record<string, PresetFile>;
