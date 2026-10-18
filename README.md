# 🎨 editorSetup

A git-backed list of monospace Font and Theme Presets for code editors. Anyone can add a Preset by pull request. The site reads those files.

🌐 **Live site:** https://editorsetup.som3aware.workers.dev

## 🗂️ Layout

```text
registry/                 # Preset JSON + Snapshots (PR surface)
apps/web/                 # TanStack Start + shadcn (Cloudflare Workers)
packages/registry-check/  # Schema + image checks
docs/                     # Agent conventions and ADRs
.scratch/                 # Specs, issues, archived experiments
```

## ⌨️ Commands

```bash
bun run check       # validate registry/
bun run dev         # TanStack Start in apps/web
bun run build       # production build
bun run preview     # build + local Workers preview
bun run deploy      # deploy to Cloudflare Workers
bun run typecheck   # TypeScript check for apps/web
bun run generate:submitters  # refresh apps/web/src/data/pair-submitters.json
```

📦 Site stack and deploy notes: [apps/web/README.md](apps/web/README.md). Cloudflare guide: [TanStack Start on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/).

## 🤖 Automation

- ✅ **Preset check** runs on every pull request and must pass before merge.
- 🚀 **Deploy** is handled by Cloudflare's Git integration, which ships `main` to Workers.
- 📡 **Feeds** are built by the site: `/rss.xml` from the changelog, plus `/llms.txt`, `/sitemap.xml` and `/robots.txt`.
- 📝 **Changelog** bot opens a pull request with a draft entry when a Preset lands on `main`.

## ➕ Adding a Preset

See [ADDING_A_PAIR.md](ADDING_A_PAIR.md).

## 🤝 Contributing

To work on the site or tooling, see [CONTRIBUTING.md](CONTRIBUTING.md) and [GLOSSARY.md](GLOSSARY.md).
