# EditorSetup web

TanStack Start app with shadcn/ui (Nova + Lucide) and Cloudflare Workers deploy.

## Commands

```bash
bun install
bun run dev
bun run build
bun run deploy
bun run typecheck
bun test
```

From the repo root: `bun run dev`, `bun run build`, `bun run deploy`.

## Stack

- [TanStack Start](https://tanstack.com/start)
- [shadcn/ui](https://ui.shadcn.com/docs/installation/tanstack) (`base-nova`, Lucide)
- Theme: warm monochrome with one teal accent, pill controls, hairline borders (see `docs/design-system`)
- Type: Instrument Serif (display), Geist (body), Geist Mono (code)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/) via `@cloudflare/vite-plugin` and `wrangler.jsonc`

## Deploy

```bash
bun run deploy
```

Requires Wrangler auth (`bunx wrangler login`).

## Code layout

```
src/
  routes/          TanStack file routes: head, loader and a thin page
  components/
    layout/        Header, Footer, page heroes, scroll and reveal helpers
    common/        Shared bits: Combobox, Tag, EditorLogo, SnapshotImage, ShareButton
    presets/      Presets list: Directory, PresetGrid, PresetWindow, Pagination
    preset/          Preset page parts: EditorSwitch, PresetDetail, CopySettings
    compare/       Compare page, picker, toggle and tray
    studio/        Preset Studio: StudioPage, FontField, ThemeField, PreviewPanel
    home/          Home page sections and their art
    ui/            shadcn/ui primitives
  lib/
    presets/      Preset model, search params, snapshots, compare store
    theme/         Shiki highlighting, Zed and VS Code theme handling, Snapshot HTML
    studio/        Samples, search schema, font files, PNG export
  server/          Server functions and Preset loading
```

Machine-readable files are server routes beside the pages: `/rss.xml` (the changelog, from `lib/changelog.ts`), `/llms.txt` (a short hand-written map of the site for AI tools), `/sitemap.xml` (static pages plus every Preset) and `/robots.txt`. When you add a page, add it to `llms.txt` and the sitemap.

Rules of thumb:

- Keep a React file under about 350 lines. Past that, pull a section into a component beside it, and logic into `lib/`.
- A component folder is a feature. Put a component in `common/` only when two features use it.
- Import with the `@/` alias, for example `@/components/studio/StudioPage`.
