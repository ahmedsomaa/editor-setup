# 08: Themes list page

**What to build:** A `/themes` page lists every unique Theme that appears in Registry Pairs. Each row shows Appearance colors, License, publisher links, and how many Pairs use it. Clicking a Theme opens the Registry filtered to that name.

**Blocked by:** 01: Registry lists Pairs from the repo

**Status:** ready-for-human

- [x] Visiting `/themes` shows unique Themes derived from `listPairs()`
- [x] Each Theme shows name, Appearance, License, pair count, and links
- [x] Clicking a Theme opens `/registry?q=<theme-name>`
- [x] Header links to Themes
