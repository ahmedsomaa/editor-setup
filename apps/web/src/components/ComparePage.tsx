import { Link, useNavigate } from "@tanstack/react-router";
import { X } from "@phosphor-icons/react";
import { Route } from "@/routes/compare";
import { PageHero } from "@/components/PagePattern";
import { SnapshotImage } from "@/components/SnapshotImage";
import { AppearanceTag, PairLicenseTag } from "@/components/Tag";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EDITOR_IDS,
  EDITOR_LABELS,
  getEditorConfig,
  pairLabel,
  type EditorId,
  type PairRecord,
} from "@/lib/pairs";
import { snapshotUrl } from "@/lib/snapshots";
import { MAX_COMPARE } from "@/lib/compare-store";

const MAX_PAIRS = MAX_COMPARE;

/** Compare: up to three Pairs side by side through one Editor they all have a Config for. */
export function ComparePage() {
  const { pairs: all } = Route.useLoaderData();
  const { pairs: param } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const slugs =
    param === undefined
      ? all.slice(0, 2).map((p) => p.slug)
      : param
          .split(",")
          .filter((s, i, a) => bySlug.has(s) && a.indexOf(s) === i)
          .slice(0, MAX_PAIRS);
  const picked = slugs.map((s) => bySlug.get(s)!);
  const rest = all.filter((p) => !slugs.includes(p.slug));

  const setSlugs = (next: string[]) =>
    void navigate({
      search: { pairs: next.join(",") },
      replace: true,
      resetScroll: false,
    });

  const shared: EditorId[] = EDITOR_IDS.filter((id) =>
    picked.every((p) => getEditorConfig(p, id)),
  );
  const editor = shared[0];

  return (
    <main id="main">
      <PageHero variant="compare" className="pb-4 sm:pb-6">
        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div>
            <h1>Compare</h1>
            <p className="text-muted-foreground mt-6 max-w-[60ch] text-lg">
              Add up to {MAX_PAIRS} Pairs and see their Snapshots side by side.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {picked.length < MAX_PAIRS && rest.length > 0 ? (
              <Select
                items={rest.map((p) => ({
                  value: p.slug,
                  label: pairLabel(p),
                }))}
                value={null}
                onValueChange={(v) => v && setSlugs([...slugs, v])}
              >
                <SelectTrigger
                  aria-label="Add a Pair to compare"
                  className="h-11 w-auto min-w-56 font-medium"
                >
                  <SelectValue placeholder="Add a Pair" />
                </SelectTrigger>
                <SelectContent>
                  {rest.map((p) => (
                    <SelectItem key={p.slug} value={p.slug}>
                      {pairLabel(p)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            {picked.length > 0 ? (
              <Button variant="ghost" onClick={() => setSlugs([])}>
                Clear all
              </Button>
            ) : null}
          </div>
        </header>
      </PageHero>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        {picked.length === 0 ? (
          <div className="border-border mt-10 rounded-xl border border-dashed px-6 py-16">
            <p className="font-medium">No Pairs to compare yet</p>
            <p className="text-muted-foreground mt-1 max-w-[50ch] text-sm">
              Add a Pair above, or pick one from the{" "}
              <Link to="/registry" className="text-foreground underline">
                Registry
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            {!editor ? (
              <p
                role="status"
                className="bg-pastel-red text-pastel-red-text mt-10 rounded-xl px-4 py-3 text-sm"
              >
                These Pairs share no Editor, so their Snapshots cannot be
                compared. Remove one to continue.
              </p>
            ) : null}

            <CompareTable
              pairs={picked}
              editor={editor}
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
  editor,
  onRemove,
}: {
  pairs: PairRecord[];
  editor?: EditorId;
  onRemove: (slug: string) => void;
}) {
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
      className="mt-10 overflow-x-auto"
    >
      <table
        className="w-full table-fixed border-collapse text-start text-sm"
        style={{ minWidth: `${7 + pairs.length * 16}rem` }}
      >
        <caption className="sr-only">Pairs side by side</caption>
        <colgroup>
          <col className="w-28" />
          {pairs.map((p) => (
            <col key={p.slug} />
          ))}
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
              const config = editor ? getEditorConfig(pair, editor) : undefined;
              const src = config ? snapshotUrl(config.snapshot) : undefined;
              return (
                <td key={pair.slug} className="ps-3 pb-4 align-top first:ps-0">
                  {src ? (
                    <SnapshotImage
                      src={src}
                      alt={`${pair.theme.name} with ${pair.font.name} in ${EDITOR_LABELS[editor!]}`}
                      className="rounded-[1.1rem]"
                    />
                  ) : (
                    <div
                      className="border-border text-muted-foreground flex items-center justify-center rounded-[1.1rem] border border-dashed text-sm"
                      style={{ aspectRatio: "1420 / 750" }}
                    >
                      No Snapshot to show
                    </div>
                  )}
                </td>
              );
            })}
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
