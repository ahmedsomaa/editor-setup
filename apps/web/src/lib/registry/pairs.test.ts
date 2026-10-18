import { describe, expect, test } from "bun:test";
import {
  filterPairs,
  getEditorConfig,
  resolveEditorId,
} from "@/lib/registry/pairs";
import { mock } from "bun:test";
import fira from "../../../../../registry/pairs/fira-code--palenight-theme.json";
import geistAura from "../../../../../registry/pairs/geist-mono--aura-dark.json";
import geistVesper from "../../../../../registry/pairs/geist-mono--vesper.json";
import inconsolata from "../../../../../registry/pairs/inconsolata--vitesse-dark.json";
import jetbrains from "../../../../../registry/pairs/jetbrains-mono--gruvbox-dark-hard.json";
import zed from "../../../../../registry/pairs/zed-mono--gruvbox-light-hard.json";

// import.meta.glob only exists under Vite, so feed the registry in by hand here.
mock.module("../../server/registry-files", () => ({
  PAIR_FILES: {
    "x/fira-code--palenight-theme.json": fira,
    "x/geist-mono--aura-dark.json": geistAura,
    "x/geist-mono--vesper.json": geistVesper,
    "x/inconsolata--vitesse-dark.json": inconsolata,
    "x/jetbrains-mono--gruvbox-dark-hard.json": jetbrains,
    "x/zed-mono--gruvbox-light-hard.json": zed,
  },
}));
const { getPairBySlug, listPairs, relatedPairs } = await import("../../server/registry.server");

describe("listPairs", () => {
  test("includes the real Pair from the registry", () => {
    const slugs = listPairs().map((p) => p.slug);
    expect(slugs).toContain("inconsolata--vitesse-dark");
  });

  test("orders by Font name then Theme name", () => {
    const pairs = listPairs();
    for (let i = 1; i < pairs.length; i++) {
      const prev = pairs[i - 1]!;
      const curr = pairs[i]!;
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

describe("getPairBySlug", () => {
  test("returns the Pair for a known slug", () => {
    const pair = getPairBySlug("inconsolata--vitesse-dark");
    expect(pair?.font.name).toBe("Inconsolata");
    expect(pair?.theme.name).toBe("Vitesse Dark");
    expect(pair?.theme.appearance).toBe("dark");
  });

  test("returns undefined for an unknown slug", () => {
    expect(getPairBySlug("missing--pair")).toBeUndefined();
  });
});

describe("getEditorConfig / resolveEditorId", () => {
  const pair = getPairBySlug("inconsolata--vitesse-dark")!;
  const vscodeOnly = { ...pair, editors: pair.editors.filter((e) => e.id === "vscode") };

  test("returns the Config for vscode", () => {
    const config = getEditorConfig(pair, "vscode");
    expect(config?.id).toBe("vscode");
    expect(config?.settings.length).toBeGreaterThan(0);
    expect(pair.snapshot).toBe("inconsolata--vitesse-dark.png");
  });

  test("returns undefined when the Pair has no Config for that Editor", () => {
    expect(getEditorConfig(vscodeOnly, "zed")).toBeUndefined();
  });

  test("resolveEditorId prefers a Config that exists", () => {
    expect(resolveEditorId(pair, "zed")).toBe("zed");
    expect(resolveEditorId(pair, "vscode")).toBe("vscode");
  });

  test("resolveEditorId falls back when preferred has no Config", () => {
    expect(resolveEditorId(vscodeOnly, "zed")).toBe("vscode");
  });
});

describe("filterPairs", () => {
  test("no filters returns every Pair", () => {
    expect(filterPairs(listPairs(), {})).toHaveLength(listPairs().length);
  });

  test("q matches Font or Theme name, case-insensitive", () => {
    const hits = filterPairs(listPairs(), { q: "VITESSE" });
    expect(hits.map((p) => p.slug)).toContain("inconsolata--vitesse-dark");
  });

  test("appearance narrows by Theme appearance", () => {
    const light = filterPairs(listPairs(), { appearance: "light" });
    expect(light.every((p) => p.theme.appearance === "light")).toBe(true);
  });
});

describe("relatedPairs", () => {
  test("never includes the Pair itself", () => {
    const slug = "inconsolata--vitesse-dark";
    expect(relatedPairs(slug).map((p) => p.slug)).not.toContain(slug);
  });

  test("returns nothing for an unknown slug", () => {
    expect(relatedPairs("missing")).toEqual([]);
  });
});
