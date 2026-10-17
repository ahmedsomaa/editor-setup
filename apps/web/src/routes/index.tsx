import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Copy, Pause, Play } from "@phosphor-icons/react";
import {
  AddPairSection,
  CompareSection,
  GapSection,
  IntroSection,
  OneFileSection,
} from "@/components/HomeSections";
import { GlyphPattern } from "@/components/GlyphPattern";
import { PairWindow } from "@/components/PairWindow";
import { TokenWindow } from "@/components/TokenWindow";
import { PLAYGROUND } from "@/lib/playground-tokens";
import { SETTINGS_TOKENS } from "@/lib/settings-tokens";
import { Reveal } from "@/components/Reveal";
import { LicenseTag } from "@/components/Tag";
import { Button } from "@/components/ui/button";
import {
  EDITOR_LABELS,
  isPaid,
  type EditorId,
  type PairRecord,
} from "@/lib/pairs";
import { linesToText, settingsFor } from "@/lib/settings-snippet";
import { CONTRIBUTE_URL } from "@/lib/site";
import { listPairsFn } from "@/server/pairs.functions";
import { cn } from "cn";

export const Route = createFileRoute("/")({
  loader: () => listPairsFn({ data: {} }),
  component: HomePage,
});

const PLAYGROUND_ORDER = [
  "geist-mono--vesper",
  "zed-mono--gruvbox-light-hard",
  "fira-code--palenight-theme",
  "inconsolata--vitesse-light",
] as const;

const STEPS = [
  {
    title: "Find a Pair",
    body: "Browse the Registry by Appearance, License or Editor, and open any row to see the whole Pair.",
  },
  {
    title: "Check the Snapshot",
    body: "Every Pair has one 16:9 image of its Font and Theme together, so you see it before you change anything.",
  },
  {
    title: "Copy the Settings",
    body: "Plain text, one Config per Editor, with no color overrides. In terminal editors only the Theme is set, because the terminal owns the Font.",
  },
] as const;

const LICENSES = [
  {
    license: "open",
    text: "An open license such as OFL or MIT. Free to use and embed.",
  },
  {
    license: "free",
    text: "No cost, with limits such as private use only.",
  },
  {
    license: "paid",
    text: "Shown only as a Snapshot from a developer who owns the License.",
  },
] as const;

/** Editors with Settings to copy for now; Cursor shares the VS Code format. */
const COPY_EDITORS = [
  "vscode",
  "cursor",
] as const satisfies readonly EditorId[];

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
    a: "VS Code and Cursor for now. A Pair can have a Config for one or both.",
  },
  {
    q: "Is it free?",
    a: "The site is free. Each Font and Theme has its own License, shown on every Pair as Open, Free or Paid.",
  },
  {
    q: "How do I add a Pair?",
    a: "Open a pull request with a Pair file and its Snapshot. Make the Snapshot in Snapshot Studio, or with the carbon-snapshot skill in Claude Code. There is no form on the site.",
  },
] as const;

