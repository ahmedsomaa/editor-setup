import { Suspense } from "react";
import {
  Await,
  createFileRoute,
  Link,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Directory } from "@/components/registry/Directory";
import { PairWindow, textToLines } from "@/components/registry/PairWindow";
import { CompareToggle } from "@/components/compare/CompareToggle";
import { ShareButton } from "@/components/common/ShareButton";
import { PageHero } from "@/components/layout/PagePattern";
import { Reveal } from "@/components/layout/Reveal";
import { SnapshotImage } from "@/components/common/SnapshotImage";
import { CopySettings } from "@/components/pair/CopySettings";
import { EditorSwitch } from "@/components/pair/EditorSwitch";
import { PairDetail } from "@/components/pair/PairDetail";
import { PairNotFound } from "@/components/pair/PairNotFound";
import {
  EDITOR_LABELS,
  getEditorConfig,
  pairLabel,
  resolveEditorId,
  type PairRecord,
} from "@/lib/registry/pairs";
import { pairSearchSchema } from "@/lib/registry/registry-search";
import { getPairFn, getRelatedPairsFn } from "@/server/pairs.functions";
import { snapshotUrl } from "@/lib/registry/snapshots";
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
  const snap = snapshotUrl(pair.snapshot);

  return (
    <main id="main">
      <div className="border-border bg-background/90 z-30 border-b backdrop-blur-sm sm:sticky sm:top-16">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
          <Link
            to="/registry"
            className="text-foreground inline-flex items-center gap-2 text-sm font-medium no-underline hover:underline"
          >
            <ArrowLeft aria-hidden className="size-4" />
            <span className="max-sm:sr-only">Registry</span>
          </Link>
          <nav
            aria-label="On this page"
            className="text-muted-foreground hidden items-center gap-6 text-sm md:flex"
          >
            <a href="#snapshot" className="hover:text-foreground no-underline">
              Snapshot
            </a>
            <a href="#settings" className="hover:text-foreground no-underline">
              Settings
            </a>
            <a href="#details" className="hover:text-foreground no-underline">
              Details
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <CompareToggle
              slug={pair.slug}
              label={pairLabel(pair)}
              className="h-9 px-4 text-sm"
            />
            <CopySettings settings={config.settings} variant="default" />
          </div>
        </div>
      </div>

      <PageHero variant="pair" className="pt-12 pb-6 sm:pt-16 sm:pb-8">
        <header>
          <h1>
            {pair.theme.name}
            <span className="sr-only"> with </span>
            <span aria-hidden className="text-muted-foreground mx-[0.35em]">
              ·
            </span>
            {pair.font.name}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            {pair.submittedBy ? (
              <span className="text-muted-foreground font-sans text-base">
                by{" "}
                <a
                  href={pair.submittedBy.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground font-medium underline-offset-4 hover:underline"
                >
                  @{pair.submittedBy.name}
                </a>
              </span>
            ) : null}
            <ShareButton title={pairLabel(pair)} className="sm:ms-auto" />
          </div>
        </header>
      </PageHero>

      <div className="mx-auto w-full max-w-6xl px-4 pb-12 sm:pb-20">
        <div id="snapshot" className="mt-10 min-w-0 scroll-mt-32">
          <figure className="min-w-0">
            {snap ? (
              <SnapshotImage
                src={snap}
                alt={`Snapshot of ${pair.font.name} and ${pair.theme.name}`}
                className="rounded-xl"
              />
            ) : (
              <PairWindow
                pair={{
                  fontFamily: pair.font.fontFamily,
                  bg: pair.theme.bg,
                  fg: pair.theme.fg,
                }}
                filename="settings.json"
                lines={textToLines(config.settings)}
              />
            )}
            <figcaption className="text-muted-foreground mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm">
              <span>{snap ? "Snapshot" : "Preview"}</span>
              {snap ? (
                <a
                  href={snap}
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground font-medium underline hover:no-underline"
                >
                  Open full size
                </a>
              ) : null}
            </figcaption>
          </figure>
        </div>

        <Reveal
          as="section"
          id="settings"
          aria-labelledby="settings-heading"
          className="mt-16 scroll-mt-32"
        >
          <h2 id="settings-heading">Settings</h2>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <EditorSwitch
              editors={pair.editors}
              selectedId={config.id}
              onSelect={(id) =>
                void navigate({
                  search: { editor: id },
                  replace: true,
                  resetScroll: false,
                })
              }
            />
            <CopySettings settings={config.settings} variant="outline" />
          </div>
          <pre className="border-border bg-muted mt-4 max-h-[28rem] overflow-auto rounded-lg border p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
            {config.settings}
          </pre>
          <p className="text-muted-foreground mt-2 text-xs">
            Plain text for {EDITOR_LABELS[config.id]}. Paste it into your
            Editor.
          </p>
        </Reveal>

        <Reveal
          as="section"
          id="details"
          aria-labelledby="details-heading"
          className="mt-16 scroll-mt-32"
        >
          <h2 id="details-heading">Details</h2>
          <div className="border-border mt-6 grid border-y md:grid-cols-2 md:divide-x">
            <PairDetail
              title="Font"
              name={pair.font.name}
              license={pair.font.license}
              links={pair.font.links}
              className="md:pe-8"
            />
            <PairDetail
              title="Theme"
              name={pair.theme.name}
              license={pair.theme.license}
              links={pair.theme.links}
              appearance={pair.theme.appearance}
              className="border-border max-md:border-t md:ps-8"
            />
          </div>
        </Reveal>

        <Reveal
          as="section"
          className="border-border mt-20 border-t pt-16"
          aria-labelledby="related-heading"
        >
          <h2 id="related-heading">More Pairs</h2>
          <div className="mt-8">
            <Suspense
              fallback={
                <p className="text-muted-foreground text-sm" role="status">
                  Loading related Pairs
                </p>
              }
            >
              <Await promise={related}>
                {(pairs: PairRecord[]) =>
                  pairs.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      No related Pairs yet.
                    </p>
                  ) : (
                    <Directory pairs={pairs} preview={false} />
                  )
                }
              </Await>
            </Suspense>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

