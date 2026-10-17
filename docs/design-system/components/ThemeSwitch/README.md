Three icon buttons in a pill track: Light, Dark, System. It sits in the footer, never in the nav bar.

Each button is a real `button` with `aria-pressed` and an `aria-label` ("Light", "Dark", "System"); the group is labelled "Color theme". The pressed button gets a `card` thumb with a 1px `border`. The choice is stored, and System follows `prefers-color-scheme` live.
