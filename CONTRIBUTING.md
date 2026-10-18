# 🤝 Contributing to editorSetup

A Contribution is a pull request that changes the project itself: the site, the registry check, the scripts, the docs. A pull request into `main` is the only route. An issue is optional and is not a queue.

Want to add a Font and Theme Preset? That is not a Contribution. Follow [ADDING_A_PAIR.md](ADDING_A_PAIR.md) instead.

## 📚 Before you start

- Read [GLOSSARY.md](GLOSSARY.md) for the words the project uses: Preset, Font, Theme, Editor, Config, Settings, Snapshot, Presets.
- The site lives in `apps/web/` (TanStack Start on Cloudflare Workers). The registry check lives in `packages/registry-check/`. Presets and Snapshots live in `registry/`.
- Design rules are in `docs/design-system/`. Follow them for any UI change.

## 🛠️ Set up

1. Fork the repository and create a branch from `main`.
2. Install with `bun install --cwd apps/web`.
3. Start the site with `bun run dev` (port 3000).

## ✅ Before you open a pull request

```bash
bun run typecheck   # TypeScript check for apps/web
bun test            # run inside apps/web
bun run check       # validate registry/
bun run build       # production build
```

## 🔀 Pull request scope

- One concern per pull request. Keep unrelated changes out.
- Do not mix a Preset into a Contribution. Send Presets separately, following [ADDING_A_PAIR.md](ADDING_A_PAIR.md).
- Name what changed and why in the description. Add a screenshot for UI changes.
- A person merges. The **Preset check** runs on every pull request; a workflow from a first-time fork needs the maintainer to approve it first.
