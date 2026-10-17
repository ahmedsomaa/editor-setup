A window painted in one Pair's own colours and Font. The only saturated surface on a page.

The consumer provides the Pair (`bg`, `fg`, Font family), a file name and the Settings lines (keys, strings, punctuation). Derive every tint with `color-mix` from `fg` over `bg`: keys 78%, punctuation 45%, border 16%, line numbers 32%. The top bar holds three small circles at 26% and the file name; the shadow is `0 2px 8px` at 5%. Colours cross-fade over 300ms when the Pair changes.

- Do: use the Pair's Font.
- Don't: recolour the window to match the page theme, or add a glow.
