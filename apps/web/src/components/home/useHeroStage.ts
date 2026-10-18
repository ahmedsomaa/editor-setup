import { useEffect, useState } from "react";
import { PLAYGROUND } from "@/lib/studio/playground-tokens";
import type { PairRecord } from "@/lib/registry/pairs";

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
export function useHeroStage(pairs: PairRecord[]) {
  const [heroSlug, setHeroSlug] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  const stagePairs = PLAYGROUND_ORDER.map((slug) =>
    pairs.find((p) => p.slug === slug),
  ).filter((p): p is PairRecord => Boolean(p));

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
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [playing, stagePairs.length]);

  const heroPair = stagePairs.find((p) => p.slug === heroSlug) ?? stagePairs[0];
  // The hero is painted in the chosen Preset's own colours.
  const stage = {
    bg:
      (heroPair && PLAYGROUND[heroPair.slug]?.bg) ||
      heroPair?.theme.bg ||
      "#111111",
    fg:
      (heroPair && PLAYGROUND[heroPair.slug]?.fg) ||
      heroPair?.theme.fg ||
      "#edeceb",
    family: heroPair?.font.fontFamily,
  };

  return {
    stagePairs,
    heroPair,
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
      stagePairs.findIndex((p) => p.slug === heroPair?.slug),
    ),
  };
}

export type HeroStage = ReturnType<typeof useHeroStage>;
