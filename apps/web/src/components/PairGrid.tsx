import { Link } from "@tanstack/react-router";
import { CompareToggle } from "@/components/CompareToggle";
import {
  EDITOR_IDS,
  EDITOR_LABELS,
  isPaid,
  pairLabel,
  type PairRecord,
} from "@/lib/pairs";
import { SnapshotImage } from "@/components/SnapshotImage";
import { snapshotUrl } from "@/lib/snapshots";

/** The Registry as cards: each Pair's Snapshot above its Theme, Font and tags. */
export function PairGrid({ pairs }: { pairs: PairRecord[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
      {pairs.map((pair) => (
        <li key={pair.slug} className="relative min-w-0">
          <PairCard pair={pair} />
          <CompareToggle
            slug={pair.slug}
            label={pairLabel(pair)}
            className="absolute end-3 top-3 z-10"
          />
        </li>
      ))}
    </ul>
  );
}

function PairCard({ pair }: { pair: PairRecord }) {
  return (
    <Link
      to="/registry/$slug"
      params={{ slug: pair.slug }}
      className="lift border-border bg-card flex h-full flex-col overflow-hidden rounded-xl border no-underline"
    >
      <CardImage pair={pair} />
      <span className="flex flex-1 flex-col gap-3 p-4">
        <span className="min-w-0">
          <span className="block truncate font-medium" title={pairLabel(pair)}>
            {pairLabel(pair)}
          </span>
          {pair.submittedBy ? (
            <span className="text-muted-foreground block truncate font-sans text-sm">
              by {pair.submittedBy.name}
            </span>
          ) : null}
        </span>
        <span className="mt-auto flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {pair.editors
              .filter((e) => EDITOR_IDS.includes(e.id))
              .map((e) => EDITOR_LABELS[e.id])
              .join(", ")}
          </span>
        </span>
      </span>
    </Link>
  );
}

/** The Pair's Snapshot, window only; an "Aa" tile in the Pair's colours until one exists. */
function CardImage({ pair }: { pair: PairRecord }) {
  const src = snapshotUrl(pair.editors[0]?.snapshot ?? "");
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
        aspectRatio: "1420 / 750",
        background: pair.theme.bg,
        color: pair.theme.fg,
        fontFamily: isPaid(pair) ? undefined : pair.font.fontFamily,
      }}
    >
      Aa
    </span>
  );
}
