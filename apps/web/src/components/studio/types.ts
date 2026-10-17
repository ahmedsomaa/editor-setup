import type { FontFace, SnapshotSearch } from "@/lib/studio/schemas";

/** Change the Studio's URL search params without adding history or scrolling. */
export type SetParam = (patch: Partial<SnapshotSearch>) => void;

/** Font files the visitor uploaded, with the name shown on the Snapshot. */
export type CustomFont = {
  name: string;
  faces: FontFace[];
  files: string[];
};
