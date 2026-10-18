import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Route } from "@/routes/compare";
import { ComparePicker } from "@/components/compare/ComparePicker";
import { PageHero } from "@/components/layout/PagePattern";
import { CompareTable } from "@/components/compare/CompareTable";
import { Button } from "@/components/ui/button";
import { MAX_COMPARE } from "@/lib/presets/compare-store";

const MAX_PRESETS = MAX_COMPARE;

/** Compare: up to three Presets side by side through one Editor they all have a Config for. */
export function ComparePage() {
  const { presets: all } = Route.useLoaderData();
  const { presets: param } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [pickerOpen, setPickerOpen] = useState(false);

  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const slugs =
    param === undefined
      ? all.slice(0, 2).map((p) => p.slug)
      : param
          .split(",")
          .filter((s, i, a) => bySlug.has(s) && a.indexOf(s) === i)
          .slice(0, MAX_PRESETS);
  const picked = slugs.map((s) => bySlug.get(s)!);

  const setSlugs = (next: string[]) =>
    void navigate({
      search: { presets: next.join(",") },
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
        presets={all}
        values={slugs}
        max={MAX_PRESETS}
        onChange={setSlugs}
        open={pickerOpen}
        onOpenChange={setPickerOpen}
      />
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        {picked.length === 0 ? (
          <div className="border-border mt-6 rounded-xl border border-dashed px-6 py-16">
            <p className="font-medium">No Presets to compare yet</p>
            <p className="text-muted-foreground mt-1 max-w-[50ch] text-sm">
              Add Presets to line them up, or pick one from the{" "}
              <Link to="/presets" className="text-foreground underline">
                Presets
              </Link>
              .
            </p>
            <Button className="mt-6" onClick={() => setPickerOpen(true)}>
              <Plus aria-hidden />
              Add Presets
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-6 flex min-h-11 flex-wrap items-center justify-between gap-3">
              <p className="text-muted-foreground m-0 text-sm" role="status">
                {picked.length} of {MAX_PRESETS} Presets
              </p>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setSlugs([])}>
                  Clear all
                </Button>
                <Button
                  disabled={picked.length >= MAX_PRESETS}
                  onClick={() => setPickerOpen(true)}
                >
                  <Plus aria-hidden />
                  Add Presets
                </Button>
              </div>
            </div>
            <CompareTable
              presets={picked}
              slots={MAX_PRESETS}
              onAdd={() => setPickerOpen(true)}
              onRemove={(slug) => setSlugs(slugs.filter((s) => s !== slug))}
            />
            {picked.length === 1 ? (
              <p className="text-muted-foreground mt-6 text-sm" role="status">
                Add another Preset to compare it side by side.
              </p>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
