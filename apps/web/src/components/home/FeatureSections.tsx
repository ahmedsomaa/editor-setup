import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CompareArt } from "@/components/home/CompareArt";
import type { Colors } from "@/components/home/EditorArt";
import { RegistryArt } from "@/components/home/RegistryArt";
import { SettingsArt } from "@/components/home/SettingsArt";
import {
  ComparingVersionsSpot,
  DuplicatingSettingsSpot,
  RecordingSnapshotSpot,
  SearchingListSpot,
  type SpotProps,
} from "@/components/home/SpotIcons";
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
  icon: (props: SpotProps) => ReactNode;
  title: string;
  body: string;
  cta?: { label: string; to: "/presets" | "/compare" | "/studio" };
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
          <Icon className="-ml-2 size-28" />
          <h2 id={id} className="mt-4 max-w-md">
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
  /** The Preset the hero is showing, so the Registry art wears its Theme. */
  colors?: Colors;
  /** Index of that Preset, so the Registry art moves with each change. */
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
        icon={SearchingListSpot}
        title="Take a look around."
        body="See what we have so far. Search, or filter by Editor and Appearance to find one that suits you."
        cta={{ label: "Open Presets", to: "/presets" }}
      >
        <RegistryArt colors={colors} step={step} />
      </Feature>
      <Feature
        id="compare"
        flip
        icon={ComparingVersionsSpot}
        title="Can’t pick?"
        body={`Line up to ${MAX_COMPARE} Presets side by side and keep the one you could look at all day.`}
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
        icon={DuplicatingSettingsSpot}
        title="Found your favorite?"
        body="Copy its Settings, a few lines of plain text, and paste them into your editor."
      >
        <SettingsArt colors={colors} />
      </Feature>
      <Feature
        id="studio"
        flip
        icon={RecordingSnapshotSpot}
        title="Couldn’t find what you’re looking for?"
        body="Try Preset Studio. It comes with open Fonts and Themes, and you can bring your own."
        cta={{ label: "Open Preset Studio", to: "/studio" }}
      >
        <StudioVisual pairs={pairs} />
      </Feature>
    </>
  );
}
