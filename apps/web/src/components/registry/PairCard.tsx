import { Link } from "@tanstack/react-router";
import { EDITOR_LABELS, type PairRecord } from "@/lib/pairs";

type PairCardProps = {
  pair: PairRecord;
  layout: "grid" | "list";
};

function SubmittedBy({ pair }: { pair: PairRecord }) {
  if (!pair.submittedBy) return null;
  const label = `@${pair.submittedBy.name}`;
  return (
    <>
      Submitted by{" "}
      <a
        href={pair.submittedBy.url}
        target="_blank"
        rel="noreferrer"
        className="text-foreground font-medium underline-offset-4 hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        {label}
      </a>
    </>
  );
}

export function PairCard({ pair, layout }: PairCardProps) {
  const editorLabels = pair.editors.map((e) => EDITOR_LABELS[e.id]).join(" · ");
  const meta = `${pair.theme.appearance} · ${pair.font.license}/${pair.theme.license} · ${editorLabels}`;

  if (layout === "list") {
    return (
      <Link
        to="/registry/$slug"
        params={{ slug: pair.slug }}
        className="surface-card flex min-w-0 items-stretch gap-4 rounded-[calc(var(--radius-lg)+0.75rem)] p-3 no-underline sm:gap-5 sm:p-4"
      >
        <div
          className="aspect-video w-28 shrink-0 overflow-hidden rounded-[var(--radius-lg)] sm:w-40"
          style={{ background: pair.theme.bg, color: pair.theme.fg }}
          aria-hidden
        >
          <div
            className="flex h-full items-center justify-center px-2 text-center text-sm font-medium tracking-tight"
            style={{ fontFamily: pair.font.fontFamily }}
          >
            Aa
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
          <h2 className="font-heading text-foreground text-lg font-semibold tracking-[-0.02em] sm:text-xl">
            <span className="truncate">{pair.theme.name}</span>
          </h2>
          <p
            className="text-muted-foreground mt-0.5 truncate font-mono text-sm"
            style={{ fontFamily: pair.font.fontFamily }}
          >
            {pair.font.name}
          </p>
          <p className="text-muted-foreground mt-2 truncate text-xs sm:text-sm">
            {pair.submittedBy ? (
              <>
                <SubmittedBy pair={pair} />
                <span className="text-border mx-1.5" aria-hidden>
                  ·
                </span>
              </>
            ) : null}
            {meta}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/registry/$slug"
      params={{ slug: pair.slug }}
      className="surface-card flex min-w-0 flex-col overflow-hidden rounded-[calc(var(--radius-lg)+0.75rem)] no-underline"
    >
      <div
        className="aspect-video w-full"
        style={{ background: pair.theme.bg, color: pair.theme.fg }}
        aria-hidden
      >
        <div
          className="flex h-full flex-col items-center justify-center gap-1 px-4 text-center"
          style={{ fontFamily: pair.font.fontFamily }}
        >
          <span className="text-3xl font-semibold tracking-tight">Aa</span>
          <span className="text-sm opacity-80">{`=> {}`}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h2 className="font-heading text-foreground truncate text-lg font-semibold tracking-[-0.02em]">
          {pair.theme.name}
        </h2>
        <p
          className="text-muted-foreground truncate font-mono text-sm"
          style={{ fontFamily: pair.font.fontFamily }}
        >
          {pair.font.name}
        </p>
        <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
          {pair.submittedBy ? (
            <span className="block">
              <SubmittedBy pair={pair} />
            </span>
          ) : null}
          <span
            className={
              pair.submittedBy ? "mt-1 block truncate" : "block truncate"
            }
          >
            {meta}
          </span>
        </p>
      </div>
    </Link>
  );
}
