# 🎨 editorSetup

A git-backed list of monospace Font and Theme Presets for code editors. Anyone can add a Preset by pull request. The site reads those files.

🌐 **Live site:** https://editorsetup.som3aware.workers.dev

## 🗂️ Layout

```text
presets/                  # Preset JSON + Snapshots (PR surface)
apps/web/                 # TanStack Start + shadcn (Cloudflare Workers)
packages/preset-check/    # Schema + image checks
docs/                     # Agent conventions and ADRs
.scratch/                 # Specs, issues, archived experiments
```

## ⌨️ Commands

```bash
bun run check       # validate presets/
bun run dev         # TanStack Start in apps/web
bun run build       # production build
bun run preview     # build + local Workers preview
bun run deploy      # deploy to Cloudflare Workers
bun run typecheck   # TypeScript check for apps/web
bun run generate:submitters  # refresh apps/web/src/data/preset-submitters.json (see below)
```

📦 Site stack and deploy notes: [apps/web/README.md](apps/web/README.md). Cloudflare guide: [TanStack Start on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/).

## 🤖 Automation

- ✅ **Preset check** runs on every pull request: schema, Snapshot size and filename, and duplicates.
- 🚀 **Deploy** is handled by Cloudflare's Git integration, which ships `main` to Workers.
- 📡 **Feeds** are built by the site: `/rss.xml` from the changelog, plus `/llms.txt`, `/sitemap.xml` and `/robots.txt`.
- 📝 **Changelog** is written by hand, newest first, in `apps/web/src/lib/changelog.ts`. It feeds the Changelog page and `/rss.xml`.

## 👤 Submitter credit

Each Preset page shows who submitted it, read from `apps/web/src/data/preset-submitters.json`. The script finds the merged pull request that first added the Preset file and uses its author.

After a Preset pull request merges, a maintainer pulls `main`, runs `bun run generate:submitters` and commits the updated JSON. Until then the new Preset has no submitter. The script needs `gh auth login` and full git history, so it does not work in a shallow clone.

## ➕ Adding a Preset

See [ADDING_A_PRESET.md](ADDING_A_PRESET.md).

## 🤝 Contributing

To work on the site or tooling, see [CONTRIBUTING.md](CONTRIBUTING.md) and [GLOSSARY.md](GLOSSARY.md).
