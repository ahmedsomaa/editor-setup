# 🤝 Contributing to editorSetup

A contribution is a pull request into `main`. An issue is optional and is not a queue. There is no in-app form.

## 📚 Before you start

- Read [GLOSSARY.md](GLOSSARY.md) for Pair, Font, Theme, Editor, Config, Settings, and Snapshot.
- A Pair is one Font and one Theme. Supported Editors are `vscode` and `zed` for now.
- One Pair per Font and Theme. One Snapshot per Pair. One Config per Editor, each with its Settings.

## ➕ Add a new Pair

1. Fork the repository and create a branch from `main`.
2. Add `registry/pairs/<font-slug>--<theme-slug>.json`.
3. Add one Snapshot under `registry/snapshots/` named `<pair-slug>.png`. Make it in [Snapshot Studio](https://editorsetup.som3aware.workers.dev/studio) with an Open or Free Font and Theme: it saves a 1600×900 PNG. In Claude Code, the `snapshot-studio` skill in `.claude/skills/` makes it from a Font and a Theme.
4. Several Editors may be included in this first pull request, each with its own Settings.
5. Run `bun run check`.
6. Open a pull request into `main`. Name the Font, the Theme, and the Editors in the description.

Example layout:

```text
registry/pairs/inconsolata--vitesse-dark.json
registry/snapshots/inconsolata--vitesse-dark.png
```

Example Pair file:

```json
{
  "font": {
    "name": "Inconsolata",
    "links": ["https://fonts.google.com/specimen/Inconsolata"],
    "license": "open"
  },
  "theme": {
    "name": "Vitesse Dark",
    "links": ["https://github.com/antfu/vscode-theme-vitesse"],
    "license": "open",
    "appearance": "dark"
  },
  "snapshot": "inconsolata--vitesse-dark.png",
  "editors": [
    {
      "id": "vscode",
      "settings": "editor.fontFamily: Inconsolata\nworkbench.colorTheme: Vitesse Dark"
    }
  ]
}
```

## 🧩 Add an Editor to an existing Pair

Open a separate pull request that:

1. Adds one entry to the `editors` array in that Pair’s JSON file.
2. Runs `bun run check`.

The Pair keeps its one Snapshot.

Do not mix an unrelated Pair into the same pull request.

## ✅ Rules the check enforces

- `appearance` is `dark` or `light`.
- License is `open`, `free`, or `paid` on the Font and on the Theme.
- Font and Theme each need at least one publish link.
- Settings are a non-empty plain-text string.
- The Snapshot file is `<pair-slug>.png`, aspect ratio 16:9.
- `snapshot` must match that filename.
- Paid Fonts and Themes are never rendered live on the site. A developer who owns the license may add a Snapshot made on their own machine; Snapshot Studio only offers Open and Free ones.
- One Config per Editor. One Pair per Font and Theme.
- Do not edit a central index. The site builds the list by scanning `registry/pairs/*.json`.

## 🔀 Pull request scope

- One Pair per pull request.
- Do not include sign-in, ratings, or site code changes with a Pair submission unless that is the purpose of the pull request.
- A person merges. The Action reports schema, image size, filename, and duplicate failures; it does not judge whether the Snapshot looks like the Theme.

## 🤖 What happens after you open a pull request

- The **Registry check** runs on every pull request. A workflow from a first-time fork needs the maintainer to approve it first.
- After a Pair is merged, a bot opens a pull request with a draft changelog entry. The maintainer edits and merges it.
