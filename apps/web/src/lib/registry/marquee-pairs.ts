/** Pairs from https://editorsetup.som3aware.workers.dev/registry — theme colors + font faces for the marquee. */
export type MarqueePair = {
  theme: string
  font: string
  fontFamily: string
  bg: string
  fg: string
}

/** Explore Pairs with an Open or Free Font, in site order. */
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
] as const
