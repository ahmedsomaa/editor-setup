import samplePair from '../../../../registry/pairs/inconsolata--vitesse-dark.json'

export type PairRecord = {
  font: { name: string; links: string[]; license: string }
  theme: {
    name: string
    links: string[]
    license: string
    appearance: string
  }
  editors: Array<{ id: string; snapshot: string; settings: string }>
}

/** Stub registry: real Pair files on main. Full Registry UI is issue 01. */
export function listPairs(): Array<PairRecord & { slug: string }> {
  const pair = samplePair as PairRecord
  return [
    {
      ...pair,
      slug: 'inconsolata--vitesse-dark',
    },
  ]
}
