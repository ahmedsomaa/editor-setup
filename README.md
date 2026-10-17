# editorSetup

A git-backed registry of monospace font and color theme pairings for code editors. Contributors add Pairs by pull request. The site reads those files.

## Layout

```text
registry/                 # Pair JSON + Snapshots (PR surface)
apps/web/                 # TanStack Start + shadcn (Cloudflare Workers)
apps/design/              # Design handbook (reference)
packages/registry-check/  # Schema + image checks
docs/                     # Agent conventions and ADRs
.scratch/                 # Specs, issues, archived experiments
```

## Commands

```bash
bun run check       # validate registry/
bun run dev         # TanStack Start in apps/web
bun run build       # production build
bun run preview     # build + local Workers preview
bun run deploy      # deploy to Cloudflare Workers
bun run typecheck   # TypeScript check for apps/web
```

Site stack and deploy notes: [apps/web/README.md](apps/web/README.md). Cloudflare guide: [TanStack Start on Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [GLOSSARY.md](GLOSSARY.md).
