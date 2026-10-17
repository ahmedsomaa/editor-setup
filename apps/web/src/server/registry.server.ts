import "@tanstack/react-start/server-only";
import pairSubmitters from "@/data/pair-submitters.json";
import { PAIR_FILES } from "./registry-files";
import { MARQUEE_PAIRS } from "@/lib/registry/marquee-pairs";
import type { PairRecord, Submitter } from "@/lib/registry/pairs";

/**
 * Registry data. Server only: the Pair JSON and submitter map stay out of the
 * client bundle. Everything is bundled at build time, so it runs unchanged on Workers.
 * The list is built by scanning registry/pairs/*.json, as the contribution guide says.
 */

const SUBMITTERS = pairSubmitters as Record<string, { name: string; url: string }>;

import type { PairFile } from "./registry-files";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Colours and font stack used to paint a Pair on the site; the Pair JSON does not carry them. */
const STYLES = new Map<string, { fontFamily: string; bg: string; fg: string }>([
  [
    "inconsolata--vitesse-dark",
    { fontFamily: '"Inconsolata", "IBM Plex Mono", ui-monospace, monospace', bg: "#121212", fg: "#bd976a" },
  ],
  [
    "inconsolata--vitesse-light",
    { fontFamily: '"Inconsolata", "IBM Plex Mono", ui-monospace, monospace', bg: "#ffffff", fg: "#393a34" },
  ],
  ...MARQUEE_PAIRS.map(
    (p) => [`${slugify(p.font)}--${slugify(p.theme)}`, { fontFamily: p.fontFamily, bg: p.bg, fg: p.fg }] as const,
  ),
]);

const FALLBACK_STYLE = {
  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
  bg: "#1e1e1e",
  fg: "#d4d4d4",
};

function submitterFor(slug: string): Submitter | undefined {
  const record = SUBMITTERS[slug];
  return record ? { name: record.name, url: record.url } : undefined;
}

function toRecord(path: string, file: PairFile): PairRecord {
  const slug = path.split("/").pop()!.replace(/\.json$/, "");
  const style = STYLES.get(slug) ?? FALLBACK_STYLE;
  return {
    slug,
    submittedBy: submitterFor(slug),
    font: { name: file.font.name, links: file.font.links, license: file.font.license, fontFamily: style.fontFamily },
    theme: {
      name: file.theme.name,
      links: file.theme.links,
      license: file.theme.license,
      appearance: file.theme.appearance,
      bg: style.bg,
      fg: style.fg,
    },
    snapshot: file.snapshot,
    editors: file.editors.map((e) => ({ id: e.id, settings: e.settings })),
  };
}

const ALL: PairRecord[] = Object.entries(PAIR_FILES).map(([path, file]) => toRecord(path, file));

/** Registry catalog: every Pair file on main. */
export function listPairs(): PairRecord[] {
  return [...ALL].sort((a, b) => {
    const byFont = a.font.name.localeCompare(b.font.name);
    return byFont !== 0 ? byFont : a.theme.name.localeCompare(b.theme.name);
  });
}

export function getPairBySlug(slug: string): PairRecord | undefined {
  return listPairs().find((pair) => pair.slug === slug);
}

/** Same Font or Theme first, then same Appearance; never the Pair itself. */
export function relatedPairs(slug: string, limit = 3): PairRecord[] {
  const all = listPairs();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];
  const others = all.filter((p) => p.slug !== slug);
  const score = (p: PairRecord) =>
    (p.font.name === current.font.name || p.theme.name === current.theme.name
      ? 2
      : 0) + (p.theme.appearance === current.theme.appearance ? 1 : 0);
  return others
    .map((p) => [score(p), p] as const)
    .filter(([n]) => n > 0)
    .sort((a, b) => b[0] - a[0])
    .slice(0, limit)
    .map(([, p]) => p);
}
