import { Link } from "@tanstack/react-router";
import { ArrowRight, Pause, Play } from "lucide-react";
import { GlyphPattern } from "@/components/home/GlyphPattern";
import { TokenWindow } from "@/components/home/TokenWindow";
import type { HeroStage } from "@/components/home/useHeroStage";
import { Button } from "@/components/ui/button";
import type { PresetRecord } from "@/lib/presets/presets";
import { ADD_PRESET_URL } from "@/lib/site";
import { PLAYGROUND } from "@/lib/studio/playground-tokens";

function PresetChip({
  preset,
  on,
  onChoose,
}: {
  preset: PresetRecord;
  on: boolean;
  onChoose: (slug: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChoose(preset.slug)}
      className="inline-flex h-10 items-center rounded-full px-4 text-sm transition-[box-shadow,transform] duration-150 ease-out motion-safe:active:scale-[0.96]"
      style={{
        background: PLAYGROUND[preset.slug]?.bg ?? preset.theme.bg,
        color: PLAYGROUND[preset.slug]?.fg ?? preset.theme.fg,
        fontFamily: preset.font.fontFamily,
        boxShadow: on
          ? "0 0 0 2px var(--background), 0 0 0 4px var(--foreground)"
          : "0 0 0 1px color-mix(in srgb, var(--foreground) 14%, transparent)",
      }}
    >
      {preset.theme.name} · {preset.font.name}
    </button>
  );
}

/** The first screen: headline, calls to action and a live preview that rotates through Presets. */
export function Hero({ stage: s }: { stage: HeroStage }) {
  const { stagePresets, heroPreset, stage, playing, setPlaying, choose } = s;
  return (
    <section
      data-hero
      className="relative isolate flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden px-4 py-16"
    >
      <GlyphPattern className="bg-glyphs" />
      <div
        data-hero-scrub
        className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12"
      >
        <div className="min-w-0">
          <div className="relative w-fit max-w-full pt-8 max-sm:w-full max-sm:text-center">
            <span
              aria-hidden="true"
              style={{ "--i": 0 } as React.CSSProperties}
              className="hero-in border-border bg-card text-pastel-green-text absolute -top-1 right-4 rotate-6 rounded-full border px-2.5 pt-1 pb-0.5 font-sans text-xs leading-none font-medium tracking-[0.05em] uppercase shadow-[var(--shadow-overlay)] sm:right-10"
            >
              Free
            </span>
            <h1
              style={{ "--i": 0 } as React.CSSProperties}
              className="hero-in text-balance text-[clamp(2.5rem,4.6vw,4.5rem)]"
            >
              <span className="block">Your next ideal editor</span>{" "}
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
            <p
              style={{ "--i": 1 } as React.CSSProperties}
              className="hero-in text-muted-foreground mt-6 w-0 min-w-full text-xl leading-relaxed"
            >
              A growing list of Font and Theme Presets that developers have tried
              and kept. Preview how each one feels, then copy its Settings into
              your editor.
            </p>
          </div>
          <div
            style={{ "--i": 2 } as React.CSSProperties}
            className="hero-in mt-10 flex flex-wrap gap-3"
          >
            <Button
              size="lg"
              className="h-13 px-6 text-base"
              nativeButton={false}
              render={<Link to="/presets" />}
            >
              Browse the Presets
              <ArrowRight aria-hidden />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 px-6 text-base"
              nativeButton={false}
              render={
                <a href={ADD_PRESET_URL} target="_blank" rel="noreferrer" />
              }
            >
              Share a Preset
            </Button>
          </div>
        </div>

        <div
          style={{ "--i": 3 } as React.CSSProperties}
          className="hero-in min-w-0"
        >
          {heroPreset && PLAYGROUND[heroPreset.slug] ? (
            <div
              key={heroPreset.slug}
              className="preset-swap"
              aria-label={`${heroPreset.theme.name} with ${heroPreset.font.name}`}
              role="img"
            >
              <TokenWindow
                theme={PLAYGROUND[heroPreset.slug]!}
                fontFamily={stage.family ?? "ui-monospace, monospace"}
                filename="preset.ts"
                compact
                className="min-h-[24rem]"
              />
            </div>
          ) : null}
          <div
            role="group"
            aria-label="Try a Preset"
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              aria-pressed={playing}
              aria-label={playing ? "Pause rotation" : "Play rotation"}
              onClick={() => setPlaying((p) => !p)}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition-[opacity,transform] duration-150 ease-out hover:opacity-90 motion-safe:active:scale-[0.96]"
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
            {stagePresets.map((preset) => (
              <PresetChip
                key={preset.slug}
                preset={preset}
                on={preset.slug === heroPreset?.slug}
                onChoose={choose}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
