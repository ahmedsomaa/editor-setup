import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  Copy,
  FileText,
  GitPullRequest,
  MagnifyingGlass,
  Scales,
  Pause,
  Play,
  type Icon,
} from "@phosphor-icons/react";
import { EditorArt, type Colors } from "@/components/EditorArt";
import { SettingsArt } from "@/components/SettingsArt";
import { RegistryArt } from "@/components/RegistryArt";
import { LicenseTag } from "@/components/Tag";
import { Button } from "@/components/ui/button";
import { MAX_COMPARE } from "@/lib/compare-store";
import {
  isPaid,
  type License,
  type PairRecord,
} from "@/lib/pairs";
import { CONTRIBUTE_URL } from "@/lib/site";
import { cn } from "cn";

const SECTION = "border-border border-t px-4 py-24 sm:py-32";

/** One Pair drawn as the editor window in its own colours, with the tags that decide whether you may use it. */
function ArtCard({ pair }: { pair: PairRecord }) {
  return (
    <figure className="m-0 min-w-0">
      <EditorArt
        complete
        className="w-full"
        colors={{ bg: pair.theme.bg, fg: pair.theme.fg }}
      />
    </figure>
  );
}

/** Studio visual: one editor window repainted in one Pair after another, its code typed in each time. */
export function StudioVisual({ pairs }: { pairs: PairRecord[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const open = pairs.filter((p) => !isPaid(p));
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Off under reduced motion. It runs only while on screen, and anything that moves for 5 seconds can be paused.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPlaying(open.length > 1);
  }, [open.length]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(Boolean(e?.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !active) return;
    const id = window.setInterval(() => setI((n) => n + 1), 4200);
    return () => window.clearInterval(id);
  }, [playing, active]);

  if (!open.length) return null;
  const pair = open[i % open.length]!;
  return (
    <div ref={ref} data-paused={!playing}>
      <div aria-hidden className="relative">
        <EditorArt
          complete
          live
          liveKey={i}
          className="w-full"
          colors={{ bg: pair.theme.bg, fg: pair.theme.fg }}
        />
        <div key={i} className="pointer-events-none absolute inset-0">
          <div className="snap-frame absolute inset-[3%]" style={{ color: pair.theme.fg }}>
            {(
              [
                "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
                "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
                "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
                "bottom-0 right-0 border-r-2 border-b-2 rounded-br-lg",
              ] as const
            ).map((c) => (
              <span key={c} className={cn("absolute size-6 border-current", c)} />
            ))}
          </div>
          <div className="snap-flash absolute inset-0 rounded-[14px] bg-white" />
          <div className="snap-chip bg-card border-border text-foreground absolute right-3 bottom-3 flex items-center gap-2 rounded-full border py-1.5 ps-1.5 pe-3 font-mono text-xs shadow-[var(--shadow-overlay)]">
            <span
              className="border-border block h-[18px] w-8 rounded-[4px] border"
              style={{ background: pair.theme.bg }}
            />
            snapshot.png · 1600×900
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p
          key={pair.slug}
          aria-hidden
          className="bg-card border-border text-muted-foreground m-0 max-w-full truncate rounded-full border px-4 py-1.5 font-mono text-xs pair-swap"
        >
          {pair.font.name} · {pair.theme.name}
        </p>
        {open.length > 1 ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={playing ? "Pause animation" : "Play animation"}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

const FEATURE = "border-border border-t px-4 py-24 sm:py-32";

/** One feature: words on the leading edge, one picture in a panel on the trailing edge. */
function Feature({
  id,
  icon: Icon,
  title,
  body,
  cta,
  flip,
  children,
}: {
  id: string;
  flip?: boolean;
  icon: Icon;
  title: string;
  body: string;
  cta?: { label: string; to: "/registry" | "/compare" | "/studio" };
  children: ReactNode;
}) {
  return (
    <section className={FEATURE} aria-labelledby={id}>
      <div
        className={cn(
          "mx-auto grid max-w-6xl items-center gap-12 lg:gap-20",
          flip
            ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
            : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]",
        )}
      >
        <div className={cn("min-w-0", flip && "lg:order-2")}>
          <span className="bg-accent-soft text-accent-text flex size-12 items-center justify-center rounded-2xl">
            <Icon aria-hidden weight="duotone" className="size-6" />
          </span>
          <h2 id={id} className="mt-6 max-w-md">
            {title}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-[44ch] text-lg">{body}</p>
          {cta ? (
            <Button
              className="mt-8"
              variant="outline"
              nativeButton={false}
              render={<Link to={cta.to} />}
            >
              {cta.label}
              <ArrowRight aria-hidden />
            </Button>
          ) : null}
        </div>
        <div className={cn("min-w-0", flip && "lg:order-1")}>
          {children}
        </div>
      </div>
    </section>
  );
}

/** The four things the site does, each in its own section. */
export function FeatureSections({
  pairs,
  colors,
  step,
}: {
  pairs: PairRecord[];
  /** The Pair the hero is showing, so the Registry art wears its Theme. */
  colors?: Colors;
  /** Index of that Pair, so the Registry art moves with each change. */
  step?: number;
}) {
  const open = pairs.filter((p) => !isPaid(p));
  const darkArt = open.find((p) => p.theme.appearance === "dark") ?? open[0];
  const lightArt = open.find((p) => p.theme.appearance === "light") ?? open[1] ?? open[0];

  return (
    <>
      <Feature
        id="find"
        icon={MagnifyingGlass}
        title="Find a Pair"
        body="Filter the Registry by Appearance, License or Editor. Every entry is one Font and one Theme that work together, with a Snapshot to check."
        cta={{ label: "Open Registry", to: "/registry" }}
      >
        <RegistryArt colors={colors} step={step} />
      </Feature>
      <Feature
        id="compare"
        flip
        icon={Scales}
        title="Compare Pairs"
        body={`Put up to ${MAX_COMPARE} Pairs side by side. Weigh Font, Theme, Appearance and License before you pick one.`}
        cta={{ label: "Open Compare", to: "/compare" }}
      >
        {darkArt && lightArt ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <ArtCard pair={darkArt} />
            <ArtCard pair={lightArt} />
          </div>
        ) : null}
      </Feature>
      <Feature
        id="copy"
        icon={Copy}
        title="Copy the Settings"
        body="Plain text for VS Code and Zed. Paste it into your editor. It sets the Font and names the Theme, and changes no colors."
      >
        <SettingsArt colors={colors} />
      </Feature>
      <Feature
        id="studio"
        flip
        icon={Camera}
        title="Make your own Snapshot"
        body="Try an Open or Free Font and Theme on your own code, then save a 1600×900 Snapshot for your pull request."
        cta={{ label: "Open Snapshot Studio", to: "/studio" }}
      >
        <StudioVisual pairs={pairs} />
      </Feature>
    </>
  );
}

const LICENSES: Array<{ license: License; title: string; body: string }> = [
  {
    license: "open",
    title: "Use it anywhere",
    body: "An open license such as OFL or MIT. Free to use and to embed. Snapshot Studio can show it live.",
  },
  {
    license: "free",
    title: "Free, with limits",
    body: "No cost, but restricted, for example to private use. Read its terms before you use it for work.",
  },
  {
    license: "paid",
    title: "Buy it from its maker",
    body: "Costs money. You get it from the foundry or the author. The site never loads a Paid Font or Theme.",
  },
];

/** The three Licenses, in plain words. A Pair shows the strictest of its Font and Theme. */
export function LicenseSection() {
  return (
    <section className={cn(SECTION, "bg-muted/40")} aria-labelledby="license">
      <div className="mx-auto max-w-6xl">
        <h2 id="license" className="max-w-xl">
          Know what you can use.
        </h2>
        <p className="text-muted-foreground mt-4 max-w-[52ch] text-lg">
          Each Font and each Theme has its own License. A Pair shows the
          strictest of the two.
        </p>
        <ul className="border-border m-0 mt-14 grid list-none divide-y p-0 md:grid-cols-3 md:divide-x md:divide-y-0 border-y">
          {LICENSES.map(({ license, title, body }) => (
            <li key={license} className="px-0 py-8 md:px-8 md:first:ps-0 md:last:pe-0">
              <LicenseTag license={license} />
              <h3 className="mt-5">{title}</h3>
              <p className="text-muted-foreground mt-3 max-w-[40ch]">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Last ask before the footer: the Pair file is the whole submission, so show one. */
export function SharePairSection() {
  const steps = [
    {
      icon: Camera,
      title: "Make the Snapshot",
      body: "Try your Font and Theme on your own code in Snapshot Studio, then save a 1600×900 image.",
    },
    {
      icon: FileText,
      title: "Add the Pair file",
      body: "One JSON file with the Font, the Theme and the Settings, next to your Snapshot in the Registry.",
    },
    {
      icon: GitPullRequest,
      title: "Open a pull request",
      body: "Send both files on GitHub. Once it is merged, your Pair is in the Registry for everyone.",
    },
  ];

  return (
    <section className={SECTION} aria-labelledby="share">
      <div className="mx-auto max-w-6xl">
        <h2 id="share" className="max-w-md">
          Share your Pair.
        </h2>
        <p className="text-muted-foreground mt-4 max-w-[48ch]">
          Three steps, no account. Everything happens in a pull request.
        </p>
        <ol className="m-0 mt-12 grid list-none gap-4 p-0 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className="border-border bg-card hover:border-foreground/40 hover:bg-muted/60 flex flex-col rounded-2xl border p-6 transition-[border-color,background-color,translate] duration-200 ease-out motion-safe:hover:-translate-y-1 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="bg-muted border-border flex size-11 items-center justify-center rounded-full border">
                  <Icon aria-hidden className="size-5" />
                </span>
                <span aria-hidden className="text-muted-foreground font-mono text-sm">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-8">{title}</h3>
              <p className="text-muted-foreground mt-3">{body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button size="lg" nativeButton={false} render={<Link to="/studio" />}>
            Open Snapshot Studio
            <ArrowRight aria-hidden />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer" />}
          >
            Read the contribution guide
          </Button>
        </div>
      </div>
    </section>
  );
}
