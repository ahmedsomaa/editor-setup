import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  Copy,
  Search,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { CompareArt } from "@/components/home/CompareArt";
import type { Colors } from "@/components/home/EditorArt";
import { RegistryArt } from "@/components/home/RegistryArt";
import { SettingsArt } from "@/components/home/SettingsArt";
import { StudioVisual } from "@/components/home/StudioVisual";
import { Reveal } from "@/components/layout/Reveal";
import { Button } from "@/components/ui/button";
import { MAX_COMPARE } from "@/lib/registry/compare-store";
import type { PairRecord } from "@/lib/registry/pairs";
import { cn } from "cn";

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
