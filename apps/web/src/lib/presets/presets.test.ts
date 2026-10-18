import { describe, expect, test } from "bun:test";
import {
  filterPresets,
  getEditorConfig,
  resolveEditorId,
} from "@/lib/presets/presets";
import { mock } from "bun:test";
import fira from "../../../../../presets/fira-code--palenight-theme.json";
import geistAura from "../../../../../presets/geist-mono--aura-dark.json";
import geistVesper from "../../../../../presets/geist-mono--vesper.json";
import inconsolata from "../../../../../presets/inconsolata--vitesse-dark.json";
import jetbrains from "../../../../../presets/jetbrains-mono--gruvbox-dark-hard.json";
import zed from "../../../../../presets/zed-mono--gruvbox-light-hard.json";

// import.meta.glob only exists under Vite, so feed the Presets in by hand here.
mock.module("../../server/presets-files", () => ({
  PRESET_FILES: {
    "x/fira-code--palenight-theme.json": fira,
    "x/geist-mono--aura-dark.json": geistAura,
    "x/geist-mono--vesper.json": geistVesper,
    "x/inconsolata--vitesse-dark.json": inconsolata,
    "x/jetbrains-mono--gruvbox-dark-hard.json": jetbrains,
    "x/zed-mono--gruvbox-light-hard.json": zed,
  },
}));
const { getPresetBySlug, listPresets, relatedPresets } = await import("../../server/presets.server");

describe("listPresets", () => {
  test("includes the real Preset from the repository", () => {
    const slugs = listPresets().map((p) => p.slug);
    expect(slugs).toContain("inconsolata--vitesse-dark");
  });

  test("orders by Font name then Theme name", () => {
    const presets = listPresets();
    for (let i = 1; i < presets.length; i++) {
      const prev = presets[i - 1]!;
      const curr = presets[i]!;
      const cmp = prev.font.name.localeCompare(curr.font.name);
      if (cmp === 0) {
        expect(prev.theme.name.localeCompare(curr.theme.name)).toBeLessThanOrEqual(
          0,
        );
      } else {
        expect(cmp).toBeLessThanOrEqual(0);
      }
    }
  });
});

describe("getPresetBySlug", () => {
  test("returns the Preset for a known slug", () => {
    const preset = getPresetBySlug("inconsolata--vitesse-dark");
    expect(preset?.font.name).toBe("Inconsolata");
    expect(preset?.theme.name).toBe("Vitesse Dark");
    expect(preset?.theme.appearance).toBe("dark");
  });

  test("returns undefined for an unknown slug", () => {
    expect(getPresetBySlug("missing--preset")).toBeUndefined();
  });
});

describe("getEditorConfig / resolveEditorId", () => {
  const preset = getPresetBySlug("inconsolata--vitesse-dark")!;
  const vscodeOnly = { ...preset, editors: preset.editors.filter((e) => e.id === "vscode") };

  test("returns the Config for vscode", () => {
    const config = getEditorConfig(preset, "vscode");
    expect(config?.id).toBe("vscode");
    expect(config?.settings.length).toBeGreaterThan(0);
    expect(preset.snapshot).toBe("inconsolata--vitesse-dark.png");
  });

  test("returns undefined when the Preset has no Config for that Editor", () => {
    expect(getEditorConfig(vscodeOnly, "zed")).toBeUndefined();
  });

  test("resolveEditorId prefers a Config that exists", () => {
    expect(resolveEditorId(preset, "zed")).toBe("zed");
    expect(resolveEditorId(preset, "vscode")).toBe("vscode");
  });

  test("resolveEditorId falls back when preferred has no Config", () => {
    expect(resolveEditorId(vscodeOnly, "zed")).toBe("vscode");
  });
});

describe("filterPresets", () => {
  test("no filters returns every Preset", () => {
    expect(filterPresets(listPresets(), {})).toHaveLength(listPresets().length);
  });

  test("q matches Font or Theme name, case-insensitive", () => {
    const hits = filterPresets(listPresets(), { q: "VITESSE" });
    expect(hits.map((p) => p.slug)).toContain("inconsolata--vitesse-dark");
  });

  test("appearance narrows by Theme appearance", () => {
    const light = filterPresets(listPresets(), { appearance: "light" });
    expect(light.every((p) => p.theme.appearance === "light")).toBe(true);
  });
});

describe("relatedPresets", () => {
  test("never includes the Preset itself", () => {
    const slug = "inconsolata--vitesse-dark";
    expect(relatedPresets(slug).map((p) => p.slug)).not.toContain(slug);
  });

  test("returns nothing for an unknown slug", () => {
    expect(relatedPresets("missing")).toEqual([]);
  });
});
