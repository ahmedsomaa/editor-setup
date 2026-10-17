/** Release notes, newest first. */
export const ENTRIES = [
  {
    date: "2026-10-17",
    title: "Pair updates",
    changes: [
      "Updated Pair: Fira Code with Palenight Theme.",
      "Updated Pair: Geist Mono with Aura Dark.",
      "Updated Pair: Geist Mono with Vesper.",
      "Updated Pair: Inconsolata with Vitesse Dark.",
      "Updated Pair: Inconsolata with Vitesse Light.",
      "Updated Pair: JetBrains Mono with Gruvbox Dark Hard.",
      "Updated Pair: Zed Mono with Gruvbox Light Hard.",
    ],
  },
  {
    date: "2026-10-17",
    title: "Landing sections and motion",
    changes: [
      "Rebuilt landing sections with animated art for Compare and Snapshot.",
      "A Compare drawer picker, and pagination in the Registry.",
      "A reworked Snapshot Studio with swatches in its menus, plus new Snapshots.",
      "Paid licenses dropped, and icons moved to Lucide.",
      "A page transition, site-wide smooth scroll and scroll motion.",
      "Open Graph image, canonical URLs and tighter page titles for sharing and search.",
      "Fixed the Registry search on mobile.",
    ],
  },
  {
    date: "2026-10-17",
    title: "A rebuilt Registry",
    changes: [
      "New home, Registry, Pair, Compare and Snapshot Studio pages.",
      "Four new Pairs, and every Pair now leads with its Snapshot.",
      "Editors narrowed to VS Code and Cursor.",
      "Thumbnails dropped in favor of cropping the Snapshot.",
      "A Design system page and a Changelog page, linked from the footer.",
    ],
  },
  {
    date: "2026-10-13",
    title: "Pair pages",
    changes: [
      "Each Pair has its own page with a Snapshot and copyable Settings.",
      "The home hook rotates through three open Pairs.",
      "Geist and Geist Mono join the type stack.",
    ],
  },
  {
    date: "2026-10-12",
    title: "A new foundation",
    changes: [
      "The site moved to TanStack Start with shadcn, running on Cloudflare.",
    ],
  },
] as const;
