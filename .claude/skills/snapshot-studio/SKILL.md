---
name: snapshot-studio
description: Generate a Carbon-style (carbon.now.sh) code image for a given font and theme, as a self-contained 16:9 HTML page, and a 1600x900 PNG. Takes a font name and a theme name (or links to them) and writes its own code snippet in any language if none is given. Use this whenever the user wants a snapshot, screenshot, preview, "carbon" image, or showcase picture of a code font plus color theme, a Pair Snapshot for the registry, or says things like "render Fira Code with Nord", "make a Gruvbox preview image", or "generate the snapshot for this pair", even if they never mention Carbon.
---

# Snapshot Studio

Produce what carbon.now.sh produces (a code window on a colored backdrop) for one **font + theme** pair, headless, with no website involved. Colors come from the real VS Code theme and the typeface is embedded in the HTML, so the image shows the actual pair rather than an approximation.

## Outputs (per run)

| File | What |
|---|---|
| `<name>.html` | Self-contained 16:9 page (font embedded as base64). Scales to any window. |
| `<name>.png` | 1600x900 screenshot of that page. |

Default output directory: the current directory. When the user wants a registry Snapshot for this repo, write the PNG to `registry/snapshots/<font-slug>--<theme-slug>.png` (CONTRIBUTING.md: `<pair-slug>.png`, 16:9) and keep the HTML beside it or in a scratch folder. Do not edit pair JSON unless asked.

## Workflow

1. **Collect inputs.** Font and theme names, or links to them. Language for the snippet (default: ask only if unclear; otherwise TypeScript). If the user gave code, use it verbatim.
2. **Write the snippet** if none was given (see "Writing a good snippet").
3. **Resolve the theme** (see "Themes").
4. **Run the renderer** (see "Running"). Files are written to the out dir.
5. **Look at the PNG** with the Read tool before reporting. Check that the colors look like the named theme, the font looks like a code font that matches, and nothing is clipped. Fix and re-run once if not.
6. **Report** the three file paths, the theme's resolved name and whether it is dark or light, and anything you substituted.

## Running

First use only: `bun install --cwd .claude/skills/snapshot-studio/scripts` (installs shiki and puppeteer-core; needs Chrome or Chromium, set `CHROME_PATH` if it is not in a standard location).

```bash
bun .claude/skills/snapshot-studio/scripts/render.mjs \
  --code-file snippet.ts --lang typescript \
  --font "JetBrains Mono" --theme "Gruvbox Dark Hard" \
  --out ./out --name jetbrains-mono--gruvbox-dark-hard
```

Flags:
- `--code-file <path|->`, `--lang <shiki language id>`: required. Language ids are Shiki's (`typescript`, `python`, `rust`, `go`, `lua`, `json`, `bash`, `tsx`, ...). An unknown id falls back to plain text with a warning.
- `--font "<Name>"`: looked up on Fontsource, then Google Fonts. Or `--font-file <path|url>`, repeatable for regular, bold and italic (weight and style are inferred from the filename). Use this for fonts that are not on either service.
- `--theme "<Name>"`: matched against Shiki's bundled themes (`gruvbox-dark-hard`, `nord`, `vitesse-dark`, `material-theme-palenight`, ...). Or `--theme-file <path|url>` for any VS Code theme JSON (add `--theme "<Name>"` to label it).
- Optional: `--title "<window label>"` (default `Font · Theme`), `--font-size <max px>` (default 30; it shrinks automatically to fit), `--backdrop "#hex"` (default is derived from the theme), `--name`, `--out`.

The renderer prints a JSON summary. A `fontSizePx` under 14 means the snippet was too big for 16:9; shorten it rather than shipping tiny text.

## Themes

Why this matters: the point of the image is that the colors are the theme's. Never approximate a theme by eye.

- Try the name first. The script fuzzy-matches Shiki's bundled themes and, if nothing matches, exits with the closest candidates. Pick one only if it is really the same theme (e.g. "Palenight Theme" is `material-theme-palenight`). If the candidates are different themes, do not substitute silently.
- For a link, get to the raw theme JSON and pass it with `--theme-file`. GitHub `blob` URLs are converted to raw automatically. Typical locations: `themes/*.json` in the theme's repository. A VS Code Marketplace or Open VSX page is not the JSON: open the extension's repository link from that page and find the theme file. Themes that `include` another file are merged automatically.
- Light vs dark comes from the theme background; mention it in the report so the user can sanity-check.

## Fonts

- Fontsource and Google Fonts cover most open-source code fonts (JetBrains Mono, Fira Code, Geist Mono, Inconsolata, IBM Plex Mono, Source Code Pro, ...).
- Proprietary or foundry-only fonts (Input Mono, Berkeley Mono, Operator Mono, ...) fail with a clear error. Ask for a link or file, download the `.woff2/.ttf/.otf` files (extract zips first), and pass them with `--font-file`. Never substitute a different font without telling the user.
- Ligatures are on, because the pair is usually judged on `=>`, `!==`, `->`.

## Writing a good snippet

A pair is judged on how code reads in it, so the snippet should exercise the typeface and the theme, in the language the user asked for (any language; pick an idiomatic one if unspecified):

- 10 to 18 lines, lines of 70 columns or fewer, so the text stays large in 16:9.
- Real-looking code, not lorem. A function with a type or two, a loop or a filter, an `if`, a string, a template or f-string, a number, a comment.
- Include glyphs that stress a code font: `=> -> !== === <= >= && || :: {}[]()`, `0O 1lI`, a few capitals and digits.
- Include every token class a theme colors: keywords, types, functions, strings, numbers, comments, operators, constants.
- No secrets, no real company code. Keep it self-contained and the same flavor for every pair so snapshots are comparable (when the user is making several, reuse one snippet per language).

## Notes

- The HTML is the source of truth; the PNGs are screenshots of it at 1600x900.
- Nothing leaves the machine except the font and theme downloads.
