# EditorSetup web

TanStack Start app with shadcn/ui (Nova + Lucide) and Cloudflare Workers deploy.

## Commands

```bash
bun install
bun run dev
bun run build
bun run deploy
bun run typecheck
```

From the repo root: `bun run dev`, `bun run build`, `bun run deploy`.

## Stack

- [TanStack Start](https://tanstack.com/start)
- [shadcn/ui](https://ui.shadcn.com/docs/installation/tanstack) (`base-nova`, Lucide)
- Theme: warm monochrome with one teal accent, pill controls, hairline borders (see `docs/design-system`)
- Type: Sora (display), Geist (body), Geist Mono (code)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/) via `@cloudflare/vite-plugin` and `wrangler.jsonc`

## Deploy

```bash
bun run deploy
```

Requires Wrangler auth (`bunx wrangler login`).
