# editorSetup web

Next.js 16 App Router app with [shadcn/ui](https://ui.shadcn.com/), Zustand, and [vinext](https://vinext.dev/) for [Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/).

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js local (port 3000) |
| `npm run build` / `start` | Next.js production |
| `npm run dev:vinext` | vinext / Vite Workers-local (port 3001) |
| `npm run build:vinext` | Build Cloudflare Worker output |
| `npm run start:vinext` | Preview the Worker locally |
| `npm run deploy:vinext` | Deploy with `@vinext/cloudflare` |

From the repo root you can use the same script names (`npm run deploy:vinext`, etc.).

## Deploy

1. `npm run build:vinext`
2. `npm run deploy:vinext` (requires Cloudflare auth via `cf` / Wrangler)

Config: `vite.config.ts`, `cloudflare.config.ts`.
