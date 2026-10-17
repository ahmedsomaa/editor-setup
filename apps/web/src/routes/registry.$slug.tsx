import { Suspense, useState } from "react";
import {
  Await,
  createFileRoute,
  Link,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import { AppearanceTag, LicenseTag, PairLicenseTag } from "@/components/Tag";
import { Directory } from "@/components/Directory";
import { PairWindow, textToLines } from "@/components/PairWindow";
import { CompareToggle } from "@/components/CompareToggle";
import { ShareButton } from "@/components/ShareButton";
import { PageHero } from "@/components/PagePattern";
import { SnapshotImage } from "@/components/SnapshotImage";
import { Button } from "@/components/ui/button";
import {
  EDITOR_LABELS,
  getEditorConfig,
  pairLabel,
  resolveEditorId,
  type Appearance,
  type License,
  type PairRecord,
} from "@/lib/pairs";
import { pairSearchSchema } from "@/lib/registry-search";
import { getPairFn, getRelatedPairsFn } from "@/server/pairs.functions";
import { snapshotUrl } from "@/lib/snapshots";
import { cn } from "cn";

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
    return {
      meta: [
        { title: `${pair.theme.name} with ${pair.font.name} · EditorSetup` },
        {
          name: "description",
          content: `${pair.theme.name} and ${pair.font.name}: Snapshot and copyable Settings.`,
        },
      ],
    };
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
  const snap = snapshotUrl(config.snapshot);

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
            <AppearanceTag appearance={pair.theme.appearance} />
            <PairLicenseTag
              font={pair.font.license}
              theme={pair.theme.license}
            />
            {pair.submittedBy ? (
              <span className="text-muted-foreground text-sm">
                Added by{" "}
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
        <figure id="snapshot" className="mt-10 min-w-0 scroll-mt-32">
          {snap ? (
            <SnapshotImage
              src={snap}
              alt={`Snapshot of ${pair.font.name} and ${pair.theme.name} in ${EDITOR_LABELS[config.id]}`}
              className="rounded-[1.1rem]"
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
            <span>
              {snap ? "Snapshot" : "Preview"} for {EDITOR_LABELS[config.id]}
            </span>
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

        <section
          id="settings"
          aria-labelledby="settings-heading"
          className="mt-16 scroll-mt-32"
        >
          <h2 id="settings-heading">Settings</h2>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div
              role="group"
              aria-label="Editor"
              className="flex flex-wrap gap-2"
            >
              {pair.editors.map((editor) => {
                const selected = editor.id === config.id;
                return (
                  <button
                    key={editor.id}
                    type="button"
                    onClick={() =>
                      void navigate({
                        search: { editor: editor.id },
                        replace: true,
                        resetScroll: false,
                      })
                    }
                    aria-pressed={selected}
                    className={cn(
                      "h-9 rounded-full border px-4 text-sm font-medium transition-colors",
                      selected
                        ? "border-foreground bg-card text-foreground"
                        : "border-border bg-card text-secondary-foreground hover:bg-muted",
                    )}
                  >
                    {selected ? (
                      <Check className="me-1.5 inline size-3.5" aria-hidden />
                    ) : null}
                    {EDITOR_LABELS[editor.id]}
                  </button>
                );
              })}
            </div>
            <CopySettings settings={config.settings} variant="outline" />
          </div>
          <pre className="border-border bg-muted mt-4 max-h-[28rem] overflow-auto rounded-lg border p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
            {config.settings}
          </pre>
          <p className="text-muted-foreground mt-2 text-xs">
            Plain text for {EDITOR_LABELS[config.id]}. Paste it into your
            Editor.
          </p>
        </section>

        <section
          id="details"
          aria-labelledby="details-heading"
          className="mt-16 scroll-mt-32"
        >
          <h2 id="details-heading">Details</h2>
          <div className="border-border mt-6 grid border-y md:grid-cols-2 md:divide-x">
            <Detail
              title="Font"
              name={pair.font.name}
              license={pair.font.license}
              links={pair.font.links}
              className="md:pe-8"
            />
            <Detail
              title="Theme"
              name={pair.theme.name}
              license={pair.theme.license}
              links={pair.theme.links}
              appearance={pair.theme.appearance}
              className="border-border max-md:border-t md:ps-8"
            />
          </div>
        </section>

        <section
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
        </section>
      </div>
    </main>
  );
}

function Detail({
  title,
  name,
  license,
  links,
  appearance,
  className,
}: {
  title: string;
  name: string;
  license: License;
  links: string[];
  appearance?: Appearance;
  className?: string;
}) {
  const realLinks = links.filter((href) => href && href !== "#");

  return (
    <div className={cn("py-8", className)}>
      <h3 className="text-muted-foreground font-sans text-sm font-normal tracking-normal">
        {title}
      </h3>
      <p className="font-heading mt-2 text-3xl tracking-[-0.02em]">{name}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <LicenseTag license={license} />
        {appearance ? <AppearanceTag appearance={appearance} /> : null}
      </div>
      {realLinks.length > 0 ? (
        <ul className="mt-5 flex list-none flex-col gap-2 p-0">
          {realLinks.map((href) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-foreground inline-flex min-h-6 max-w-full items-center gap-1.5 text-sm underline hover:no-underline"
              >
                <span className="break-all">{linkLabel(href)}</span>
                <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function linkLabel(href: string): string {
  try {
    const url = new URL(href);
    const item = url.searchParams.get("itemName");
    return item
      ? `${url.hostname.replace(/^www\./, "")} · ${item}`
      : url.hostname.replace(/^www\./, "") + url.pathname.replace(/\/$/, "");
  } catch {
    return href;
  }
}

function CopySettings({
  settings,
  variant,
}: {
  settings: string;
  variant: "default" | "outline";
}) {
  const [state, setState] = useState<"done" | "failed" | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(settings);
      setState("done");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState(null), 2000);
  }

  return (
    <>
      <Button type="button" size="sm" variant={variant} onClick={copy}>
        {state === "done" ? <Check aria-hidden /> : <Copy aria-hidden />}
        {state === "done"
          ? "Copied"
          : state === "failed"
            ? "Unable to copy"
            : "Copy Settings"}
      </Button>
      <span role="status" className="sr-only">
        {state === "done"
          ? "Settings copied"
          : state === "failed"
            ? "Unable to copy. Select the text and copy it yourself."
            : ""}
      </span>
    </>
  );
}

function PairNotFound() {
  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-24">
      <h1>Pair not found</h1>
      <p className="text-muted-foreground mt-3 max-w-[65ch] text-lg">
        That Pair is not in the Registry, or it has no Config yet.
      </p>
      <Button
        className="mt-8"
        variant="outline"
        nativeButton={false}
        render={<Link to="/registry" />}
      >
        Back to Registry
      </Button>
    </main>
  );
}
