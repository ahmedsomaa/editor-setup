# Contributing to editorSetup

A contribution is a pull request into `main`. An issue is optional and is not a queue. There is no in-app form.

## Before you start

- Read [GLOSSARY.md](GLOSSARY.md) for Pair, Font, Theme, Editor, Config, Settings, and Snapshot.
- A Pair is one Font and one Theme. Launch Editors are `vscode`, `cursor`, `zed`, and `neovim`.
- One Pair per Font and Theme. One Config per Editor. Every Config needs both Settings and a Snapshot.

## Add a new Pair

1. Fork the repository and create a branch from `main`.
2. Add `registry/pairs/<font-slug>--<theme-slug>.json`.
3. Add at least one Snapshot under `registry/snapshots/` named `<pair-slug>--<editor-id>.png`.
4. Several Editors may be included in this first pull request.
5. Run `npm run check`.
6. Open a pull request into `main`. Name the Font, the Theme, and the Editors in the description.

Example layout:

```text
registry/pairs/inconsolata--vitesse-dark.json
registry/snapshots/inconsolata--vitesse-dark--vscode.png
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
  "editors": [
    {
      "id": "vscode",
      "snapshot": "inconsolata--vitesse-dark--vscode.png",
      "settings": "editor.fontFamily: Inconsolata\nworkbench.colorTheme: Vitesse Dark"
    }
  ]
}
```

## Add an Editor to an existing Pair

Open a separate pull request that:

1. Adds one Snapshot, `<pair-slug>--<editor-id>.png`.
2. Adds one entry to the `editors` array in that Pair’s JSON file.
3. Runs `npm run check`.

Do not mix an unrelated Pair into the same pull request.

## Rules the check enforces

- `appearance` is `dark` or `light`.
- License is `open`, `free`, or `paid` on the Font and on the Theme.
- Font and Theme each need at least one publish link.
- Settings are a non-empty plain-text string. Neovim Settings set only the Theme.
- The Snapshot file is `<pair-slug>--<editor-id>.png`, aspect ratio 16:9.
- `editors[].snapshot` must match that filename.
- One Config per Editor. One Pair per Font and Theme.
- Do not edit a central index. The site builds the list by scanning `registry/pairs/*.json`.

## Pull request scope

- One Pair per pull request.
- Do not include sign-in, ratings, or site code changes with a Pair submission unless that is the purpose of the pull request.
- A person merges. The Action reports schema, image size, filename, and duplicate failures; it does not judge whether the Snapshot looks like the Theme.
