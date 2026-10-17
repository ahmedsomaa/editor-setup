import { describe, expect, test } from "bun:test";
import { fitTitle, HOME_DESCRIPTION, HOME_TITLE, pageHead } from "./page-head";

const inRange = (s: string, min: number, max: number) => s.length >= min && s.length <= max;

describe("pageHead", () => {
  test("ties og:url and the canonical link to one absolute URL", () => {
    const { meta, links } = pageHead({ path: "/registry", title: "t", description: "d" });
    const ogUrl = meta.find((m) => "property" in m && m.property === "og:url");
    expect(ogUrl && "content" in ogUrl ? ogUrl.content : "").toBe(links[0]!.href);
    expect(links[0]!.href).toBe("https://editorsetup.som3aware.workers.dev/registry");
  });
});

describe("fitTitle", () => {
  test("prefers a candidate inside 50 to 60 characters", () => {
    const fit = "x".repeat(55);
    expect(fitTitle(["x".repeat(30), fit, "x".repeat(70)])).toBe(fit);
  });

  test("falls back to the closest candidate", () => {
    const close = "x".repeat(48);
    expect(fitTitle(["x".repeat(20), close])).toBe(close);
  });
});

test("the home title and description fit link-preview ranges", () => {
  expect(inRange(HOME_TITLE, 50, 60)).toBe(true);
  expect(inRange(HOME_DESCRIPTION, 120, 160)).toBe(true);
});
