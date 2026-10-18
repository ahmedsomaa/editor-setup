# ➕ Adding a Preset to editorSetup

Adding a Preset is a pull request into `main` with a Preset file and its Snapshot. It is not a Contribution: to work on the site, tooling or docs, read [CONTRIBUTING.md](CONTRIBUTING.md). There is no in-app form.

## 📚 Before you start

- Read [GLOSSARY.md](GLOSSARY.md) for Preset, Font, Theme, Editor, Config, Settings, and Snapshot.
- A Preset is one Font and one Theme. Supported Editors are `vscode` and `zed` for now.
- One Preset per Font and Theme. One Snapshot per Preset. One Config per Editor, each with its Settings.

## ➕ Add a new Preset

1. Fork the repository and create a branch from `main`.
2. Add `presets/<font-slug>--<theme-slug>.json`.
3. Add one Snapshot under `presets/snapshots/` named `<preset-slug>.png`. Make it in [Preset Studio](https://editorsetup.som3aware.workers.dev/studio) with an Open or Free Font and Theme: it saves a 1600×900 PNG. In Claude Code, the `snapshot-studio` skill in `.claude/skills/` makes it from a Font and a Theme.
4. Several Editors may be included in this first pull request, each with its own Settings.
5. Run `bun run check`.
6. Open a pull request into `main`. Name the Font, the Theme, and the Editors in the description.

Example layout:

```text
presets/inconsolata--vitesse-dark.json
presets/snapshots/inconsolata--vitesse-dark.png
```

Example Preset file:

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
  "author": {
    "name": "Your name",
    "url": "https://github.com/your-username"
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

An Editor port adds `"contributors": [{ "name": "Sara", "url": "https://github.com/sara", "editors": ["zed"] }]` to the same file. The Preset page then says "Zed Settings by Sara" under the Settings, and "by Ahmed and 1 contributor" in the header.

## 🧩 Add an Editor to an existing Preset

Open a separate pull request that:

1. Adds one entry to the `editors` array in that Preset’s JSON file.
2. Runs `bun run check`.

The Preset keeps its one Snapshot. Add yourself to `contributors` in the same file, listing the Editor you added, so the Preset page credits you for it. The original `author` stays.

Do not mix an unrelated Preset into the same pull request.

## ✅ Rules the check enforces

- The file is named `<font-slug>--<theme-slug>.json`, from the Font and Theme names.
- `contributors` is optional: a list of up to 10 people in the same shape as `author`, plus `editors`, the Editor IDs they wrote Settings for. Every Editor must exist in the Preset, and each Editor has at most one contributor. Do not repeat the author. Editors no contributor claims are credited to the author.
- `author` has a `name` (required) and an optional `url` that starts with `https://`, such as your GitHub profile. It is the credit shown on the Preset page. Write the name you want shown; the check does not verify it.
- `appearance` is `dark` or `light`.
- License is `open` or `free` on the Font and on the Theme.
- Font and Theme each need at least one publish link.
- Settings are a non-empty plain-text string.
- The Snapshot file is `<preset-slug>.png` (the same name as the Preset file), a valid PNG at 16:9.
- `snapshot` must match that filename.
- Only add a Preset when its Font and Theme licenses allow a public image of them. If a license asks for payment, or does not say, leave it out.
- One Config per Editor. One Preset per Font and Theme.
- Do not edit a central index. The site builds the list by scanning `presets/*.json`.

## 🔀 Pull request scope

- One Preset per pull request.
- Do not include site code changes in a Preset pull request. Send those as a Contribution.
- A person merges. The Action reports schema, image size, filename, and duplicate failures; it does not judge whether the Snapshot looks like the Theme.

## 🤖 What happens after you open a pull request


- The **Preset check** runs on every pull request. A workflow from a first-time fork needs the maintainer to approve it first.
