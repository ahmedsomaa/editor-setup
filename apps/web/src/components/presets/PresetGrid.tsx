import { Link } from "@tanstack/react-router";
import { CompareToggle } from "@/components/compare/CompareToggle";
import { Reveal } from "@/components/layout/Reveal";
import {
  EDITOR_IDS,
  EDITOR_LABELS,
  presetLabel,
  type PresetRecord,
} from "@/lib/presets/presets";
import { SnapshotImage } from "@/components/common/SnapshotImage";
import { snapshotUrl } from "@/lib/presets/snapshots";

/** The Presets page as cards: each Preset's Snapshot above its Theme, Font and tags. */
export function PresetGrid({ presets }: { presets: PresetRecord[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
      {presets.map((preset, i) => (
        <Reveal
          as="li"
          index={i % 2}
          key={preset.slug}
          className="relative min-w-0"
        >
          <PresetCard preset={preset} />
          <CompareToggle
            slug={preset.slug}
            label={presetLabel(preset)}
            className="absolute end-3 top-3 z-10"
          />
        </Reveal>
      ))}
    </ul>
  );
}

function PresetCard({ preset }: { preset: PresetRecord }) {
  return (
    <Link
      to="/presets/$slug"
      params={{ slug: preset.slug }}
      className="lift border-border bg-card flex h-full flex-col overflow-hidden rounded-xl border no-underline"
    >
      <CardImage preset={preset} />
      <span className="flex flex-1 flex-col gap-3 p-4">
        <span className="min-w-0">
          <span className="block truncate font-medium" title={presetLabel(preset)}>
            {presetLabel(preset)}
          </span>
          {preset.submittedBy ? (
            <span className="text-muted-foreground block truncate font-sans text-sm">
              by {preset.submittedBy.name}
            </span>
          ) : null}
        </span>
        <span className="mt-auto flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {preset.editors
              .filter((e) => EDITOR_IDS.includes(e.id))
              .map((e) => EDITOR_LABELS[e.id])
              .join(", ")}
          </span>
        </span>
      </span>
    </Link>
  );
}

/** The Preset's Snapshot, window only; an "Aa" tile in the Preset's colours until one exists. */
function CardImage({ preset }: { preset: PresetRecord }) {
  const src = snapshotUrl(preset.snapshot);
  return src ? (
    <SnapshotImage
      src={src}
      alt=""
      loading="lazy"
      bare
      className="border-border border-b"
    />
  ) : (
    <span
      aria-hidden
      className="flex items-center justify-center text-2xl"
      style={{
        aspectRatio: "16 / 9",
        background: preset.theme.bg,
        color: preset.theme.fg,
        fontFamily: preset.font.fontFamily,
      }}
    >
      Aa
    </span>
  );
}
