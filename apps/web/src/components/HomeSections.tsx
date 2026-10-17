import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Copy } from "@phosphor-icons/react";
import { GlyphPattern } from "@/components/GlyphPattern";
import { PairWindow, textToLines } from "@/components/PairWindow";
import { Reveal } from "@/components/Reveal";
import { SnapshotImage } from "@/components/SnapshotImage";
import { TokenWindow } from "@/components/TokenWindow";
import { INTRO_LANGS, INTRO_TOKENS, type IntroLang } from "@/lib/intro-tokens";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EDITOR_LABELS,
  getEditorConfig,
  isPaid,
  pairLabel,
  type EditorId,
  type PairRecord,
} from "@/lib/pairs";
import { CONTRIBUTE_URL } from "@/lib/site";
import { snapshotUrl } from "@/lib/snapshots";

const SECTION = "border-border border-t px-4 py-16 sm:py-24";

/** EditorSetup in a few lines of code, in a few languages, coloured by the hero's Pair. */
export function IntroSection({
  slug,
  bg,
  fg,
  fontFamily,
}: {
  slug: string;
  bg: string;
  fg: string;
  fontFamily: string;
}) {
  const [lang, setLang] = useState<IntroLang>("typescript");
  const lines = INTRO_TOKENS[slug]?.[lang];
  const file = INTRO_LANGS.find((l) => l.id === lang)?.file ?? "intro.ts";
  if (!lines) return null;

  return (
    <section className={SECTION} aria-labelledby="intro">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-12">
        <Reveal className="min-w-0">
          <h2 id="intro" className="max-w-md">
            EditorSetup, in a few lines.
          </h2>
          <p className="text-muted-foreground mt-6 max-w-[48ch] text-lg">
            Pick a Pair, check its Snapshot, copy its Settings. The idea fits in
            any language you read.
          </p>
        </Reveal>
        <Reveal className="min-w-0" index={1}>
          <div
            role="group"
            aria-label="Language"
            className="bg-muted border-border mb-4 inline-flex flex-wrap gap-1 rounded-full border p-1"
          >
            {INTRO_LANGS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={lang === id}
                onClick={() => setLang(id)}
                className={
                  lang === id
                    ? "bg-card text-foreground border-border h-8 rounded-full border px-3.5 text-sm font-medium"
                    : "text-muted-foreground hover:text-foreground h-8 rounded-full border border-transparent px-3.5 text-sm font-medium transition-colors"
                }
              >
                {label}
              </button>
            ))}
          </div>
          <TokenWindow
            theme={{ bg, fg, lines }}
            fontFamily={fontFamily}
            filename={file}
          />
        </Reveal>
      </div>
    </section>
  );
}

/** The Snapshot of a Pair in one Editor; a live window for Open and Free Pairs that lack one. */
function PairFace({ pair, editor }: { pair: PairRecord; editor: EditorId }) {
  const config = getEditorConfig(pair, editor);
  const src = config ? snapshotUrl(config.snapshot) : undefined;
  if (src) {
    return (
      <SnapshotImage
        src={src}
        alt={`${pair.theme.name} with ${pair.font.name} in ${EDITOR_LABELS[editor]}`}
        className="rounded-[1.1rem]"
      />
    );
  }
  if (!isPaid(pair) && config) {
    return (
      <PairWindow
        pair={{
          fontFamily: pair.font.fontFamily,
          bg: pair.theme.bg,
          fg: pair.theme.fg,
        }}
        filename="settings.json"
        lines={textToLines(config.settings)}
      />
    );
  }
  return (
    <div className="border-border text-muted-foreground flex aspect-video w-full items-center justify-center rounded-xl border border-dashed text-sm">
      Snapshot only
    </div>
  );
}