function HomePage() {
  const { pairs } = Route.useLoaderData();
  const [heroSlug, setHeroSlug] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  // The playground offers four Pairs, only with Open or Free Fonts and Themes, each with its real Theme tokens.
  const stagePairs = PLAYGROUND_ORDER.map((slug) =>
    pairs.find((p) => p.slug === slug),
  ).filter((p): p is PairRecord => Boolean(p) && !isPaid(p as PairRecord));

  // Rotate through the Pairs unless the visitor prefers reduced motion. Pausing is always available,
  // and a click on a Pair stops the rotation.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing || stagePairs.length < 2) return;
    const id = window.setInterval(() => {
      setHeroSlug((cur) => {
        const i = stagePairs.findIndex(
          (p) => p.slug === (cur ?? stagePairs[0]?.slug),
        );
        return stagePairs[(i + 1) % stagePairs.length]?.slug ?? null;
      });
    }, 4500);
    return () => window.clearInterval(id);
  }, [playing, stagePairs.length]);
  const heroPair = stagePairs.find((p) => p.slug === heroSlug) ?? stagePairs[0];
  // The hero is painted in the chosen Pair's own colours. Paid Fonts never load, so they keep the site's mono.
  const stage = {
    bg:
      (heroPair && PLAYGROUND[heroPair.slug]?.bg) ||
      heroPair?.theme.bg ||
      "#111111",
    fg:
      (heroPair && PLAYGROUND[heroPair.slug]?.fg) ||
      heroPair?.theme.fg ||
      "#edeceb",
    family:
      heroPair && !isPaid(heroPair) ? heroPair.font.fontFamily : undefined,
  };

  const chip = (pair: PairRecord, hidden: boolean) => {
    const on = pair.slug === heroPair?.slug;
    return (
      <button
        key={pair.slug}
        type="button"
        aria-pressed={on}
        tabIndex={hidden ? -1 : undefined}
        onClick={() => {
          setPlaying(false);
          setHeroSlug(pair.slug);
        }}
        className="inline-flex h-10 items-center rounded-full px-4 text-sm transition-shadow"
        style={{
          background: PLAYGROUND[pair.slug]?.bg ?? pair.theme.bg,
          color: PLAYGROUND[pair.slug]?.fg ?? pair.theme.fg,
          fontFamily: pair.font.fontFamily,
          boxShadow: on
            ? "0 0 0 2px var(--background), 0 0 0 4px var(--foreground)"
            : "0 0 0 1px color-mix(in srgb, var(--foreground) 14%, transparent)",
        }}
      >
        {pair.theme.name} · {pair.font.name}
      </button>
    );
  };

  return (
    <main id="main">
      <section className="relative isolate flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden px-4 py-16">
        <GlyphPattern className="bg-glyphs" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          <div className="min-w-0">
            <div className="w-fit max-w-full">
              <h1 className="relative mt-8 text-balance text-[clamp(2.5rem,4.6vw,4.5rem)]">
                <span
                  aria-hidden="true"
                  className="border-border bg-card text-pastel-green-text absolute -top-9 right-4 rotate-6 rounded-full border px-2.5 pt-1 pb-0.5 font-sans text-xs leading-none font-medium tracking-[0.05em] uppercase shadow-[var(--shadow-overlay)] sm:right-10"
                >
                  Free
                </span>
                <span className="block">Your next ideal editor</span>
                setup is{" "}
                <span className="relative inline-block whitespace-nowrap">
                  <svg className="absolute h-0 w-0" aria-hidden="true">
                    <defs>
                      <filter
                        id="hook-rough"
                        x="-30%"
                        y="-30%"
                        width="160%"
                        height="160%"
                      >
                        <feTurbulence
                          type="fractalNoise"
                          baseFrequency="0.035"
                          numOctaves="2"
                          seed="11"
                          result="n"
                        />
                        <feDisplacementMap
                          in="SourceGraphic"
                          in2="n"
                          scale="2"
                          xChannelSelector="R"
                          yChannelSelector="G"
                        />
                      </filter>
                    </defs>
                  </svg>
                  one click away.
                  <svg
                    className="text-accent-text/35 pointer-events-none absolute bottom-[-0.12em] left-[-1%] h-[0.32em] w-[102%]"
                    viewBox="0 0 140 10"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3,6 C40,3 100,3 137,5"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      filter="url(#hook-rough)"
                    />
                  </svg>
                </span>
              </h1>
              <p className="text-muted-foreground mt-6 w-0 min-w-full text-xl leading-relaxed">
                A curated list of font and theme pairings that just work.
                Preview each setup before you try it, pick your favorite and
                copy the config.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="h-13 px-6 text-base"
                nativeButton={false}
                render={<Link to="/registry" />}
              >
                Browse setups
                <ArrowRight aria-hidden />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-6 text-base"
                nativeButton={false}
                render={
                  <a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer" />
                }
              >
                Share a pair
              </Button>
            </div>
          </div>

          <div className="min-w-0">
            {heroPair && PLAYGROUND[heroPair.slug] ? (
              <div
                key={heroPair.slug}
                className="pair-swap"
                aria-label={`${heroPair.theme.name} with ${heroPair.font.name}`}
                role="img"
              >
                <TokenWindow
                  theme={PLAYGROUND[heroPair.slug]!}
                  fontFamily={stage.family ?? "ui-monospace, monospace"}
                  filename="pair.ts"
                  compact
                  className="min-h-[24rem]"
                />
              </div>
            ) : null}
            <div
              role="group"
              aria-label="Try a Pair"
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
            >
              <button
                type="button"
                aria-pressed={playing}
                aria-label={playing ? "Pause rotation" : "Play rotation"}
                onClick={() => setPlaying((p) => !p)}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors hover:opacity-90"
                style={{
                  background: stage.bg,
                  color: stage.fg,
                  borderColor: `color-mix(in srgb, ${stage.fg} 35%, ${stage.bg})`,
                }}
              >
                {playing ? (
                  <Pause className="size-4" aria-hidden />
                ) : (
                  <Play className="size-4" aria-hidden />
                )}
              </button>
              {stagePairs.map((pair) => chip(pair, false))}
            </div>
          </div>
        </div>
      </section>

      {heroPair ? (
        <IntroSection
          slug={heroPair.slug}
          bg={stage.bg}
          fg={stage.fg}
          fontFamily={heroPair.font.fontFamily}
        />
      ) : null}

      <section
        className="border-border border-t px-4 py-16 sm:py-24"
        aria-labelledby="how"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
            <Reveal className="min-w-0">
              <h2 id="how" className="max-w-md">
                Find a Pair, then paste its Settings.
              </h2>
              <ol className="mt-10 flex list-none flex-col gap-8 p-0">
                {STEPS.map(({ title, body }, i) => (
                  <li
                    key={title}
                    className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2"
                  >
                    <span
                      aria-hidden
                      className="text-muted-foreground pt-1 font-mono text-sm tabular-nums"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3>{title}</h3>
                      <p className="text-muted-foreground mt-2 max-w-[48ch]">
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
            <Reveal className="min-w-0 lg:pt-3" index={1}>
              <CopyPanel
                pair={
                  heroPair && {
                    slug: heroPair.slug,
                    theme: {
                      name: heroPair.theme.name,
                      bg: stage.bg,
                      fg: stage.fg,
                    },
                    font: {
                      name: heroPair.font.name,
                      fontFamily: heroPair.font.fontFamily,
                    },
                  }
                }
              />
            </Reveal>
          </div>

          <div className="border-border mt-16 grid gap-12 border-t pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
            <Reveal className="min-w-0">
              <h3>Know the License</h3>
              <dl className="mt-6 flex flex-col gap-4">
                {LICENSES.map(({ license, text }) => (
                  <div
                    key={license}
                    className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-x-4"
                  >
                    <dt>
                      <LicenseTag license={license} />
                    </dt>
                    <dd className="text-muted-foreground max-w-[48ch] text-sm">
                      {text}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
            <Reveal className="min-w-0" index={1}>
              <h3>Make a Snapshot</h3>
              <p className="text-muted-foreground mt-4 max-w-[52ch]">
                Pick an Open or Free Font and Theme, paste your code and save a
                1600×900 Snapshot for your pull request.
              </p>
              <Button
                className="mt-6"
                variant="outline"
                nativeButton={false}
                render={<Link to="/studio" />}
              >
                Open Snapshot Studio
                <ArrowRight aria-hidden />
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      <OneFileSection pairs={pairs} />

      <CompareSection pairs={pairs} />

      <GapSection pairs={pairs} />

      <section
        className="border-border border-t px-4 py-16 sm:py-24"
        aria-labelledby="faq"
      >
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
          <Reveal>
            <h2 id="faq">Questions</h2>
            <p className="text-muted-foreground mt-4 text-sm">
              Something else? Write to{" "}
              <a
                href="mailto:abokahfa@gmail.com"
                className="text-foreground underline hover:no-underline"
              >
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
                      <span
                        aria-hidden
                        className="text-muted-foreground font-mono text-xl leading-none"
                      >
                        <span className="group-open:hidden">+</span>
                        <span className="hidden group-open:inline">−</span>
                      </span>
                    </summary>
                    <p className="text-muted-foreground max-w-[60ch] pb-5">
                      {a}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <AddPairSection />
    </main>
  );
}

function CopyPanel({
  pair,
}: {
  pair?: {
    slug?: string;
    theme: { name: string; bg: string; fg: string };
    font: { name: string; fontFamily: string };
  };
}) {
  const [editor, setEditor] = useState<EditorId>("vscode");
  const [copied, setCopied] = useState<"done" | "failed" | null>(null);
  const sample = pair ?? {
    theme: { name: "Vitesse Dark", bg: "#121212", fg: "#dbd7ca" },
    font: {
      name: "Inconsolata",
      fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
    },
  };
  const tokens = pair?.slug ? SETTINGS_TOKENS[pair.slug] : undefined;
  const snippet = settingsFor(editor, {
    theme: sample.theme.name,
    font: sample.font.name,
  });

  async function copy() {
    try {
      await navigator.clipboard.writeText(linesToText(snippet.lines));
      setCopied("done");
    } catch {
      setCopied("failed");
    }
    window.setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Editor"
          className="bg-muted border-border inline-flex gap-1 rounded-full border p-1"
        >
          {COPY_EDITORS.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={editor === id}
              onClick={() => setEditor(id)}
              className={cn(
                "h-8 rounded-full px-3.5 text-sm font-medium transition-colors",
                editor === id
                  ? "bg-card text-foreground border-border border"
                  : "text-muted-foreground hover:text-foreground border border-transparent",
              )}
            >
              {EDITOR_LABELS[id]}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={copy}>
          {copied === "done" ? <Check aria-hidden /> : <Copy aria-hidden />}
          {copied === "done" ? "Copied" : "Copy"}
        </Button>
        <span
          role="status"
          className="text-muted-foreground w-full text-sm empty:hidden"
        >
          {copied === "failed"
            ? "Unable to copy. Select the text below and copy it yourself."
            : ""}
        </span>
      </div>
      {tokens ? (
        <TokenWindow
          className="mt-4"
          theme={{ bg: sample.theme.bg, fg: sample.theme.fg, lines: tokens }}
          fontFamily={sample.font.fontFamily}
          filename={snippet.filename}
        />
      ) : (
        <PairWindow
          className="mt-4"
          pair={{
            bg: sample.theme.bg,
            fg: sample.theme.fg,
            fontFamily: sample.font.fontFamily,
          }}
          filename={snippet.filename}
          lines={snippet.lines}
        />
      )}
    </div>
  );
}
