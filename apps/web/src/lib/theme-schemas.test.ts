import { describe, expect, test } from "bun:test";
import { checkThemeShape } from "./theme-schemas";

describe("checkThemeShape", () => {
  test("accepts a VS Code theme and ignores unknown keys", () => {
    const theme = { colors: { "editor.background": "#000" }, tokenColors: [{ scope: ["a"], settings: {} }], extra: 1 };
    expect(checkThemeShape("vscode", theme)).toBeNull();
  });

  test("rejects a VS Code theme with broken shape", () => {
    expect(checkThemeShape("vscode", { name: "x" })).toContain("not a VS Code theme");
    expect(checkThemeShape("vscode", { colors: [] })).toContain('"colors"');
    expect(checkThemeShape("vscode", { tokenColors: "a.tmTheme" })).toContain('"tokenColors"');
  });

  test("accepts a Zed theme family", () => {
    const theme = { name: "F", themes: [{ name: "T", appearance: "dark", style: { syntax: {} } }] };
    expect(checkThemeShape("zed", theme)).toBeNull();
  });

  test("rejects a Zed theme with broken shape", () => {
    expect(checkThemeShape("zed", { colors: {} })).toContain("not a Zed theme");
    expect(checkThemeShape("zed", { themes: [] })).toContain('"themes"');
    expect(checkThemeShape("zed", { themes: [{ name: "T", appearance: "dim", style: {} }] })).toContain("appearance");
  });
});
