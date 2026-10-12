import { useState } from "react";
import {
  createFileRoute,
  Link,
  notFound,
} from "@tanstack/react-router";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EDITOR_LABELS,
  LICENSE_LABELS,
  getEditorConfig,
  getPairBySlug,
  resolveEditorId,
  type EditorId,
  type License,
} from "@/lib/pairs";
import { snapshotUrl } from "@/lib/snapshots";
import { cn } from "cn";

export const Route = createFileRoute("/registry/$slug")({
  loader: ({ params }) => {
    const pair = getPairBySlug(params.slug);
    if (!pair || pair.editors.length === 0) throw notFound();
    return { pair };
  },
  component: PairPage,
  notFoundComponent: PairNotFound,
});

function PairPage() {
  const { pair } = Route.useLoaderData();
  const [editorId, setEditorId] = useState<EditorId>(() =>
    resolveEditorId(pair),
  );
  const config = getEditorConfig(pair, editorId) ?? pair.editors[0]!;
  const snap = snapshotUrl(config.snapshot);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
      <nav className="text-muted-foreground mb-8 text-sm">
        <Link
          to="/registry"
          className="hover:text-foreground underline-offset-4 hover:underline"
        >
          Registry
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-foreground">{pair.theme.name}</span>
      </nav>

      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
          {pair.theme.name}
        </h1>
        <p
          className="text-muted-foreground mt-2 font-mono text-xl tracking-tight sm:text-2xl"
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
                  onClick={() => setEditorId(editor.id)}
                  aria-pressed={selected}
                  className={cn(
                    "h-8 rounded-full border px-3 text-sm font-medium transition-[background-color,color,border-color] duration-150 ease-out motion-safe:enabled:active:scale-[0.96]",
                    selected
                      ? "border-transparent bg-accent text-accent-foreground"
                      : "border-border bg-card text-secondary-foreground hover:bg-muted",
                  )}
                >
                  {EDITOR_LABELS[editor.id]}
                </button>
              );
            })}
          </div>

          <figure className="min-w-0">
            {snap ? (
              <img
                src={snap}
                alt={`Snapshot of ${pair.font.name} and ${pair.theme.name} in ${EDITOR_LABELS[config.id]}`}
                className="bg-muted aspect-video w-full object-cover"
                width={1600}
                height={900}
              />
            ) : (
              <div
                className="border-border flex aspect-video w-full items-center justify-center rounded-[var(--radius-lg)] border"
                style={{ background: pair.theme.bg, color: pair.theme.fg }}
                role="img"
                aria-label={`Preview colors for ${pair.theme.name}`}
              >
                <span
                  className="text-4xl font-semibold tracking-tight"
                  style={{ fontFamily: pair.font.fontFamily }}
                >
                  Aa
                </span>
              </div>
            )}
            <figcaption className="text-muted-foreground mt-3 text-sm">
              Snapshot · {EDITOR_LABELS[config.id]} · 16:9
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
              <h2 className="font-heading text-lg font-semibold tracking-tight">
                Settings
              </h2>
              <CopySettings settings={config.settings} />
            </div>
            <pre className="border-border bg-muted/50 max-h-[28rem] overflow-auto rounded-[var(--radius-lg)] border p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
              {config.settings}
            </pre>
            <p className="text-muted-foreground mt-2 text-xs">
              Plain text for {EDITOR_LABELS[config.id]}. Paste into your Editor.
            </p>
          </section>
        </aside>
      </div>
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
      <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {title}
      </h2>
      <p
        className={cn(
          "mt-1 text-xl font-semibold tracking-tight",
          mono ? "font-mono" : "font-heading",
        )}
        style={fontFamily ? { fontFamily } : undefined}
      >
        {name}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <LicenseBadge license={license} />
        {appearance ? (
          <span className="text-muted-foreground text-sm capitalize">
            {appearance}
          </span>
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
                className="text-primary inline-flex max-w-full items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
              >
                <span className="truncate">{linkLabel(href)}</span>
                <ExternalLink className="size-3.5 shrink-0" strokeWidth={2} />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function LicenseBadge({ license }: { license: License }) {
  return (
    <span className="bg-muted text-foreground inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium">
      {LICENSE_LABELS[license]}
    </span>
  );
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
    <Button type="button" size="sm" onClick={copy}>
      {copied ? (
        <Check className="size-4" strokeWidth={2} aria-hidden />
      ) : (
        <Copy className="size-4" strokeWidth={2} aria-hidden />
      )}
      {copied ? "Copied" : "Copy Settings"}
    </Button>
  );
}

function PairNotFound() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Pair not found</h1>
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