/** One Pair file beside the page it becomes. */
export function OneFileSection({ pairs }: { pairs: PairRecord[] }) {
  const pair =
    pairs.find((p) => p.slug === "inconsolata--vitesse-dark") ??
    pairs.find((p) => !isPaid(p));
  const config = pair?.editors[0];
  if (!pair || !config) return null;

  const file = JSON.stringify(
    {
      font: {
        name: pair.font.name,
        links: pair.font.links,
        license: pair.font.license,
      },
      theme: {
        name: pair.theme.name,
        links: pair.theme.links,
        license: pair.theme.license,
        appearance: pair.theme.appearance,
      },
      editors: pair.editors.map(({ id, snapshot, settings }) => ({
        id,
        snapshot,
        settings,
      })),
    },
    null,
    2,
  );

  return (
    <section className={SECTION} aria-labelledby="one-file">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 id="one-file" className="max-w-xl">
            One file in, one Pair out.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-[52ch]">
            A Pair is a JSON file in the repository. Once it is on main with a
            Snapshot, it shows up in the Registry exactly like this.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
          <Reveal className="min-w-0" index={1}>
            <div className="border-border bg-card overflow-hidden rounded-xl border">
              <div className="border-border text-muted-foreground truncate border-b px-4 py-3 font-mono text-xs">
                registry/pairs/{pair.slug}.json
              </div>
              <pre className="m-0 px-4 py-4 font-mono text-[13px] leading-[1.7] break-words whitespace-pre-wrap">
                <code>{file}</code>
              </pre>
            </div>
          </Reveal>
          <Reveal className="min-w-0" index={2}>
            <figure className="m-0">
              <PairFace pair={pair} editor={config.id} />
              <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-muted-foreground text-sm">
                  {pair.theme.name} with {pair.font.name}, in{" "}
                  {EDITOR_LABELS[config.id]}.
                </span>
                <Link
                  to="/registry/$slug"
                  params={{ slug: pair.slug }}
                  className="text-foreground text-sm font-medium underline hover:no-underline"
                >
                  Open this Pair
                </Link>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PairSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: PairRecord[];
  onChange: (slug: string) => void;
}) {
  const items = options.map((p) => ({
    value: p.slug,
    label: pairLabel(p),
  }));
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Select
        items={items}
        value={value}
        onValueChange={(v) => v && onChange(v)}
      >
        <SelectTrigger id={id} className="mt-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** Two Pairs side by side through one shared Editor. */
export function CompareSection({ pairs }: { pairs: PairRecord[] }) {
  const options = pairs.filter(
    (p) => !isPaid(p) || p.editors.some((e) => snapshotUrl(e.snapshot)),
  );
  const [aSlug, setASlug] = useState(options[0]?.slug ?? "");
  const [bSlug, setBSlug] = useState(
    options[1]?.slug ?? options[0]?.slug ?? "",
  );
  const a = options.find((p) => p.slug === aSlug);
  const b = options.find((p) => p.slug === bSlug);
  if (options.length < 2 || !a || !b) return null;

  const shared = a.editors.find((e) =>
    b.editors.some((x) => x.id === e.id),
  )?.id;

  return (
    <section className={SECTION} aria-labelledby="compare">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 id="compare" className="max-w-xl">
            Compare two Pairs.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-[52ch]">
            Choose any two and see their Snapshots side by side, in an Editor
            both have Settings for.
          </p>
        </Reveal>
        <Reveal className="mt-12" index={1}>
          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            {[
              { id: "compare-a", label: "First Pair", pair: a, set: setASlug },
              { id: "compare-b", label: "Second Pair", pair: b, set: setBSlug },
            ].map(({ id, label, pair, set }) => (
              <div key={id} className="min-w-0">
                <PairSelect
                  id={id}
                  label={label}
                  value={pair.slug}
                  options={options}
                  onChange={set}
                />
                <div className="mt-4">
                  {shared ? (
                    <PairFace pair={pair} editor={shared} />
                  ) : (
                    <div className="border-border text-muted-foreground flex aspect-video w-full items-center justify-center rounded-xl border border-dashed p-6 text-center text-sm">
                      These two Pairs share no Editor, so they cannot be
                      compared.
                    </div>
                  )}
                </div>
                <p className="mt-3 text-sm">
                  <Link
                    to="/registry/$slug"
                    params={{ slug: pair.slug }}
                    className="text-foreground font-medium underline hover:no-underline"
                  >
                    Open {pair.theme.name} with {pair.font.name}
                  </Link>
                </p>
              </div>
            ))}
          </div>
          <p
            role="status"
            className="text-muted-foreground mt-6 text-sm empty:hidden"
          >
            {shared ? `Showing ${EDITOR_LABELS[shared]}.` : ""}
          </p>
          <p className="mt-4 text-sm">
            <Link
              to="/compare"
              search={{ pairs: `${a.slug},${b.slug}` }}
              className="text-foreground font-medium underline hover:no-underline"
            >
              Open Compare to add more Pairs
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** Every Font by Theme combination: filled where a Pair exists, empty where nobody has paired them. Paid Fonts are left out. */
export function GapSection({ pairs: allPairs }: { pairs: PairRecord[] }) {
  const pairs = allPairs.filter((p) => p.font.license !== "paid");
  const fonts = [...new Set(pairs.map((p) => p.font.name))].sort();
  const themes = [
    ...new Map(pairs.map((p) => [p.theme.name, p.theme.appearance])).entries(),
  ]
    .sort(
      ([an, aa], [bn, ba]) =>
        (aa === ba ? 0 : aa === "dark" ? -1 : 1) || an.localeCompare(bn),
    )
    .map(([name]) => name);
  const bySlot = new Map(
    pairs.map((p) => [`${p.font.name}|${p.theme.name}`, p]),
  );
  if (fonts.length < 2 || themes.length < 2) return null;

  return (
    <section className={SECTION} aria-labelledby="gaps">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="gaps" className="max-w-xl">
              Find the gap.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-[52ch]">
              A coloured square is a Pair already in the Registry. A dashed one
              is a Font and Theme nobody has paired yet.
            </p>
          </div>
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer" />
            }
          >
            Add a Pair
            <ArrowRight aria-hidden />
          </Button>
        </Reveal>
        <Reveal className="mt-12" index={1}>
          <p className="text-muted-foreground mb-3 text-sm sm:hidden">
            Scroll sideways to see every Theme.
          </p>
          <div
            role="region"
            aria-label="Fonts and Themes, paired or not"
            tabIndex={0}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[42rem] border-separate border-spacing-1">
              <caption className="sr-only">
                Which Fonts have a Pair with which Themes
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="w-36">
                    <span className="sr-only">Font</span>
                  </th>
                  {themes.map((t) => (
                    <th
                      key={t}
                      scope="col"
                      className="text-muted-foreground px-1 pb-2 text-start align-bottom text-sm font-normal"
                    >
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fonts.map((f) => (
                  <tr key={f}>
                    <th
                      scope="row"
                      className="pe-3 text-start text-sm font-medium"
                    >
                      {f}
                    </th>
                    {themes.map((t) => {
                      const pair = bySlot.get(`${f}|${t}`);
                      return (
                        <td key={t} className="p-0">
                          {pair ? (
                            <Link
                              to="/registry/$slug"
                              params={{ slug: pair.slug }}
                              aria-label={`${pair.theme.name} with ${pair.font.name}`}
                              className="flex h-12 items-center justify-center rounded-md border text-sm no-underline"
                              style={
                                isPaid(pair)
                                  ? undefined
                                  : {
                                      background: pair.theme.bg,
                                      color: pair.theme.fg,
                                      fontFamily: pair.font.fontFamily,
                                      borderColor: `color-mix(in srgb, ${pair.theme.fg} 20%, ${pair.theme.bg})`,
                                    }
                              }
                            >
                              Aa
                            </Link>
                          ) : (
                            <span className="border-border flex h-12 rounded-md border border-dashed">
                              <span className="sr-only">Not added yet</span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function CopyCommand({ command }: { command: string }) {
  const [state, setState] = useState<"done" | "failed" | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setState("done");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState(null), 2000);
  }

  return (
    <div>
      <div className="border-border bg-card flex items-center justify-between gap-3 rounded-xl border py-2 ps-4 pe-2">
        <code className="font-mono text-sm">{command}</code>
        <Button variant="outline" size="sm" onClick={copy}>
          {state === "done" ? <Check aria-hidden /> : <Copy aria-hidden />}
          {state === "done" ? "Copied" : "Copy"}
        </Button>
      </div>
      <p
        role="status"
        className="text-muted-foreground mt-2 text-sm empty:hidden"
      >
        {state === "failed"
          ? "Unable to copy. Select the command and copy it yourself."
          : ""}
      </p>
    </div>
  );
}

/** The contribution path as the ordered steps it is. */
export function AddPairSection() {
  return (
    <section
      className={`${SECTION} relative isolate overflow-hidden`}
      aria-labelledby="add-pair"
    >
      <GlyphPattern id="glyph-tile-cta" className="bg-glyphs-up" />
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
        <Reveal className="min-w-0">
          <h2 id="add-pair" className="max-w-md">
            Add your Pair in five steps.
          </h2>
          <p className="text-muted-foreground mt-6 max-w-[48ch] text-lg">
            There is no form and no account. A pull request is the whole
            process, and Git history is the record.
          </p>
          <Button
            className="mt-8"
            size="lg"
            nativeButton={false}
            render={
              <a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer" />
            }
          >
            Read the contribution guide
            <ArrowRight aria-hidden />
          </Button>
        </Reveal>
        <Reveal className="min-w-0" index={1}>
          <ol className="m-0 flex list-none flex-col gap-6 p-0">
            {[
              <>Fork the repository and branch from main.</>,
              <>
                Add{" "}
                <code className="font-mono text-sm">
                  registry/pairs/&lt;font&gt;--&lt;theme&gt;.json
                </code>
                .
              </>,
              <>
                Make the Snapshot in{" "}
                <Link
                  to="/studio"
                  className="text-foreground underline hover:no-underline"
                >
                  Snapshot Studio
                </Link>
                , or run the{" "}
                <code className="font-mono text-sm">snapshot-studio</code> skill
                in Claude Code.
              </>,
              <>Check your files with the command below.</>,
              <>Open a pull request naming the Font, Theme and Editors.</>,
            ].map((step, i) => (
              <li
                key={i}
                className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2"
              >
                <span
                  aria-hidden
                  className="text-muted-foreground font-mono text-sm tabular-nums"
                >
                  {i + 1}
                </span>
                <div className="max-w-[52ch]">{step}</div>
              </li>
            ))}
          </ol>
          <div className="mt-8 max-w-sm">
            <CopyCommand command="bun run check" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
