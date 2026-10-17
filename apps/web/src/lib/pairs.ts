
export const EDITOR_IDS = ["vscode", "cursor"] as const;
export type EditorId = (typeof EDITOR_IDS)[number];
export type License = "open" | "free";
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
};

export const LICENSE_LABELS: Record<License, string> = {
  open: "Open",
  free: "Free",
};

export function matchesLicenseFilter(
  pair: PairRecord,
  filter: License,
): boolean {
  return pair.font.license === filter || pair.theme.license === filter;
}

export type PairFilters = {
  q?: string;
  editor?: EditorId;
  appearance?: Appearance;
  license?: License;
};

/** Pure filter shared by the server function and tests. */
export function filterPairs(
  pairs: PairRecord[],
  { q, editor, appearance, license }: PairFilters,
): PairRecord[] {
  const needle = q?.trim().toLowerCase();
  return pairs.filter((pair) => {
    if (needle) {
      const hay =
        `${pair.font.name} ${pair.theme.name} ${pair.submittedBy?.name ?? ""}`.toLowerCase();
      if (!hay.includes(needle)) return false;
    }
    if (editor && !pair.editors.some((e) => e.id === editor)) return false;
    if (appearance && pair.theme.appearance !== appearance) return false;
    if (license && !matchesLicenseFilter(pair, license)) return false;
    return true;
  });
}

/** How a Pair is named in dropdowns: Theme · Font. */
export function pairLabel(pair: PairRecord): string {
  return `${pair.theme.name} · ${pair.font.name}`;
}
