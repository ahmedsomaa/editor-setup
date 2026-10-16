import { useEffect, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Copy, Pause, Play } from "@phosphor-icons/react";
import { Directory } from "@/components/Directory";
import { PairWindow } from "@/components/PairWindow";
import { TokenWindow } from "@/components/TokenWindow";
import { PLAYGROUND } from "@/lib/playground-tokens";
import { Reveal } from "@/components/Reveal";
import { Tag } from "@/components/Tag";
import { Button } from "@/components/ui/button";
import { EDITOR_IDS, EDITOR_LABELS, isPaid, type EditorId, type PairRecord } from "@/lib/pairs";
import { linesToText, settingsFor } from "@/lib/settings-snippet";
import { CONTRIBUTE_URL } from "@/lib/site";
import { listPairsFn } from "@/server/pairs.functions";
import { cn } from "cn";

export const Route = createFileRoute("/")({
  loader: () => listPairsFn({ data: {} }),
  component: HomePage,
});

const PLAYGROUND_ORDER = ["fira-code--palenight-theme", "geist-mono--aura-dark", "inconsolata--vitesse-dark"] as const;

const FAQS = [
  {
    q: "What is EditorSetup?",
    a: "A list of Font and Theme Pairs from real editor setups. Each Pair has Settings you can copy and a Snapshot of how it looks.",
  },
  {
    q: "Do I need an account?",
    a: "No. Browse the Registry, open a Pair and copy its Settings. Contributions are pull requests on GitHub.",
  },
  {
    q: "Which Editors are supported?",
    a: "VS Code, Cursor, Zed and Neovim. A Pair can have a Config for one or more of them.",
  },
  {
    q: "Is it free?",
    a: "The site is free. Each Font and Theme has its own License, shown on every Pair as Open, Free or Paid.",
  },
  {
    q: "How do I add a Pair?",
    a: "Open a pull request with a Pair file and its Snapshot. Make the Snapshot and thumbnail in Snapshot Studio. There is no form on the site.",
  },
] as const;

