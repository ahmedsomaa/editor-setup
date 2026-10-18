# 07: Fonts list page

**What to build:** A `/fonts` page lists every unique Font that appears in Registry Presets. Each row shows the Font face, License, publisher links, and how many Presets use it. Clicking a Font opens the Registry filtered to that name.

**Blocked by:** 01: Registry lists Presets from the repo

**Status:** ready-for-human

- [x] Visiting `/fonts` shows unique Fonts derived from `listPairs()`
- [x] Each Font shows name, License, pair count, and links
- [x] Clicking a Font opens `/registry?q=<font-name>`
- [x] Header links to Fonts
