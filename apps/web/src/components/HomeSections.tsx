import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  Copy,
  FileText,
  GitPullRequest,
  Search,
  Scale,
  Pause,
  Play,
  type LucideIcon,
} from "lucide-react";
import { CompareArt } from "@/components/CompareArt";
import { Reveal } from "@/components/Reveal";
import { EditorArt, type Colors } from "@/components/EditorArt";
import { SettingsArt } from "@/components/SettingsArt";
import { RegistryArt } from "@/components/RegistryArt";
import { LicenseTag } from "@/components/Tag";
import { Button } from "@/components/ui/button";
import { MAX_COMPARE } from "@/lib/compare-store";
import { type License, type PairRecord } from "@/lib/pairs";
import { CONTRIBUTE_URL } from "@/lib/site";
import { cn } from "cn";

const SECTION = "border-border border-t px-4 py-24 sm:py-32";

/** Studio visual: one editor window repainted in one Pair after another, its code typed in each time. */
export function StudioVisual({ pairs }: { pairs: PairRecord[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const open = pairs;
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
    const io = new IntersectionObserver(([e]) =>
      setActive(Boolean(e?.isIntersecting)),
    );
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
          <div
            className="snap-frame absolute inset-[3%]"
            style={{ color: pair.theme.fg }}
          >
            {(
              [
                "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
                "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
                "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
                "bottom-0 right-0 border-r-2 border-b-2 rounded-br-lg",
              ] as const
            ).map((c) => (
              <span
                key={c}
                className={cn("absolute size-6 border-current", c)}
              />
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
      <div className="mt-4 flex justify-end">
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

const FEATURE = "border-border overflow-x-clip border-t px-4 py-24 sm:py-32";

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
  icon: LucideIcon;
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
        <Reveal
          from={flip ? "end" : "start"}
          className={cn("min-w-0", flip && "lg:order-2")}
        >
          <Icon aria-hidden className="size-8" />
          <h2 id={id} className="mt-6 max-w-md">
            {title}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-[44ch] text-lg">
            {body}
          </p>
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
        </Reveal>
        <Reveal
          index={1}
          from={flip ? "start" : "end"}
          className={cn("min-w-0", flip && "lg:order-1")}
        >
          <div data-drift>{children}</div>
        </Reveal>
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
  const open = pairs;
  const darkArt = open.find((p) => p.theme.appearance === "dark") ?? open[0];
  const lightArt =
    open.find((p) => p.theme.appearance === "light") ?? open[1] ?? open[0];

  return (
    <>
      <Feature
        id="find"
        icon={Search}
        title="Find a Pair"
        body="Skip the guesswork. Filter by Appearance, License or Editor, and see each Font and Theme together before you commit."
        cta={{ label: "Open Registry", to: "/registry" }}
      >
        <RegistryArt colors={colors} step={step} />
      </Feature>
      <Feature
        id="compare"
        flip
        icon={Scale}
        title="Compare Pairs"
        body={`Can’t pick? Line up to ${MAX_COMPARE} Pairs side by side and keep the one you would look at all day.`}
        cta={{ label: "Open Compare", to: "/compare" }}
      >
        {darkArt && lightArt ? (
          <CompareArt
            a={{ bg: darkArt.theme.bg, fg: darkArt.theme.fg }}
            b={{ bg: lightArt.theme.bg, fg: lightArt.theme.fg }}
          />
        ) : null}
      </Feature>
      <Feature
        id="copy"
        icon={Copy}
        title="Copy the Settings"
        body="Plain-text Settings for your editor. Paste a few lines and the look is yours."
      >
        <SettingsArt colors={colors} />
      </Feature>
      <Feature
        id="studio"
        flip
        icon={Camera}
        title="Make your own Snapshot"
        body="Preview a Pair on your own code before you change your Settings. Like it? Save a Snapshot to share."
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
];

/** The two Licenses, in plain words. A Pair shows the strictest of its Font and Theme. */
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
        <ul className="border-border m-0 mt-14 grid list-none divide-y p-0 md:grid-cols-2 md:divide-x md:divide-y-0 border-y">
          {LICENSES.map(({ license, title, body }) => (
            <Reveal
              as="li"
              index={LICENSES.findIndex((l) => l.license === license)}
              key={license}
              className="px-0 py-8 md:px-8 md:first:ps-0 md:last:pe-0"
            >
              <LicenseTag license={license} />
              <h3 className="mt-5">{title}</h3>
              <p className="text-muted-foreground mt-3 max-w-[40ch]">{body}</p>
            </Reveal>
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
            <Reveal
              as="li"
              index={i}
              key={title}
              className="group border-border bg-card relative isolate flex flex-col overflow-hidden rounded-2xl border p-6 sm:p-8"
            >
              <svg
                aria-hidden
                viewBox="0 0 64 100"
                className="text-foreground/[0.07] group-hover:text-accent-text/25 pointer-events-none absolute inset-y-0 end-2 -z-10 h-full w-auto transition-colors duration-200 ease-out"
              >
                <text
                  x="64"
                  y="90"
                  textAnchor="end"
                  fontSize="120"
                  fill="currentColor"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {i + 1}
                </text>
              </svg>
              <Icon aria-hidden className="size-8" />
              <h3 className="mt-8">{title}</h3>
              <p className="text-muted-foreground mt-3">{body}</p>
            </Reveal>
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
            render={
              <a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer" />
            }
          >
            Read the contribution guide
          </Button>
        </div>
      </div>
    </section>
  );
}
