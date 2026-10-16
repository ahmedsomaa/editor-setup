import { Suspense, useState } from "react";
import {
  Await,
  createFileRoute,
  Link,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import { ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import { Tag } from "@/components/Tag";
import { Directory } from "@/components/Directory";
import { PairWindow, textToLines } from "@/components/PairWindow";
import { Button } from "@/components/ui/button";
import {
  EDITOR_LABELS,
  LICENSE_LABELS,
  getEditorConfig,
  resolveEditorId,
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
    <main id="main" className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-20">
      <nav aria-label="Breadcrumb" className="text-muted-foreground mb-10 text-sm">
        <Link
          to="/registry"
          className="hover:text-foreground underline hover:no-underline"
        >
          Registry
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-foreground" aria-current="page">{pair.theme.name}</span>
      </nav>

      <header className="max-w-3xl">
        <h1>
          {pair.theme.name}
        </h1>
        <p
          className="text-muted-foreground mt-4 text-xl"
          style={{ fontFamily: pair.font.fontFamily }}
        >
          {pair.font.name}
        </p>
        {pair.submittedBy ? (
          <p className="text-muted-foreground mt-4 text-sm">
            Submitted by{" "}
            <a
              href={pair.submittedBy.url}
              target="_blank"
              rel="noreferrer"
              className="text-foreground font-medium underline-offset-4 hover:underline"
            >
              @{pair.submittedBy.name}
            </a>
          </p>
        ) : null}
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-7">
          <div
            role="group"
            aria-label="Editor"
            className="mb-4 flex flex-wrap gap-2"
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
                  {selected ? <Check className="me-1.5 inline size-3.5" aria-hidden /> : null}{EDITOR_LABELS[editor.id]}
                </button>
              );
            })}
          </div>

          <figure className="min-w-0">
            {snap ? (
              <img
                src={snap}
                alt={`Snapshot of ${pair.font.name} and ${pair.theme.name} in ${EDITOR_LABELS[config.id]}`}
                className="border-border bg-muted aspect-video w-full rounded-xl border object-cover"
                width={1600}
                height={900}
              />
            ) : (
              <PairWindow
                pair={{ fontFamily: pair.font.fontFamily, bg: pair.theme.bg, fg: pair.theme.fg }}
                filename={config.id === "neovim" ? "init.lua" : "settings.json"}
                lines={textToLines(config.settings)}
              />
            )}
            <figcaption className="text-muted-foreground mt-3 text-sm">
              {snap ? "Snapshot" : "Preview"} for {EDITOR_LABELS[config.id]}
            </figcaption>
          </figure>
        </div>

        <aside className="flex min-w-0 flex-col gap-8 lg:col-span-5">
          <MetaBlock
            title="Font"
            name={pair.font.name}
            license={pair.font.license}
            links={pair.font.links}
            mono
            fontFamily={pair.font.fontFamily}
          />
          <MetaBlock
            title="Theme"
            name={pair.theme.name}
            license={pair.theme.license}
            links={pair.theme.links}
            appearance={pair.theme.appearance}
          />

          <section className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-2xl">Settings</h2>
              <CopySettings settings={config.settings} />
            </div>
            <pre className="border-border bg-muted max-h-[28rem] overflow-auto rounded-lg border p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
              {config.settings}
            </pre>
            <p className="text-muted-foreground mt-2 text-xs">
              Plain text for {EDITOR_LABELS[config.id]}. Paste it into your Editor.
            </p>
          </section>
        </aside>
      </div>

      <section className="border-border mt-20 border-t pt-16" aria-labelledby="related-heading">
        <h2 id="related-heading">More Pairs</h2>
        <div className="mt-8">
          <Suspense fallback={<p className="text-muted-foreground text-sm" role="status">Loading related Pairs</p>}>
            <Await promise={related}>
              {(pairs: PairRecord[]) =>
                pairs.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No related Pairs yet.</p>
                ) : (
                  <Directory pairs={pairs} preview={false} />
                )
              }
            </Await>
          </Suspense>
        </div>
      </section>
    </main>
  );
}

function MetaBlock({
  title,
  name,
  license,
  links,
  appearance,
  mono,
  fontFamily,
}: {
  title: string;
  name: string;
  license: License;
  links: string[];
  appearance?: string;
  mono?: boolean;
  fontFamily?: string;
}) {
  const realLinks = links.filter((href) => href && href !== "#");

  return (
    <section>
      <h2 className="text-muted-foreground text-sm font-medium">{title}</h2>
      <p
        className={cn("mt-1 text-2xl font-medium tracking-tight", mono ? "font-mono" : "font-sans")}
        style={fontFamily ? { fontFamily } : undefined}
      >
        {name}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <LicenseBadge license={license} />
        {appearance ? (
          <Tag>{appearance}</Tag>
        ) : null}
      </div>
      {realLinks.length > 0 ? (
        <ul className="mt-3 flex list-none flex-col gap-1.5 p-0">
          {realLinks.map((href) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-foreground inline-flex min-h-6 max-w-full items-center gap-1.5 text-sm underline hover:no-underline"
              >
                <span className="truncate">{linkLabel(href)}</span>
                <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function LicenseBadge({ license }: { license: License }) {
  return <Tag tone={license === "open" ? "green" : "neutral"}>{LICENSE_LABELS[license]}</Tag>;
}

function linkLabel(href: string): string {
  try {
    const url = new URL(href);
    return url.hostname.replace(/^www\./, "") + url.pathname.replace(/\/$/, "");
  } catch {
    return href;
  }
}

function CopySettings({ settings }: { settings: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(settings);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button type="button" size="sm" variant="outline" onClick={copy}>
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      <span role="status">{copied ? "Copied" : "Copy Settings"}</span>
    </Button>
  );
}

function PairNotFound() {
  return (
    <main id="main" className="mx-auto max-w-5xl px-4 py-24">
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
