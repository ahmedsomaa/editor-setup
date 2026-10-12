# editorSetup

A git-backed registry of monospace font and color theme pairings for code editors. Contributors add Pairs by pull request. The site reads those files.

## Layout

```text
registry/                 # Pair JSON + Snapshots (PR surface)
apps/web/                 # Next.js + shadcn + Zustand (Cloudflare via vinext)
apps/design/              # Design handbook (reference)
packages/registry-check/  # Schema + image checks (npm run check)
docs/                     # Agent conventions and ADRs
.scratch/                 # Specs, issues, archived experiments
```

## Commands

```bash
npm run check              # validate registry/
npm run dev                # Next.js in apps/web
npm run build              # Next.js production build
npm run dev:vinext         # vinext / Vite Cloudflare-local
npm run build:vinext       # Cloudflare Workers build
npm run start:vinext       # preview the Worker locally
npm run deploy:vinext      # deploy to Cloudflare Workers
```

Cloudflare deployment follows [Next.js on Workers with vinext](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [GLOSSARY.md](GLOSSARY.md).
