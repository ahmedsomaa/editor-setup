import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { PresetWindow, textToLines } from "@/components/presets/PresetWindow";
import { AppearanceTag, PresetLicenseTag } from "@/components/common/Tag";
import { EDITOR_LABELS, type PresetRecord } from "@/lib/presets/presets";
import { SnapshotImage } from "@/components/common/SnapshotImage";
import { snapshotUrl } from "@/lib/presets/snapshots";
import { cn } from "cn";

/**
 * The Presets page as an index: one row per Preset, and a window beside it that
 * repaints in the colours and Font of whichever row you point at or focus.
 */
export function Directory({
  presets,
  preview = true,
  activeSlug: controlled,
  onActiveChange,
}: {
  presets: PresetRecord[];
  preview?: boolean;
  /** Lets a parent mirror the active row, for instance in a heading. */
  activeSlug?: string | null;
  onActiveChange?: (slug: string) => void;
}) {
  const [inner, setInner] = useState<string | null>(null);
  const activeSlug = controlled ?? inner;
  const setActiveSlug = (slug: string) => {
    setInner(slug);
    onActiveChange?.(slug);
  };
  const active = presets.find((p) => p.slug === activeSlug) ?? presets[0];

  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)] gap-10",
        preview && "lg:grid-cols-[minmax(0,1fr)_25rem]",
      )}
    >
      <ul className="border-border m-0 list-none border-t p-0">
        {presets.map((preset) => (
          <li key={preset.slug} className="border-border border-b">
            <Link
              to="/presets/$slug"
              params={{ slug: preset.slug }}
              onMouseEnter={() => setActiveSlug(preset.slug)}
              onFocus={() => setActiveSlug(preset.slug)}
              className={cn(
                "grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 px-2 py-3 no-underline transition-colors duration-150 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:px-3",
                preset.slug === active?.slug ? "bg-muted" : "hover:bg-muted",
              )}
            >
              <CardImage preset={preset} />
              <span className="min-w-0">
                <span
                  className="block truncate font-medium"
                  title={preset.theme.name}
                >
                  {preset.theme.name}
                </span>
                <span
                  className="text-muted-foreground block truncate text-sm"
                  title={preset.font.name}
                >
                  {preset.font.name}
                </span>
              </span>
              <span className="col-start-2 flex flex-wrap items-center gap-2 sm:col-start-3 sm:justify-end">
                <span className="text-muted-foreground hidden text-xs md:inline">
                  {preset.editors.map((e) => EDITOR_LABELS[e.id]).join(", ")}
                </span>
                <AppearanceTag appearance={preset.theme.appearance} />
                <PresetLicenseTag
                  font={preset.font.license}
                  theme={preset.theme.license}
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {active && preview ? (
        <div className="hidden lg:block" aria-hidden>
          <div className="sticky top-24">
            {snapshotUrl(active.snapshot) ? (
              <SnapshotImage
                src={snapshotUrl(active.snapshot) ?? ""}
                alt=""
                className="rounded-xl"
              />
            ) : (
              <PresetWindow
                preset={{
                  fontFamily: active.font.fontFamily,
                  bg: active.theme.bg,
                  fg: active.theme.fg,
                }}
                filename="settings.json"
                lines={textToLines(active.editors[0]?.settings ?? "")}
              />
            )}
            <p className="text-muted-foreground mt-3 text-sm">
              {active.theme.name} with {active.font.name}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** The Preset's Snapshot, window only; falls back to an "Aa" chip in the Preset's colours until one exists. */
function CardImage({ preset }: { preset: PresetRecord }) {
  const src = snapshotUrl(preset.snapshot);
  return src ? (
    <SnapshotImage
      src={src}
      alt=""
      loading="lazy"
      className="row-span-2 w-20 rounded-md sm:row-span-1"
    />
  ) : (
    <span
      aria-hidden
      className="row-span-2 flex w-20 items-center justify-center rounded-md text-sm sm:row-span-1"
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
