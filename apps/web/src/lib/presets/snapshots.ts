/** Snapshot PNGs under presets/snapshots — keyed by filename from Preset Config. */
const snapshotModules = import.meta.glob(
  "../../../../../presets/snapshots/*.png",
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
