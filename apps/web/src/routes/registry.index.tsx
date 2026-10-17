import { createFileRoute } from "@tanstack/react-router";
import { RegistryFilters } from "@/components/registry/RegistryFilters";
import { RegistryPattern } from "@/components/registry/RegistryPattern";
import { RegistryResults } from "@/components/registry/RegistryResults";
import { useRegistryFilters } from "@/components/registry/useRegistryFilters";
import { registrySearchSchema } from "@/lib/registry/registry-search";
import { listPairsFn } from "@/server/pairs.functions";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/registry/")({
  validateSearch: registrySearchSchema,
  loaderDeps: ({ search: { q, editor, appearance, license } }) => ({
    q,
    editor,
    appearance,
    license,
  }),
  loader: ({ deps }) => listPairsFn({ data: deps }),
  // Crawlable listing whose state lives in the URL: render fully on the server.
  ssr: true,
  head: () =>
    pageHead({
      path: "/registry",
      title: "Registry: Font and Theme Pairs for VS Code and Zed",
      description:
        "Browse Font and Theme Pairs from real editor setups. Filter by Appearance, License or Editor, open a Pair to see its Snapshot and copy its Settings.",
    }),
  component: RegistryPage,
});

function RegistryPage() {
  const search = Route.useSearch();
  const { pairs, total } = Route.useLoaderData();
  const { query, setQuery, setParam, hasFilters, clearFilters } =
    useRegistryFilters(search);

  return (
    <main id="main">
      <div className="relative isolate overflow-hidden">
        <RegistryPattern className="bg-glyphs" />
        <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-16 sm:pt-24 sm:pb-20">
          <h1>Registry</h1>
          <p className="text-muted-foreground mt-6 max-w-[60ch] text-lg">
            Every font and theme, already paired up.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        <RegistryFilters
          query={query}
          onQueryChange={setQuery}
          filters={search}
          onFilterChange={setParam}
        />
        <RegistryResults
          pairs={pairs}
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
