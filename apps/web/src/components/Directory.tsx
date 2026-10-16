import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { PairWindow, textToLines } from "@/components/PairWindow";
import { Tag } from "@/components/Tag";
import { EDITOR_LABELS, LICENSE_LABELS, isPaid, type PairRecord } from "@/lib/pairs";
import { snapshotUrl, thumbnailUrl } from "@/lib/snapshots";
import { cn } from "cn";

/**
 * The Registry as an index: one row per Pair, and a window beside it that
 * repaints in the colours and Font of whichever row you point at or focus.
 */
export function Directory({
  pairs,
  preview = true,
  activeSlug: controlled,
  onActiveChange,
}: {
  pairs: PairRecord[];
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
  const active = pairs.find((p) => p.slug === activeSlug) ?? pairs[0];

  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)] gap-10", preview && "lg:grid-cols-[minmax(0,1fr)_25rem]")}>
      <ul className="border-border m-0 list-none border-t p-0">
        {pairs.map((pair) => (
          <li key={pair.slug} className="border-border border-b">
            <Link
              to="/registry/$slug"
              params={{ slug: pair.slug }}
              onMouseEnter={() => setActiveSlug(pair.slug)}
              onFocus={() => setActiveSlug(pair.slug)}
              className={cn(
                "grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 px-2 py-3 no-underline transition-colors duration-150 sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:px-3",
                pair.slug === active?.slug ? "bg-muted" : "hover:bg-muted",
              )}
            >
              <Thumb pair={pair} />
              <span className="min-w-0">
                <span className="block truncate font-medium" title={pair.theme.name}>
                  {pair.theme.name}
                </span>
                <span className="text-muted-foreground block truncate text-sm" style={{ fontFamily: isPaid(pair) ? undefined : pair.font.fontFamily }} title={pair.font.name}>
                  {pair.font.name}
                </span>
              </span>
              <span className="col-start-2 flex flex-wrap items-center gap-2 sm:col-start-3 sm:justify-end">
                <span className="text-muted-foreground hidden text-xs md:inline">
                  {pair.editors.map((e) => EDITOR_LABELS[e.id]).join(", ")}
                </span>
                <Tag>{pair.theme.appearance}</Tag>
                {isPaid(pair) ? (
                  <Tag>{LICENSE_LABELS.paid}</Tag>
                ) : pair.font.license === "open" && pair.theme.license === "open" ? (
                  <Tag tone="green">{LICENSE_LABELS.open}</Tag>
                ) : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {active && preview ? (
        <div className="hidden lg:block" aria-hidden>
          <div className="sticky top-24">
            {snapshotUrl(active.editors[0]?.snapshot ?? "") ? (
              <img
                src={snapshotUrl(active.editors[0]?.snapshot ?? "")}
                alt=""
                className="border-border aspect-video w-full rounded-xl border object-cover"
              />
            ) : isPaid(active) ? (
              <PaidSnapshot pair={active} />
            ) : (
              <PairWindow
                pair={{ fontFamily: active.font.fontFamily, bg: active.theme.bg, fg: active.theme.fg }}
                filename={active.editors[0]?.id === "neovim" ? "init.lua" : "settings.json"}
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

/** Paid Fonts and Themes appear only as the Snapshot a developer made with their own license. */
function PaidSnapshot({ pair }: { pair: PairRecord }) {
  const src = snapshotUrl(pair.editors[0]?.snapshot ?? "");
  return src ? (
    <img src={src} alt="" className="border-border aspect-video w-full rounded-xl border object-cover" />
  ) : (
    <div className="border-border text-muted-foreground flex aspect-video w-full items-center justify-center rounded-xl border border-dashed text-sm">
      Snapshot only
    </div>
  );
}

/** The Pair's Thumbnail; falls back to an "Aa" chip in the Pair's colours until one exists. */
function Thumb({ pair }: { pair: PairRecord }) {
  const src = thumbnailUrl(pair.editors[0]?.thumbnail ?? "");
  return src ? (
    <img
      src={src}
      alt=""
      width={400}
      height={225}
      className="border-border row-span-2 aspect-video w-20 rounded-md border object-cover sm:row-span-1"
    />
  ) : (
    <span
      aria-hidden
      className="row-span-2 flex aspect-video w-20 items-center justify-center rounded-md text-sm sm:row-span-1"
      style={{ background: pair.theme.bg, color: pair.theme.fg, fontFamily: isPaid(pair) ? undefined : pair.font.fontFamily }}
    >
      Aa
    </span>
  );
}
