/** Open Theme + Font pairs from editor-setup.pages.dev/explore for the hero hook. */
export type HookPair = {
  theme: string
  font: string
  fontFamily: string
  bg: string
  fg: string
  edge: string
}

export const HOOK_PAIRS: readonly HookPair[] = [
  {
    theme: 'Palenight Theme',
    font: 'Fira Code',
    fontFamily: '"Fira Code", ui-monospace, monospace',
    bg: '#292D3E',
    fg: '#A6ACCD',
    edge: '#676E95',
  },
  {
    theme: 'Gruvbox Dark Hard',
    font: 'JetBrains Mono',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    bg: '#1d2021',
    fg: '#ebdbb2',
    edge: '#3c3836',
  },
  {
    theme: 'Aura Dark',
    font: 'Geist Mono',
    fontFamily: '"Geist Mono Variable", "Geist Mono", ui-monospace, monospace',
    bg: '#15141b',
    fg: '#edecee',
    edge: '#2d2b38',
  },
] as const

export const HOOK_INTERVAL_MS = 2800
export const HOOK_SWAP_MS = 280
