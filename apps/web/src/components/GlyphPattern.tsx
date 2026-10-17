import { cn } from "cn";

/** A faint tile of small drawings: Fonts (Aa), Themes (swatches), Editors (a window) and code. Decoration only. */
export function GlyphPattern({
  id = "glyph-tile",
  className,
}: {
  id?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      className={cn(
        "text-foreground/[0.13] pointer-events-none absolute inset-0 -z-10 h-full w-full",
        className,
      )}
    >
      <defs>
        <pattern id={id} width="168" height="168" patternUnits="userSpaceOnUse">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          >
            <text
              x="14"
              y="40"
              fill="currentColor"
              stroke="none"
              fontFamily="ui-monospace, monospace"
              fontSize="22"
            >
              Aa
            </text>
            <circle cx="96" cy="30" r="6" fill="currentColor" stroke="none" />
            <circle cx="112" cy="30" r="6" />
            <circle
              cx="128"
              cy="30"
              r="6"
              fill="currentColor"
              stroke="none"
              opacity="0.5"
            />
            <rect x="20" y="96" width="46" height="32" rx="5" />
            <path d="M20 106h46M28 114h14M28 121h24" />
            <text
              x="98"
              y="122"
              fill="currentColor"
              stroke="none"
              fontFamily="ui-monospace, monospace"
              fontSize="22"
            >
              {"{ }"}
            </text>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
