# editorSetup

A git-backed list of monospace Font and Theme Presets for code editors, each with the settings that apply it and a snapshot of how it looks.

## Language

### Presets and Configs

**Preset**:
One Font combined with one Theme, and at most one for any Font and Theme. It lives as one JSON file in the registry and appears on the site when that file is on `main`, has its Snapshot, and has at least one Config.
_Avoid_: Pair, pairing, combo, setup

**Font**:
A monospace typeface family as its foundry publishes it. Patched builds such as Nerd Fonts are the same Font; sibling families such as Monaspace Neon and Monaspace Argon are different Fonts. People find a Font through links to where it is published.
_Avoid_: Typeface, font build

**Theme**:
One color theme variant as it appears in an Editor's theme picker: Vitesse Dark and Vitesse Black are two Themes, even though one extension ships both, and a port of a variant to another Editor is the same Theme. People find a Theme through links to where it is published.
_Avoid_: Color scheme, colorscheme

**Appearance**:
Dark or light. Every Theme has one. The Presets filter uses this field; the Theme name is not a reliable signal.
_Avoid_: Mode, color mode

**Editor**:
One code editor app, such as VS Code or Zed. Apps whose Settings would be identical are still separate Editors, such as each VS Code fork and each JetBrains IDE. The supported Editors are VS Code and Zed for now.
_Avoid_: IDE, editor family

**Config**:
The Settings for one Preset in one Editor. A Preset has at most one Config per Editor. A later pull request updates or removes it.
_Avoid_: Setup, editor setup, submission

**Settings**:
The part of a Config that applies its Preset in its Editor: font family, size, weight, line height, ligatures, and the Theme, with no color overrides. Stored and shown as plain text with no allow-list. In JetBrains IDEs they are steps in the settings screen rather than text to paste.
_Avoid_: Code, snippet, personal setup

**Snapshot**:
An image of a Preset showing its Font and Theme together. It belongs to the Preset and has no Editor. One Preset has one Snapshot, at one standard 16:9 size.
_Avoid_: Screenshot, preview, image

### License and Presets

**License**:
The terms a Font or Theme is available under: Open (an open license such as OFL or MIT, free to use and embed) or Free (no cost but restricted, such as private use only). A Font or Theme whose license does not allow showing images of it on a public site is not accepted.
_Avoid_: Free/paid, price, Paid

**Presets**:
The public page and list of every Preset whose file is on `main` with its Snapshot and at least one Config. Built by scanning the pair JSON files in the repository.
_Avoid_: Registry, community page, directory, explore

**Preset Studio**:
The page on the site that makes a Snapshot from an Open or Free Font and Theme.
_Avoid_: Snapshot Studio, Editor, generator

**Compare**:
Two or more Presets shown side by side through their Snapshots.
_Avoid_: Slider, overlay

**Contribution**:
A pull request that changes the project itself: site code, the registry check, scripts or docs. Adding a Preset is not a Contribution.
_Avoid_: Submission, Author, Admin

**Adding a Preset**:
A pull request that adds a Preset file and its Snapshot, or adds an Editor to an existing Preset. There is no in-app form and no signed-in author on the site. Git history is the record.
_Avoid_: Submission, Contribution, Author, Admin
