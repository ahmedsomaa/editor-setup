import { createFileRoute } from "@tanstack/react-router";
import { PresetsFilters } from "@/components/presets/PresetsFilters";
import { PresetsPattern } from "@/components/presets/PresetsPattern";
import { PresetsResults } from "@/components/presets/PresetsResults";
import { usePresetsFilters } from "@/components/presets/usePresetsFilters";
import { presetsSearchSchema } from "@/lib/presets/presets-search";
import { listPresetsFn } from "@/server/presets.functions";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/presets/")({
  validateSearch: presetsSearchSchema,
  loaderDeps: ({ search: { q, editor, appearance } }) => ({
    q,
    editor,
    appearance,
  }),
  loader: ({ deps }) => listPresetsFn({ data: deps }),
  // Crawlable listing whose state lives in the URL: render fully on the server.
  ssr: true,
  head: () =>
    pageHead({
      path: "/presets",
      name: "Presets",
      title: "Font and Theme Presets for VS Code and Zed",
      description:
        "Browse Font and Theme Presets from real editor setups. Search by Font or Theme, filter by Appearance or Editor, open a Preset to see its Snapshot and copy its Settings.",
    }),
  component: PresetsPage,
});

function PresetsPage() {
  const search = Route.useSearch();
  const { presets, total } = Route.useLoaderData();
  const { query, setQuery, setParam, hasFilters, clearFilters } =
    usePresetsFilters(search);

  return (
    <main id="main">
      <div className="relative isolate overflow-hidden">
        <PresetsPattern className="bg-glyphs" />
        <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-16 sm:pt-24 sm:pb-20">
          <h1>Presets</h1>
          <p className="text-muted-foreground mt-6 max-w-[60ch] text-lg">
            Presets from real setups. See each one, then copy its Settings.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        <PresetsFilters
          query={query}
          onQueryChange={setQuery}
          filters={search}
          onFilterChange={setParam}
        />
        <PresetsResults
          presets={presets}
          total={total}
          query={search.q}
          page={search.page}
          hasFilters={hasFilters}
          onClearFilters={clearFilters}
          onPageChange={(page) =>
            setParam({ page: page > 1 ? page : undefined })
          }
        />
      </div>
    </main>
  );
}
