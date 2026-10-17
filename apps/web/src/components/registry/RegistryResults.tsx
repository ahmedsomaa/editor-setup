import { PairGrid } from "@/components/registry/PairGrid";
import { Pagination } from "@/components/registry/Pagination";
import { Button } from "@/components/ui/button";
import type { PairRecord } from "@/lib/registry/pairs";

const PAGE_SIZE = 6;

/** The count, the page of cards, and the empty state when nothing matches. */
export function RegistryResults({
  pairs,
  total,
  query,
  page,
  hasFilters,
  onClearFilters,
  onPageChange,
}: {
  /** Every Pair that matches the filters. */
  pairs: PairRecord[];
  /** Every Pair in the Registry, matching or not. */
  total: number;
  query?: string;
  page?: number;
  hasFilters: boolean;
  onClearFilters: () => void;
  onPageChange: (page: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(pairs.length / PAGE_SIZE));
  const current = Math.min(page ?? 1, pageCount);
  const visible = pairs.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <>
      <div className="border-border mt-10 flex min-h-12 flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b pb-4">
        <h2
          aria-live="polite"
          className="m-0 flex flex-wrap items-baseline gap-x-3 text-4xl leading-none sm:text-5xl"
        >
          <span>
            {pairs.length} {pairs.length === 1 ? "Pair" : "Pairs"}
          </span>
          {hasFilters ? (
            <span className="text-muted-foreground font-sans text-base font-normal">
              of {total}
            </span>
          ) : null}
        </h2>
        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        ) : null}
      </div>

      <div className="mt-6">
        {pairs.length === 0 ? (
          <div className="border-border rounded-xl border border-dashed px-6 py-16">
            <p className="font-medium">
              No Pairs match{query ? ` “${query}”` : ""}
            </p>
            <p className="text-muted-foreground mt-1 max-w-[50ch] text-sm">
              Try another name, or clear the filters to see the whole Registry.
            </p>
            <Button className="mt-6" variant="outline" onClick={onClearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <PairGrid pairs={visible} />
            <Pagination
              className="mt-10"
              page={current}
              pageCount={pageCount}
              onChange={(next) => {
                onPageChange(next);
                window.scrollTo({ top: 0 });
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