function HomePage() {
  const { pairs, total } = Route.useLoaderData();
  const shown = pairs.slice(0, 8);
  const [heroSlug, setHeroSlug] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const holding = useRef(false);
  // The playground offers three Pairs, only with Open or Free Fonts and Themes, each with its real Theme tokens.
  const stagePairs = PLAYGROUND_ORDER.map((slug) => pairs.find((p) => p.slug === slug)).filter(
    (p): p is PairRecord => Boolean(p) && !isPaid(p as PairRecord),
  );

  // Rotate through the Pairs unless the visitor prefers reduced motion. Pausing is always available,
  // and the hero stops while it is hovered or focused.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing || stagePairs.length < 2) return;
    const id = window.setInterval(() => {
      if (holding.current) return;
      setHeroSlug((cur) => {
        const i = stagePairs.findIndex((p) => p.slug === (cur ?? stagePairs[0]?.slug));
        return stagePairs[(i + 1) % stagePairs.length]?.slug ?? null;
      });
    }, 3500);
    return () => window.clearInterval(id);
  }, [playing, stagePairs.length]);
  const heroPair = stagePairs.find((p) => p.slug === heroSlug) ?? stagePairs[0];
  // The hero is painted in the chosen Pair's own colours. Paid Fonts never load, so they keep the site's mono.
  const stage = {
    bg: (heroPair && PLAYGROUND[heroPair.slug]?.bg) || heroPair?.theme.bg || "#111111",
    fg: (heroPair && PLAYGROUND[heroPair.slug]?.fg) || heroPair?.theme.fg || "#edeceb",
    family: heroPair && !isPaid(heroPair) ? heroPair.font.fontFamily : undefined,
  };

  return (
    <main id="main">
      <section
        className="relative isolate flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden px-4 py-16"
        onMouseEnter={() => (holding.current = true)}
        onMouseLeave={() => (holding.current = false)}
        onFocusCapture={() => (holding.current = true)}
        onBlurCapture={() => (holding.current = false)}
      >
        <div aria-hidden className="bg-pattern pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-10">
          <div className="min-w-0">
            <h1 className="relative mt-8 text-[clamp(2.5rem,4.6vw,4.25rem)]">
              <span
                aria-hidden="true"
                className="border-border bg-card text-pastel-green-text absolute -top-9 right-4 rotate-6 rounded-full border px-2.5 pt-1 pb-0.5 font-sans text-xs leading-none font-medium tracking-[0.05em] uppercase shadow-[var(--shadow-overlay)] sm:right-10"
              >
                Free
              </span>
              Make the place you code{" "}
              <span className="relative inline-block whitespace-nowrap">
                <svg className="absolute h-0 w-0" aria-hidden="true">
                  <defs>
                    <filter id="hook-rough" x="-30%" y="-30%" width="160%" height="160%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="11" result="n" />
                      <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                  </defs>
                </svg>
                feel like yours.
                <svg
                  className="text-accent-text/35 pointer-events-none absolute bottom-[-0.12em] left-[-1%] h-[0.32em] w-[102%]"
                  viewBox="0 0 140 10"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M3,6 C40,3 100,3 137,5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" filter="url(#hook-rough)" />
                </svg>
              </span>
            </h1>
            <p className="text-muted-foreground mt-8 max-w-[46ch] text-xl leading-relaxed">
              Real setups by developers for developers. Explore our list of setups that just work together, with the config one click away.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button size="lg" nativeButton={false} render={<Link to="/registry" />}>
                Browse setups
                <ArrowRight aria-hidden />
              </Button>
              <Button size="lg" variant="outline" nativeButton={false} render={<a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer" />}>
                Share a pair
              </Button>
            </div>
          </div>

          <div className="min-w-0">
            {heroPair && PLAYGROUND[heroPair.slug] ? (
              <div aria-label={`${heroPair.theme.name} with ${heroPair.font.name}`} role="img">
                <TokenWindow
                  theme={PLAYGROUND[heroPair.slug]!}
                  fontFamily={stage.family ?? "ui-monospace, monospace"}
                  filename="pair.ts"
                  className="min-h-[18rem]"
                />
              </div>
            ) : null}
            <div role="group" aria-label="Try a Pair" className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                aria-pressed={playing}
                aria-label={playing ? "Pause rotation" : "Play rotation"}
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex size-9 items-center justify-center rounded-full border transition-colors hover:opacity-90"
                style={{ background: stage.bg, color: stage.fg, borderColor: `color-mix(in srgb, ${stage.fg} 35%, ${stage.bg})` }}
              >
                {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
              </button>
              {stagePairs.map((pair) => {
                const on = pair.slug === heroPair?.slug;
                return (
                  <button
                    key={pair.slug}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setPlaying(false);
                      setHeroSlug(pair.slug);
                    }}
                    className="inline-flex h-9 items-center rounded-full px-4 text-sm transition-shadow"
                    style={{
                      background: PLAYGROUND[pair.slug]?.bg ?? pair.theme.bg,
                      color: PLAYGROUND[pair.slug]?.fg ?? pair.theme.fg,
                      fontFamily: pair.font.fontFamily,
                      boxShadow: on ? "0 0 0 2px var(--background), 0 0 0 4px var(--foreground)" : "none",
                    }}
                  >
                    {pair.theme.name} + {pair.font.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <ShowcaseSection pairs={shown} total={total} />

      <section className="border-border border-t px-4 py-16 sm:py-24" aria-labelledby="how">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 id="how" className="max-w-2xl">
              Find a Pair, then paste its Settings.
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-6">
            <Reveal className="border-border bg-card rounded-xl border p-6 sm:p-8 lg:col-span-4" index={0}>
              <CopyPanel pair={shown[0]} />
            </Reveal>
            <Reveal className="border-border bg-card flex flex-col rounded-xl border p-6 sm:p-8 lg:col-span-2" index={1}>
              <h3>Know the License</h3>
              <dl className="mt-6 flex flex-col gap-5 text-sm">
                <div className="flex flex-col items-start gap-2">
                  <dt><Tag tone="green">Open</Tag></dt>
                  <dd className="text-muted-foreground">An open license such as OFL or MIT. Free to use and embed.</dd>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <dt><Tag>Free</Tag></dt>
                  <dd className="text-muted-foreground">No cost, with limits such as private use only.</dd>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <dt><Tag>Paid</Tag></dt>
                  <dd className="text-muted-foreground">Shown only as a Snapshot from a developer who owns the license.</dd>
                </div>
              </dl>
            </Reveal>
            <Reveal className="border-border bg-card rounded-xl border p-6 sm:p-8 lg:col-span-2" index={2}>
              <h3>Check the Snapshot</h3>
              <p className="text-muted-foreground mt-4 text-sm">
                Every Pair has one 16:9 image of its Font and Theme together, so you see it before you change anything.
              </p>
            </Reveal>
            <Reveal className="border-border bg-card rounded-xl border p-6 sm:p-8 lg:col-span-4" index={3}>
              <h3>Make a Snapshot</h3>
              <p className="text-muted-foreground mt-4 max-w-[55ch] text-sm">
                Pick an Open or Free Font and Theme, paste your code and save a 1600 by 900 Snapshot and a thumbnail for your pull request.
              </p>
              <Button className="mt-6" variant="outline" nativeButton={false} render={<Link to="/studio" />}>
                Open Snapshot Studio
                <ArrowRight aria-hidden />
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-border border-t px-4 py-16 sm:py-24" aria-labelledby="faq">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <Reveal>
            <h2 id="faq">Questions</h2>
            <p className="text-muted-foreground mt-4 text-sm">
              Something else? Write to{" "}
              <a href="mailto:abokahfa@gmail.com" className="text-foreground underline hover:no-underline">
                abokahfa@gmail.com
              </a>
              .
            </p>
          </Reveal>
          <Reveal>
            <ul className="border-border m-0 list-none border-t p-0">
              {FAQS.map(({ q, a }) => (
                <li key={q} className="border-border border-b">
                  <details className="group">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-medium tracking-tight [&::-webkit-details-marker]:hidden">
                      {q}
                      <span aria-hidden className="text-muted-foreground font-mono text-xl leading-none">
                        <span className="group-open:hidden">+</span>
                        <span className="hidden group-open:inline">−</span>
                      </span>
                    </summary>
                    <p className="text-muted-foreground max-w-[60ch] pb-5">{a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="border-border relative isolate overflow-hidden border-t px-4 py-20 sm:py-28">
        <div aria-hidden className="bg-pattern pointer-events-none absolute inset-0 -z-10 rotate-180" />
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2>Have a setup worth sharing?</h2>
          <p className="text-muted-foreground mt-6 max-w-[52ch] text-lg">
            Open a pull request with a Pair file and its Snapshot. Git history is the record.
          </p>
          <Button className="mt-8" size="lg" nativeButton={false} render={<a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer" />}>
            Read the contribution guide
            <ArrowRight aria-hidden />
          </Button>
        </Reveal>
      </section>
    </main>
  );
}

function ShowcaseSection({ pairs, total }: { pairs: PairRecord[]; total: number }) {
  return (
    <section className="px-4 py-16 sm:py-24" aria-labelledby="recent">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="recent" className="max-w-xl">
              Real setups, ready to copy.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-[52ch]">Point at a Pair to see its Snapshot.</p>
          </div>
          <Link to="/registry" className="text-foreground text-sm font-medium underline hover:no-underline">
            See all {total} Pairs
          </Link>
        </Reveal>
        <Reveal>
          <Directory pairs={pairs} />
        </Reveal>
      </div>
    </section>
  );
}

function CopyPanel({ pair }: { pair?: { theme: { name: string; bg: string; fg: string }; font: { name: string; fontFamily: string } } }) {
  const [editor, setEditor] = useState<EditorId>("vscode");
  const [copied, setCopied] = useState(false);
  const sample = pair ?? {
    theme: { name: "Vitesse Dark", bg: "#121212", fg: "#dbd7ca" },
    font: { name: "Inconsolata", fontFamily: '"IBM Plex Mono", ui-monospace, monospace' },
  };
  const snippet = settingsFor(editor, { theme: sample.theme.name, font: sample.font.name });

  async function copy() {
    try {
      await navigator.clipboard.writeText(linesToText(snippet.lines));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <h3>Copy the Settings</h3>
      <p className="text-muted-foreground mt-4 max-w-[55ch] text-sm">
        Plain text, one Config per Editor, with no color overrides. In terminal editors only the Theme is set, because the terminal owns the Font.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Editor" className="bg-muted border-border inline-flex gap-1 rounded-full border p-1">
          {EDITOR_IDS.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={editor === id}
              onClick={() => setEditor(id)}
              className={cn(
                "h-8 rounded-full px-3.5 text-sm font-medium transition-colors",
                editor === id ? "bg-card text-foreground border-border border" : "text-muted-foreground hover:text-foreground border border-transparent",
              )}
            >
              {EDITOR_LABELS[id]}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
          <span role="status">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <PairWindow
        className="mt-4"
        pair={{ bg: sample.theme.bg, fg: sample.theme.fg, fontFamily: sample.font.fontFamily }}
        filename={snippet.filename}
        lines={snippet.lines}
      />
    </div>
  );
}
