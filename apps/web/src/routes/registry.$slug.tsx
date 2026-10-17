import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { PairDetails } from "@/components/pair/PairDetails";
import { PairHeader } from "@/components/pair/PairHeader";
import { PairNotFound } from "@/components/pair/PairNotFound";
import { PairSettings } from "@/components/pair/PairSettings";
import { PairSnapshot } from "@/components/pair/PairSnapshot";
import { PairToolbar } from "@/components/pair/PairToolbar";
import { RelatedPairs } from "@/components/pair/RelatedPairs";
import { getEditorConfig, resolveEditorId } from "@/lib/registry/pairs";
import { pairSearchSchema } from "@/lib/registry/registry-search";
import { getPairFn, getRelatedPairsFn } from "@/server/pairs.functions";
import { fitTitle, pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/registry/$slug")({
  validateSearch: pairSearchSchema,
  loader: async ({ params }) => {
    const pair = await getPairFn({ data: { slug: params.slug } });
    if (!pair || pair.editors.length === 0) throw notFound();
    // Not awaited: the page shell streams now, related Pairs follow in the same response.
    const related = getRelatedPairsFn({ data: { slug: params.slug } });
    return { pair, related };
  },
  // Per-Pair content worth indexing: full server render.
  ssr: true,
  head: ({ loaderData }) => {
    const pair = loaderData?.pair;
    if (!pair) return {};
    const name = `${pair.theme.name} with ${pair.font.name}`;
    return pageHead({
      path: `/registry/${pair.slug}`,
      name,
      title: fitTitle([
        `${name}: Font and Theme Pair · EditorSetup`,
        `${name} · EditorSetup Font and Theme Pair`,
        `${name}: Font and Theme Pair`,
        `${name} · EditorSetup`,
      ]),
      description: `See ${name} in a real editor Snapshot, then copy the Settings for VS Code and Zed. A Font and Theme Pair from EditorSetup.`,
    });
  },
  component: PairPage,
  notFoundComponent: PairNotFound,
});

function PairPage() {
  const { pair, related } = Route.useLoaderData();
  const { editor: editorParam } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const editorId = resolveEditorId(pair, editorParam);
  const config = getEditorConfig(pair, editorId) ?? pair.editors[0]!;

  return (
    <main id="main">
      <PairToolbar pair={pair} settings={config.settings} />
      <PairHeader pair={pair} />
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 sm:pb-20">
        <PairSnapshot pair={pair} config={config} />
        <PairSettings
          pair={pair}
          config={config}
          onSelectEditor={(id) =>
            void navigate({
              search: { editor: id },
              replace: true,
              resetScroll: false,
            })
          }
        />
        <PairDetails pair={pair} />
        <RelatedPairs related={related} />
      </div>
    </main>
  );
}
