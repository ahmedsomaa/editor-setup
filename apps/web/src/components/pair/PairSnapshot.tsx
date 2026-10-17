import { SnapshotImage } from "@/components/common/SnapshotImage";
import { PairWindow, textToLines } from "@/components/registry/PairWindow";
import type { EditorConfig, PairRecord } from "@/lib/registry/pairs";
import { snapshotUrl } from "@/lib/registry/snapshots";

/** The Pair's Snapshot, or a window painted in its colours until one exists. */
export function PairSnapshot({
  pair,
  config,
}: {
  pair: PairRecord;
  config: EditorConfig;
}) {
  const snap = snapshotUrl(pair.snapshot);
  return (
    <div id="snapshot" className="mt-10 min-w-0 scroll-mt-32">
      <figure className="min-w-0">
        {snap ? (
          <SnapshotImage
            src={snap}
            alt={`Snapshot of ${pair.font.name} and ${pair.theme.name}`}
            className="rounded-xl"
          />
        ) : (
          <PairWindow
            pair={{
              fontFamily: pair.font.fontFamily,
              bg: pair.theme.bg,
              fg: pair.theme.fg,
            }}
            filename="settings.json"
            lines={textToLines(config.settings)}
          />
        )}
        <figcaption className="text-muted-foreground mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
          <span>{snap ? "Snapshot" : "Preview"}</span>
          {snap ? (
            <a
              href={snap}
              target="_blank"
              rel="noreferrer"
              className="text-foreground font-medium underline hover:no-underline"
            >
              Open full size
            </a>
          ) : null}
        </figcaption>
      </figure>
    </div>
  );
}
