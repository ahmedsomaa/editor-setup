import samplePair from "../../../../registry/pairs/inconsolata--vitesse-dark.json";
import pairSubmitters from "@/data/pair-submitters.json";
import { MARQUEE_PAIRS } from "@/lib/marquee-pairs";

export type EditorId = "vscode" | "cursor" | "zed" | "neovim";
export type License = "open" | "free" | "paid";
export type Appearance = "dark" | "light";

export type Submitter = {
  name: string;
  url: string;
};

export type PairRecord = {
  slug: string;
  /** Set only when resolved from the merged PR (or git fallback) for a real Pair file. */
  submittedBy?: Submitter;
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
  editors: Array<{ id: EditorId; snapshot: string; settings: string }>;
};

const SUBMITTERS = pairSubmitters as Record<
  string,
  { name: string; url: string }
>;

const EDITOR_ROTATIONS: EditorId[][] = [
  ["vscode", "cursor"],
  ["zed", "vscode"],
  ["neovim", "vscode", "cursor"],
  ["cursor"],
  ["vscode", "zed", "neovim"],
  ["zed"],
  ["vscode", "cursor", "zed"],
  ["neovim", "cursor"],
];

const LICENSE_ROTATION: License[] = [
  "open",
  "open",
  "free",
  "open",
  "paid",
  "open",
  "free",
  "open",
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function appearanceFor(bg: string): Appearance {
  const hex = bg.replace("#", "");
  const n = Number.parseInt(
    hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex,
    16,
  );
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.55 ? "light" : "dark";
}

function submitterFor(slug: string): Submitter | undefined {
  const record = SUBMITTERS[slug];
  if (!record) return undefined;
  return { name: record.name, url: record.url };
}

/** Explore stubs for UI density — no fake submitters (not real Pair files). */
function demoFromMarquee(): PairRecord[] {
  return MARQUEE_PAIRS.map((pair, i) => {
    const fontSlug = slugify(pair.font);
    const themeSlug = slugify(pair.theme);
    const slug = `${fontSlug}--${themeSlug}`;
    const editors = (EDITOR_ROTATIONS[i] ?? ["vscode"]).map((id) => ({
      id,
      snapshot: `${slug}--${id}.png`,
      settings: `// ${pair.font} · ${pair.theme}`,
    }));
    const license = LICENSE_ROTATION[i] ?? "open";

    return {
      slug,
      font: {
        name: pair.font,
        links: ["#"],
        license,
        fontFamily: pair.fontFamily,
      },
      theme: {
        name: pair.theme,
        links: ["#"],
        license,
        appearance: appearanceFor(pair.bg),
        bg: pair.bg,
        fg: pair.fg,
      },
      editors,
    };
  });
}

const realPair: PairRecord = (() => {
  const pair = samplePair as {
    font: { name: string; links: string[]; license: string };
    theme: {
      name: string;
      links: string[];
      license: string;
      appearance: string;
    };
    editors: Array<{ id: string; snapshot: string; settings: string }>;
  };
  const slug = "inconsolata--vitesse-dark";
  return {
    slug,
    submittedBy: submitterFor(slug),
    font: {
      name: pair.font.name,
      links: pair.font.links,
      license: pair.font.license as License,
      fontFamily: '"Inconsolata", "IBM Plex Mono", ui-monospace, monospace',
    },
    theme: {
      name: pair.theme.name,
      links: pair.theme.links,
      license: pair.theme.license as License,
      appearance: pair.theme.appearance as Appearance,
      bg: "#121212",
      fg: "#bd976a",
    },
    editors: pair.editors.map((e) => ({
      id: e.id as EditorId,
      snapshot: e.snapshot,
      settings: e.settings,
    })),
  };
})();

/** Registry catalog: real Pair on main plus explore stubs for UI density. */
export function listPairs(): PairRecord[] {
  const all = [realPair, ...demoFromMarquee()];
  return all.sort((a, b) => {
    const byFont = a.font.name.localeCompare(b.font.name);
    return byFont !== 0 ? byFont : a.theme.name.localeCompare(b.theme.name);
  });
}

export function getPairBySlug(slug: string): PairRecord | undefined {
  return listPairs().find((pair) => pair.slug === slug);
}

export function getEditorConfig(
  pair: PairRecord,
  editorId: EditorId,
): PairRecord["editors"][number] | undefined {
  return pair.editors.find((editor) => editor.id === editorId);
}

/** Prefer requested Editor when it has a Config; otherwise first Config. */
export function resolveEditorId(
  pair: PairRecord,
  preferred?: EditorId | null,
): EditorId {
  if (preferred && getEditorConfig(pair, preferred)) return preferred;
  const first = pair.editors[0]?.id;
  if (!first) {
    throw new Error(`Pair ${pair.slug} has no Editor Config`);
  }
  return first;
}

export const EDITOR_LABELS: Record<EditorId, string> = {
  vscode: "VS Code",
  cursor: "Cursor",
  zed: "Zed",
  neovim: "Neovim",
};

export const LICENSE_LABELS: Record<License, string> = {
  open: "Open",
  free: "Free",
  paid: "Paid",
};

export function matchesLicenseFilter(
  pair: PairRecord,
  filter: "free" | License,
): boolean {
  if (filter === "free") {
    return pair.font.license !== "paid" && pair.theme.license !== "paid";
  }
  return pair.font.license === filter || pair.theme.license === filter;
}
