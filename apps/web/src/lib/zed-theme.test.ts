import { expect, test } from "bun:test";
import { zedToVscodeTheme, zedVariants } from "./zed-theme";

const family = {
  name: "Fam",
  themes: [
    {
      name: "Fam Light",
      appearance: "light",
      style: {
        "editor.background": "#fff",
        text: "#111",
        players: [{ cursor: "#00f", selection: "#00f3" }],
        syntax: {
          comment: { color: "#999", font_style: "italic", font_weight: null },
          keyword: { color: "#f00", font_weight: 700 },
          string: null,
        },
      },
    },
  ],
};

test("converts the first Zed theme into a VS Code theme", () => {
  const t = zedToVscodeTheme(family) as any;
  expect(t.name).toBe("Fam Light");
  expect(t.type).toBe("light");
  expect(t.colors["editor.background"]).toBe("#fff");
  expect(t.colors["editor.foreground"]).toBe("#111");
  expect(t.colors["editorCursor.foreground"]).toBe("#00f");
  const comment = t.tokenColors.find((x: any) => x.name === "comment");
  expect(comment.settings).toEqual({ foreground: "#999", fontStyle: "italic" });
  expect(t.tokenColors.find((x: any) => x.name === "keyword").settings.fontStyle).toBe("bold");
  expect(t.tokenColors.find((x: any) => x.name === "string")).toBeUndefined();
});

test("picks a theme by name and falls back to the first", () => {
  const two = {
    themes: [
      { name: "A", appearance: "dark", style: {} },
      { name: "B", appearance: "light", style: {} },
    ],
  };
  expect(zedVariants(two)).toEqual(["A", "B"]);
  expect((zedToVscodeTheme(two, "B") as any).type).toBe("light");
  expect((zedToVscodeTheme(two, "nope") as any).name).toBe("A");
});
