/** Pairs from https://editor-setup.pages.dev/explore — theme colors + font faces for the marquee. */
export type MarqueePair = {
  theme: string
  font: string
  fontFamily: string
  bg: string
  fg: string
}

/** All eight explore pairs, in site order. */
export const MARQUEE_PAIRS: readonly MarqueePair[] = [
  {
    theme: 'Gruvbox Light Hard',
    font: 'Zed Mono',
    fontFamily: '"Zed Mono", "IBM Plex Mono", ui-monospace, monospace',
    bg: '#f9f5d7',
    fg: '#3c3836',
  },
  {
    theme: 'Aura Dark',
    font: 'Geist Mono',
    fontFamily: '"Geist Mono Variable", "Geist Mono", ui-monospace, monospace',
    bg: '#29263c',
    fg: '#a277ff',
  },
  {
    theme: 'Palenight Theme',
    font: 'Fira Code',
    fontFamily: '"Fira Code", ui-monospace, monospace',
    bg: '#292D3E',
    fg: '#A6ACCD',
  },
  {
    theme: 'Nord',
    font: 'Input Mono',
    fontFamily: '"Input Mono", "IBM Plex Mono", ui-monospace, monospace',
    bg: '#2E3440',
    fg: '#88C0D0',
  },
  {
    theme: 'Gruvbox Dark Hard',
    font: 'JetBrains Mono',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    bg: '#1d2021',
    fg: '#ebdbb2',
  },
  {
    theme: 'Vesper',
    font: 'Geist Mono',
    fontFamily: '"Geist Mono Variable", "Geist Mono", ui-monospace, monospace',
    bg: '#101010',
    fg: '#FFC799',
  },
  {
    theme: 'Night Owl',
    font: 'Dank Mono',
    fontFamily: '"Dank Mono", "IBM Plex Mono", ui-monospace, monospace',
    bg: '#011627',
    fg: '#7fdbca',
  },
  {
    theme: 'Houston',
    font: 'MonoLisa',
    fontFamily: '"MonoLisa", "IBM Plex Mono", ui-monospace, monospace',
    bg: '#17191e',
    fg: '#54b9ff',
  },
] as const
