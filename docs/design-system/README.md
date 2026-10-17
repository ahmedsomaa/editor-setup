## Principles

- Warm monochrome. Canvas `background`, text `foreground`, edges `border`. Colour is scarce: `accent` (deep teal) marks the active nav label and the selected list option, `pastel-green` marks a Paid License, and a Pair's own colours appear only inside `PairWindow` and Pair chips.
- One hairline everywhere. Separate sections with a 1px `border` rule, draw cards as `card` + 1px `border` at `radius-xl`, and never nest a card in a card.
- Shapes. Anything you press or type into is `radius-pill`: buttons, tabs, inputs, selects, tags, Anything that holds content is `radius-xl`.
- Flat. No gradients, no glass, no heavy shadows. The one exception is a dot pattern (`.bg-pattern`, `foreground` at 16%, 22px pitch) that fades out behind a hero or closing block.
- One ink button per view (`primary`); the rest are outline or ghost.

## Content fundamentals

- Sentence case. Domain nouns stay capitalised and mean one thing each: Pair, Font, Theme, Editor, Config, Settings, Snapshot, Registry, License.
- Buttons start with a verb and name the object: "Explore the Registry", "Add a Pair", "Copy Settings", "Save PNG". The same action keeps its name ("Copy", then "Copied").
- Talk to the reader as "you". Short, plain sentences. No "seamless", "elevate", "unleash", no exclamation marks, no em dashes.
- The hook is one line, centred: "Make the place you code feel like yours." It wraps on narrow screens only.
- Errors say what failed and how to fix it: "Could not highlight that code. Pick another language."
- Empty states name the query and offer an exit: "No Pairs match 'quarterly'. Clear filters."
- Every Pair has a Snapshot (16:9, shown large on the Pair page and cropped to the code window on cards and rows). Make it in Snapshot Studio.
- Paid Fonts and Themes are never rendered live. A developer who owns the license can add a Snapshot of one.

## Visual foundations

- **Colour.** Light is default; dark swaps every token. `muted-foreground` for secondary text on `background` and `card` only. Selected state is never colour alone: pair `accent-soft` or a border with a check mark.
- **Type.** Instrument Serif 400 for headings (`display-hero`, `display-title`, `display-card`), tracking -0.02em to -0.03em, line height 1.1. Geist for everything else, line height 1.6. Geist Mono for code. Body copy stays under 60 characters a line.
- **Layout.** One centred column, 64rem wide (`max-w-5xl`), 16px gutters, sections 64px (mobile) and 96px (desktop) apart and divided by one rule. The nav bar is a three-part grid: logo left, links centred, GitHub stars right. There is no call-to-action in the nav and no theme switch: Light, Dark and System live in the footer. The hero fills the viewport and is centred, with the hook on one line; everything else is left-aligned. The footer follows opensourceui.in: brand and one sentence, three link columns, a rule, copyright with the theme switch, and a faded serif wordmark. Snapshot Studio is the one full-width screen.
- **Directory rows.** The Registry is a list, not a card grid: one row per Pair with the Pair's Snapshot cropped to the code window (80px wide), the Theme name, the Font name in its own face, and tags. Pointing at or focusing a row repaints a window beside it.
- **Focus.** Solid 2px `ring` with a 2px offset on every interactive element. Never remove it.
- **Motion.** Below-the-fold blocks fade up 12px over 600ms (`cubic-bezier(0.16, 1, 0.3, 1)`), 80ms apart. Hover: 150ms colour change; cards add `shadow-overlay`. Press: scale 0.98. Nothing moves on its own. With `prefers-reduced-motion` nothing is hidden or animated.
- **Imagery.** None. Colour and code carry the page.

## Iconography

Phosphor, bold weight, 16px in buttons, `foreground` or `muted-foreground`. No emoji. The logo is a caret between two braces, 24px, drawn in `foreground` with no background shape.

## Using the tokens

- Page: `background`. Hook: `display-hero` in `foreground`. Lead: `body-lg` in `muted-foreground`.
- Primary button: `primary` on `primary-foreground`, pill, `label`. Outline: `card` fill, 1px `border`, `foreground` text, hover `muted`. Ghost: transparent, hover `muted`.
- Tabs: pill track `muted` + 1px `border`; active thumb `card` + 1px `border`, with `aria-pressed`.
- Nav: inactive `muted-foreground`; active label `accent-text` on `muted`, plus `aria-current`.
- Tags: pill, 12px, uppercase, 0.05em tracking, 24px tall. Each carries an icon. Paid License: `pastel-green`, like money, with a dollar sign. Open License: `accent-soft` with an open padlock. Free License and Appearance: `muted`, with a gift and a sun or moon.
- Cards and bento tiles: `card`, 1px `border`, `radius-xl`, 24px to 32px padding.
- Components: Button, Tabs, Tag, Logo, ThemeSwitch, PairWindow, DirectoryRow. Consumers provide the Pair (theme name, background, text colour, Font family, Settings text).

## Accessibility

- Every control has a visible label or `aria-label`; icon-only buttons name the action ("Save PNG").
- Skip link first in the page; one `main`; the active nav link has `aria-current="page"`.
- Result counts and copy confirmations live in `role="status"` regions that exist before their text changes.
- Targets are at least 36px tall; inline links are underlined.

## Files

- `tokens.json` is the source. `tokens.css` is generated from it (custom properties; `data-theme="dark"` for dark).
- `components/<Name>/README.md` is the guideline; `components/<Name>/preview.html` is a live example.
