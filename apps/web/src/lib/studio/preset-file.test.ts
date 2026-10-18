import { describe, expect, test } from "bun:test";
import { buildPresetDraft, presetStem, settingsText } from "@/lib/studio/preset-file";

const input = {
  editor: "zed" as const,
  font: { name: "Geist Mono", listed: true },
  theme: { name: "Vesper", appearance: "dark" as const },
};

describe("presetStem", () => {
  test("joins the slugged Font and Theme, like the repository's file names", () => {
    expect(presetStem("Geist Mono", "Gruvbox Dark Hard")).toBe("geist-mono--gruvbox-dark-hard");
  });
});

describe("settingsText", () => {
  test("is plain JSON text for the chosen Editor", () => {
    const zed = JSON.parse(settingsText("zed", "Geist Mono", "Vesper"));
    expect(zed.buffer_font_family).toBe("Geist Mono");
    expect(zed.theme).toBe("Vesper");
    const code = JSON.parse(settingsText("vscode", "Geist Mono", "Vesper"));
    expect(code["editor.fontFamily"]).toBe("Geist Mono");
    expect(code["workbench.colorTheme"]).toBe("Vesper");
  });
});

describe("buildPresetDraft", () => {
  test("fills what the Studio knows and leaves the rest blank", () => {
    const draft = JSON.parse(buildPresetDraft(input));
    expect(draft.snapshot).toBe("geist-mono--vesper.png");
    expect(draft.theme.appearance).toBe("dark");
    expect(draft.font.license).toBe("open");
    expect(draft.editors).toHaveLength(1);
    expect(draft.editors[0].id).toBe("zed");
    expect(draft.author.name).toBe("");
    expect(draft.font.links).toEqual([""]);
    expect(draft.theme.links).toEqual([""]);
  });

  test("does not guess the License of an uploaded font or a Theme", () => {
    const draft = JSON.parse(buildPresetDraft({ ...input, font: { name: "My Font", listed: false } }));
    expect(draft.font.license).toBe("open or free");
    expect(draft.theme.license).toBe("open or free");
  });

  test("uses the Theme file's link when there is one", () => {
    const draft = JSON.parse(
      buildPresetDraft({ ...input, theme: { ...input.theme, url: "https://example.com/vesper.json" } }),
    );
    expect(draft.theme.links).toEqual(["https://example.com/vesper.json"]);
  });
});
