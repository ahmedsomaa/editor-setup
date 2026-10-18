import { useEffect, useState } from "react";
import { PLAYGROUND } from "@/lib/studio/playground-tokens";
import type { PresetRecord } from "@/lib/presets/presets";

// The playground offers four Presets, only with Open or Free Fonts and Themes, each with its real Theme tokens.
const PLAYGROUND_ORDER = [
  "geist-mono--vesper",
  "zed-mono--gruvbox-light-hard",
  "fira-code--palenight-theme",
  "inconsolata--vitesse-light",
] as const;

const ROTATE_MS = 4500;

/**
 * The Preset shown on the home page and the colours it paints. It rotates through the Presets unless the
 * visitor prefers reduced motion. Pausing is always available, and picking a Preset stops the rotation.
 */
export function useHeroStage(presets: PresetRecord[]) {
  const [heroSlug, setHeroSlug] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const stagePresets = PLAYGROUND_ORDER.map((slug) =>
    presets.find((p) => p.slug === slug),
  ).filter((p): p is PresetRecord => Boolean(p));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing || stagePresets.length < 2) return;
    const id = window.setInterval(() => {
      setHeroSlug((cur) => {
        const i = stagePresets.findIndex(
          (p) => p.slug === (cur ?? stagePresets[0]?.slug),
        );
        return stagePresets[(i + 1) % stagePresets.length]?.slug ?? null;
      });
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [playing, stagePresets.length]);

  const heroPreset = stagePresets.find((p) => p.slug === heroSlug) ?? stagePresets[0];
  // The hero is painted in the chosen Preset's own colours.
  const stage = {
    bg:
      (heroPreset && PLAYGROUND[heroPreset.slug]?.bg) ||
      heroPreset?.theme.bg ||
      "#111111",
    fg:
      (heroPreset && PLAYGROUND[heroPreset.slug]?.fg) ||
      heroPreset?.theme.fg ||
      "#edeceb",
    family: heroPreset?.font.fontFamily,
  };

  return {
    stagePresets,
    heroPreset,
    stage,
    playing,
    setPlaying,
    /** Show this Preset and stop rotating. */
    choose: (slug: string) => {
      setPlaying(false);
      setHeroSlug(slug);
    },
    step: Math.max(
      0,
      stagePresets.findIndex((p) => p.slug === heroPreset?.slug),
    ),
  };
}

export type HeroStage = ReturnType<typeof useHeroStage>;
