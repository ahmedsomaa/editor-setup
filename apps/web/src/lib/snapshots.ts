/** Snapshot PNGs under registry/snapshots — keyed by filename from Pair Config. */
const snapshotModules = import.meta.glob(
  "../../../../registry/snapshots/*.png",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

const BY_FILENAME = new Map<string, string>();

for (const [path, url] of Object.entries(snapshotModules)) {
  const file = path.split("/").pop();
  if (file) BY_FILENAME.set(file, url);
}

/** URL for a Snapshot filename, or undefined when the file is not in the repo. */
export function snapshotUrl(filename: string): string | undefined {
  return BY_FILENAME.get(filename);
}

const thumbnailModules = import.meta.glob(
  "../../../../registry/thumbnails/*.png",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

const THUMBS = new Map<string, string>();

for (const [path, url] of Object.entries(thumbnailModules)) {
  const file = path.split("/").pop();
  if (file) THUMBS.set(file, url);
}

/** URL for a Thumbnail filename (400x225), or undefined when the file is not in the repo. */
export function thumbnailUrl(filename: string): string | undefined {
  return THUMBS.get(filename);
}
