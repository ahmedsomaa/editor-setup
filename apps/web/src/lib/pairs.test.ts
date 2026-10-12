import { describe, expect, test } from "bun:test";
import {
  getEditorConfig,
  getPairBySlug,
  listPairs,
  matchesLicenseFilter,
  resolveEditorId,
} from "./pairs";

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

  test("returns the Config for vscode", () => {
    const config = getEditorConfig(pair, "vscode");
    expect(config?.id).toBe("vscode");
    expect(config?.settings.length).toBeGreaterThan(0);
    expect(config?.snapshot).toBe("inconsolata--vitesse-dark--vscode.png");
  });

  test("returns undefined when the Pair has no Config for that Editor", () => {
    expect(getEditorConfig(pair, "neovim")).toBeUndefined();
  });

  test("resolveEditorId prefers a Config that exists", () => {
    expect(resolveEditorId(pair, "vscode")).toBe("vscode");
  });

  test("resolveEditorId falls back when preferred has no Config", () => {
    expect(resolveEditorId(pair, "neovim")).toBe("vscode");
  });
});

describe("matchesLicenseFilter", () => {
  const pair = getPairBySlug("inconsolata--vitesse-dark")!;

  test("free includes open licenses", () => {
    expect(matchesLicenseFilter(pair, "free")).toBe(true);
    expect(matchesLicenseFilter(pair, "open")).toBe(true);
    expect(matchesLicenseFilter(pair, "paid")).toBe(false);
  });
});
