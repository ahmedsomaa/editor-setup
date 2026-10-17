import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { Route } from "@/routes/compare";
import { ComparePicker } from "@/components/compare/ComparePicker";
import { PageHero } from "@/components/layout/PagePattern";
import { SnapshotImage } from "@/components/common/SnapshotImage";
import { AppearanceTag, PairLicenseTag } from "@/components/common/Tag";
import { Button } from "@/components/ui/button";
import { EDITOR_LABELS, pairLabel, type PairRecord } from "@/lib/registry/pairs";
import { snapshotUrl } from "@/lib/registry/snapshots";
import { MAX_COMPARE } from "@/lib/registry/compare-store";

const MAX_PAIRS = MAX_COMPARE;

/** Compare: up to three Pairs side by side through one Editor they all have a Config for. */
export function ComparePage() {
  const { pairs: all } = Route.useLoaderData();
  const { pairs: param } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [pickerOpen, setPickerOpen] = useState(false);

  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const slugs =
    param === undefined
      ? all.slice(0, 2).map((p) => p.slug)
      : param
          .split(",")
          .filter((s, i, a) => bySlug.has(s) && a.indexOf(s) === i)
          .slice(0, MAX_PAIRS);
  const picked = slugs.map((s) => bySlug.get(s)!);

  const setSlugs = (next: string[]) =>
    void navigate({
      search: { pairs: next.join(",") },
      replace: true,
      resetScroll: false,
    });

  return (
    <main id="main">
      <PageHero variant="compare" className="pb-4 sm:pb-6">
        <header>
          <h1>Compare</h1>
          <p className="text-muted-foreground mt-6 max-w-[60ch] text-lg">
            Side by side, until one wins.
          </p>
        </header>
      </PageHero>
      <ComparePicker
        pairs={all}
        values={slugs}
        max={MAX_PAIRS}
        onChange={setSlugs}
        open={pickerOpen}
        onOpenChange={setPickerOpen}
      />
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        {picked.length === 0 ? (
          <div className="border-border mt-6 rounded-xl border border-dashed px-6 py-16">
            <p className="font-medium">No Pairs to compare yet</p>
            <p className="text-muted-foreground mt-1 max-w-[50ch] text-sm">
              Add Pairs to line them up, or pick one from the{" "}
              <Link to="/registry" className="text-foreground underline">
                Registry
              </Link>
              .
            </p>
            <Button className="mt-6" onClick={() => setPickerOpen(true)}>
              <Plus aria-hidden />
              Add Pairs
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-6 flex min-h-11 flex-wrap items-center justify-between gap-3">
              <p className="text-muted-foreground m-0 text-sm" role="status">
                {picked.length} of {MAX_PAIRS} Pairs
              </p>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setSlugs([])}>
                  Clear all
                </Button>
                <Button
                  disabled={picked.length >= MAX_PAIRS}
                  onClick={() => setPickerOpen(true)}
                >
                  <Plus aria-hidden />
                  Add Pairs
                </Button>
              </div>
            </div>
            <CompareTable
              pairs={picked}
              slots={MAX_PAIRS}
              onAdd={() => setPickerOpen(true)}
              onRemove={(slug) => setSlugs(slugs.filter((s) => s !== slug))}
            />
            {picked.length === 1 ? (
              <p className="text-muted-foreground mt-6 text-sm" role="status">
                Add another Pair to compare it side by side.
              </p>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}

function CompareTable({
  pairs,
  slots,
  onAdd,
  onRemove,
}: {
  pairs: PairRecord[];
  /** Most Pairs the table holds. An open slot shows where the next one lands. */
  slots: number;
  onAdd: () => void;
  onRemove: (slug: string) => void;
}) {
  const open = pairs.length < slots;
  const rows: { label: string; cell: (p: PairRecord) => React.ReactNode }[] = [
    { label: "Theme", cell: (p) => p.theme.name },
    { label: "Font", cell: (p) => p.font.name },
    {
      label: "Appearance",
      cell: (p) => <AppearanceTag appearance={p.theme.appearance} />,
    },
    {
      label: "License",
      cell: (p) => (
        <PairLicenseTag font={p.font.license} theme={p.theme.license} />
      ),
    },
    {
      label: "Editors",
      cell: (p) => p.editors.map((e) => EDITOR_LABELS[e.id]).join(", "),
    },
    {
      label: "Added by",
      cell: (p) => (p.submittedBy ? `@${p.submittedBy.name}` : "Not recorded"),
    },
  ];

  return (
    <div
      role="region"
      aria-label="Pairs side by side"
      tabIndex={0}
      className="mt-2 overflow-x-auto"
    >
      <table
        className="w-full table-fixed border-collapse text-start text-sm"
        style={{ minWidth: `${7 + (pairs.length + (open ? 1 : 0)) * 16}rem` }}
      >
        <caption className="sr-only">Pairs side by side</caption>
        <colgroup>
          <col className="w-28" />
          {pairs.map((p) => (
            <col key={p.slug} />
          ))}
          {open ? <col /> : null}
        </colgroup>
        <tbody>
          <tr>
            <th
              scope="row"
              className="text-muted-foreground pe-4 text-start align-top font-normal"
            >
              <span className="block pt-1">Snapshot</span>
            </th>
            {pairs.map((pair) => {
              const src = snapshotUrl(pair.snapshot);
              return (
                <td key={pair.slug} className="ps-3 pb-4 align-top first:ps-0">
                  {src ? (
                    <SnapshotImage
                      src={src}
                      alt={`${pair.theme.name} with ${pair.font.name}`}
                      className="rounded-xl"
                    />
                  ) : (
                    <div
                      className="border-border text-muted-foreground flex items-center justify-center rounded-xl border border-dashed text-sm"
                      style={{ aspectRatio: "16 / 9" }}
                    >
                      No Snapshot to show
                    </div>
                  )}
                </td>
              );
            })}
            {open ? (
              <td className="ps-3 pb-4 align-top">
                <button
                  type="button"
                  onClick={onAdd}
                  className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted/50 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-sm transition-colors duration-150"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  <Plus aria-hidden className="size-6" />
                  Add a Pair
                </button>
              </td>
            ) : null}
          </tr>
          <tr className="border-border border-t">
            <th
              scope="row"
              className="text-muted-foreground py-3 pe-4 text-start align-middle font-normal"
            >
              Pair
            </th>
            {pairs.map((pair) => (
              <td key={pair.slug} className="py-3 ps-3 align-middle first:ps-0">
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to="/registry/$slug"
                    params={{ slug: pair.slug }}
                    className="text-foreground min-w-0 truncate font-medium no-underline hover:underline"
                  >
                    {pairLabel(pair)}
                  </Link>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={`Remove ${pairLabel(pair)} from the comparison`}
                    onClick={() => onRemove(pair.slug)}
                  >
                    <X aria-hidden />
                  </Button>
                </div>
              </td>
            ))}
          </tr>
          {rows.map((row) => (
            <tr key={row.label} className="border-border border-t">
              <th
                scope="row"
                className="text-muted-foreground py-3 pe-4 text-start font-normal"
              >
                {row.label}
              </th>
              {pairs.map((p) => (
                <td key={p.slug} className="py-3 ps-3 align-middle first:ps-0">
                  {row.cell(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
