# editorSetup

A git-backed registry of monospace font and color theme pairings for code editors, each with the settings that apply it and a snapshot of how it looks.

## Language

### Pairs and Configs

**Pair**:
One Font combined with one Theme, and at most one for any Font and Theme. It lives as one JSON file in the registry and appears on the site when that file is on `main`, has its Snapshot, and has at least one Config.
_Avoid_: Pairing, combo, setup

**Font**:
A monospace typeface family as its foundry publishes it. Patched builds such as Nerd Fonts are the same Font; sibling families such as Monaspace Neon and Monaspace Argon are different Fonts. People find a Font through links to where it is published.
_Avoid_: Typeface, font build

**Theme**:
One color theme variant as it appears in an Editor's theme picker: Vitesse Dark and Vitesse Black are two Themes, even though one extension ships both, and a port of a variant to another Editor is the same Theme. People find a Theme through links to where it is published.
_Avoid_: Color scheme, colorscheme

**Appearance**:
Dark or light. Every Theme has one. The Registry filter uses this field; the Theme name is not a reliable signal.
_Avoid_: Mode, color mode

**Editor**:
One code editor app, such as VS Code, Cursor, Zed, or Neovim. Apps whose Settings would be identical are still separate Editors, such as each VS Code fork and each JetBrains IDE. Launch Editors are VS Code, Cursor, Zed, and Neovim.
_Avoid_: IDE, editor family

**Config**:
The Settings for one Pair in one Editor. A Pair has at most one Config per Editor. A later pull request updates or removes it.
_Avoid_: Setup, editor setup, submission

**Settings**:
The part of a Config that applies its Pair in its Editor: font family, size, weight, line height, ligatures, and the Theme, with no color overrides. Stored and shown as plain text with no allow-list. In JetBrains IDEs they are steps in the settings screen rather than text to paste, and in terminal editors such as Neovim they set only the Theme, because the terminal sets the Font.
_Avoid_: Code, snippet, personal setup

**Snapshot**:
An image of a Pair showing its Font and Theme together. It belongs to the Pair and has no Editor. One Pair has one Snapshot, at one standard 16:9 size.
_Avoid_: Screenshot, preview, image

### License and Registry

**License**:
The terms a Font or Theme is available under: Open (an open license such as OFL or MIT, free to use and embed), Free (no cost but restricted, such as private use only), or Paid.
_Avoid_: Free/paid, price

**Registry**:
The public list of every Pair whose file is on `main` with its Snapshot and at least one Config. Built by scanning the pair JSON files in the repository.
_Avoid_: Community page, directory, explore

**Thumbnail**:
The small version of a Snapshot, 400×225, shown in lists. It belongs to the same Pair and Editor as its Snapshot and shares its file name.
_Avoid_: Preview, icon

**Snapshot Studio**:
The page on the site that makes a Snapshot and its Thumbnail from an Open or Free Font and Theme. Paid Fonts and Themes are never rendered live there or anywhere on the site.
_Avoid_: Editor, generator

**Compare**:
Two Pairs shown side by side for one Editor, each through that Editor's Snapshot. A Pair with no Config for that Editor can't be compared there.
_Avoid_: Slider, overlay

**Contribution**:
A pull request that adds or changes a Pair file and its Snapshot. There is no in-app form and no signed-in author on the site. Git history is the record.
_Avoid_: Submission, Author, Admin
