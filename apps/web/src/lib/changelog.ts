/** Release notes, newest first. */
export const ENTRIES = [
  {
    date: "2026-10-30",
    title: "Language icons",
    changes: [
      "The Studio's Code language list shows each language's own mark in its brand color.",
      "The Editor and Appearance filters on the Presets page now have icons.",
      "More space between the items in the Compare drawer on desktop.",
      "Preset Studio now loads in the browser instead of on the server.",
    ],
  },
  {
    date: "2026-10-19",
    title: "Mobile polish",
    changes: [
      "On mobile, the landing heading and sub title are now centered.",
      "More space between the items in the Compare drawer on mobile.",
    ],
  },
  {
    date: "2026-10-18",
    title: "Presets and a new landing story",
    changes: [
      "Pairs are now called Presets, and Snapshot Studio is now Preset Studio.",
      "The Registry is now the Presets page at /presets. Old /registry links redirect.",
      "A landing page that walks you through it: take a look around, compare, copy, make your own and share.",
      "Line illustrations for each step, and a Credits section on the About page.",
      "The License section is now a question in the FAQ.",
      "Every Preset file now names its author, with optional contributors for Editor ports, and each Editor's Settings say who wrote them.",
      "Preset Studio exports the Preset file and the Snapshot from one button group.",
      "The Studio's Code tab now has syntax colors, and each language loads its own sample.",
      "The Studio's Other option is now called Custom.",
    ],
  },
  {
    date: "2026-10-18",
    title: "RSS feed and llms.txt",
    changes: [
      "An RSS feed of this changelog, with an RSS button at the top of the Changelog page.",
      "An llms.txt that gives AI tools a short map of the site, linked in the footer.",
    ],
  },
  {
    date: "2026-10-18",
    title: "Simpler Preset filters",
    changes: [
      "Preset filters are now search, Editor and Appearance, with License dropped.",
      "A robots.txt and a sitemap that lists every Preset.",
      "A Product Hunt badge in the footer.",
      "Moved the Free badge out of the heading and spaced the heading.",
      "Slower smooth scroll, plus page titles and share icons.",
    ],
  },
  {
    date: "2026-10-17",
    title: "Preset updates",
    changes: [
      "Updated Preset: Fira Code with Palenight Theme.",
      "Updated Preset: Geist Mono with Aura Dark.",
      "Updated Preset: Geist Mono with Vesper.",
      "Updated Preset: Inconsolata with Vitesse Dark.",
      "Updated Preset: Inconsolata with Vitesse Light.",
      "Updated Preset: JetBrains Mono with Gruvbox Dark Hard.",
      "Updated Preset: Zed Mono with Gruvbox Light Hard.",
    ],
  },
  {
    date: "2026-10-17",
    title: "Landing sections and motion",
    changes: [
      "Rebuilt landing sections with animated art for Compare and Snapshot.",
      "A Compare drawer picker, and pagination in Presets.",
      "A reworked Preset Studio with swatches in its menus, plus new Snapshots.",
      "Paid licenses dropped, and icons moved to Lucide.",
      "A page transition, site-wide smooth scroll and scroll motion.",
      "Open Graph image, canonical URLs and tighter page titles for sharing and search.",
      "Fixed the Preset search on mobile.",
    ],
  },
  {
    date: "2026-10-17",
    title: "Rebuilt Presets",
    changes: [
      "New home, Presets, Preset, Compare and Preset Studio pages.",
      "Four new Presets, and every Preset now leads with its Snapshot.",
      "Editors narrowed to VS Code and Cursor.",
      "Thumbnails dropped in favor of cropping the Snapshot.",
      "A Design system page and a Changelog page, linked from the footer.",
    ],
  },
  {
    date: "2026-10-13",
    title: "Preset pages",
    changes: [
      "Each Preset has its own page with a Snapshot and copyable Settings.",
      "The home hook rotates through three open Presets.",
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
