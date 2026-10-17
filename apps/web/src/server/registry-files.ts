import type { Appearance, EditorId, License } from "@/lib/registry/pairs";

export type PairFile = {
  font: { name: string; links: string[]; license: License };
  theme: { name: string; links: string[]; license: License; appearance: Appearance };
  snapshot: string;
  editors: Array<{ id: EditorId; settings: string }>;
};

/** Every registry/pairs/*.json, bundled at build time. Split out so tests can replace it. */
export const PAIR_FILES = import.meta.glob("../../../../registry/pairs/*.json", {
  eager: true,
  import: "default",
}) as Record<string, PairFile>;
