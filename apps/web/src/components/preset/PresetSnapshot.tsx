import { SnapshotImage } from "@/components/common/SnapshotImage";
import { PresetWindow, textToLines } from "@/components/presets/PresetWindow";
import type { EditorConfig, PresetRecord } from "@/lib/presets/presets";
import { snapshotUrl } from "@/lib/presets/snapshots";

/** The Preset's Snapshot, or a window painted in its colours until one exists. */
export function PresetSnapshot({
  preset,
  config,
}: {
  preset: PresetRecord;
  config: EditorConfig;
}) {
  const snap = snapshotUrl(preset.snapshot);
  return (
    <div id="snapshot" className="mt-10 min-w-0 scroll-mt-32">
      <figure className="min-w-0">
        {snap ? (
          <SnapshotImage
            src={snap}
            alt={`Snapshot of ${preset.font.name} and ${preset.theme.name}`}
            className="rounded-xl"
          />
        ) : (
          <PresetWindow
            preset={{
              fontFamily: preset.font.fontFamily,
              bg: preset.theme.bg,
              fg: preset.theme.fg,
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
