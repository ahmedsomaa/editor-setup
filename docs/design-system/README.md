## Principles

- Warm monochrome. Canvas `background`, text `foreground`, edges `border`. Colour is scarce: `accent` (deep teal) marks the active nav label and the selected list option, and a Preset's own colours appear only inside `PresetWindow` and Preset chips.
- One hairline everywhere. Separate sections with a 1px `border` rule, draw cards as `card` + 1px `border` at `radius-xl`, and never nest a card in a card.
- Shapes. Anything you press or type into is `radius-pill`: buttons, tabs, inputs, selects, tags, Anything that holds content is `radius-xl`.
- Flat. No gradients, no glass, no heavy shadows. The one exception is a faint pattern of small Font, Theme and Editor drawings (`.bg-glyphs`) that fades out behind a hero or a page heading.
- One ink button per view (`primary`); the rest are outline or ghost.

## Content fundamentals

- Sentence case. Domain nouns stay capitalised and mean one thing each: Preset, Font, Theme, Editor, Config, Settings, Snapshot, License.
- Buttons start with a verb and name the object: "Explore the Presets", "Add a Preset", "Copy Settings", "Save PNG". The same action keeps its name ("Copy", then "Copied").
- Talk to the reader as "you". Short, plain sentences. No "seamless", "elevate", "unleash", no exclamation marks, no em dashes.
- The hook is one sentence beside the live preview: "Your next ideal editor setup is one click away." Under it, one plain line says what the site is.
- On the home page the sections tell one story, each answering a question the visitor has just reached: "Take a look around.", "Can't pick?", "Found your favorite?", "Couldn't find what you're looking for?", "Share yours." Headings are short sentences, subheadings say why and never mention another section.
- Errors say what failed and how to fix it: "Could not highlight that code. Pick another language."
- Empty states name the query and offer an exit: "No Presets match 'quarterly'. Clear filters."
- Every Preset has a Snapshot (16:9, shown whole, 16:9, on the Preset page, cards and rows). Make it in Preset Studio.

## Visual foundations

- **Colour.** Light is default; dark swaps every token. `muted-foreground` for secondary text on `background` and `card` only. Selected state is never colour alone: preset `accent-soft` or a border with a check mark.
- **Type.** Instrument Serif 400 for headings (`display-hero`, `display-title`, `display-card`), tracking -0.02em to -0.03em, line height 1.1. Geist for everything else, line height 1.6. Geist Mono for code. Body copy stays under 60 characters a line.
- **Layout.** One centred column, 72rem wide (`max-w-6xl`), 16px gutters. Home feature sections have 96px (mobile) and 128px (desktop) of vertical padding and are divided by one rule. Each puts its words on one side and one picture in a panel on the other, and they alternate. The nav bar is a three-part grid: logo left, four links centred (Presets, Compare, Preset Studio, About), GitHub stars right. On phones the links drop to a scrolling second row. There is no call-to-action in the nav and no theme switch: Light, Dark and System live in the footer. The hero fills the viewport in two columns, the hook and two buttons on the left and a live preview that rotates through Presets on the right. Everything else is left-aligned. The footer is the brand and one sentence, three link columns, a rule, a byline with the theme switch, and a faded drawing of an editor.
- **Preset cards and rows.** The Presets page is a grid of cards: the Preset's Snapshot above its Theme, Font and tags. A Preset's page lists related Presets as Directory rows: the Snapshot cropped to the code window (80px wide), the Theme name, the Font name in its own face, and tags.
- **Focus.** Solid 2px `ring` with a 2px offset on every interactive element. Never remove it.
- **Motion.** Below-the-fold blocks fade in over 700ms (`cubic-bezier(0.16, 1, 0.3, 1)`), 80ms apart, rising on narrow screens and sliding in from their own side on wide ones. The hero headline settles in over 300ms. Hover: 150ms colour change; cards add `shadow-overlay`. Press: scale 0.98. The hero preview and the feature pictures loop only while on screen, and each has a pause button. With `prefers-reduced-motion` nothing is hidden or animated and the pause buttons are hidden.
- **Imagery.** Colour, code and a person-at-work line drawing for each home step (see Iconography). No photos.

## Iconography

Lucide, 16px in buttons, `foreground` or `muted-foreground`. No emoji. The logo is a caret between two braces, 24px, drawn in `foreground` with no background shape.

**Spot illustrations.** One style only: black line drawings of a person at work, from koboyo.com/icons (the plain set, never the `blockprint-` or `inkbrush-` ones). They head a feature or step on the Home page, at `size-24` to `size-28`, drawn in `currentColor` and hidden from assistive tech. Never use them inside buttons, tags or tables; those keep the small icons above. Source: `apps/web/src/components/home/SpotIcons.tsx`.

## Using the tokens

- Page: `background`. Hook: `display-hero` in `foreground`. Lead: `body-lg` in `muted-foreground`.
- Primary button: `primary` on `primary-foreground`, pill, `label`. Outline: `card` fill, 1px `border`, `foreground` text, hover `muted`. Ghost: transparent, hover `muted`.
- Tabs: pill track `muted` + 1px `border`; active thumb `card` + 1px `border`, with `aria-pressed`.
- Nav: inactive `muted-foreground`; active label `accent-text` on `muted`, plus `aria-current`.
- Tags: pill, 12px, uppercase, 0.05em tracking, 24px tall. Each carries an icon. Open License: `pastel-green` with an open padlock. Free License: `pastel-amber` with a gift. Appearance: `muted`, with a sun or moon.
- Cards and bento tiles: `card`, 1px `border`, `radius-xl`, 24px to 32px padding.
- Components: Button, Tabs, Tag, Logo, ThemeSwitch, PresetWindow, DirectoryRow. Consumers provide the Preset (theme name, background, text colour, Font family, Settings text).

## Accessibility

- Every control has a visible label or `aria-label`; icon-only buttons name the action ("Save PNG").
- Skip link first in the page; one `main`; the active nav link has `aria-current="page"`.
- Result counts and copy confirmations live in `role="status"` regions that exist before their text changes.
- Targets are at least 36px tall; inline links are underlined.

## Files

- `tokens.json` is the source. `tokens.css` is generated from it (custom properties; `data-theme="dark"` for dark).
- `components/<Name>/README.md` is the guideline; `components/<Name>/preview.html` is a live example.
