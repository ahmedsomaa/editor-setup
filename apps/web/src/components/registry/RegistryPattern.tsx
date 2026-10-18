import { cn } from "cn";

/**
 * A faint tile about the Registry: a Preset file, a Font and Theme Preset, a Snapshot card
 * and a list of rows. Decoration only: it sits behind the page heading.
 */
export function RegistryPattern({
  id = "registry-tile",
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
        <pattern id={id} width="196" height="168" patternUnits="userSpaceOnUse">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* A Preset file: a page with a folded corner and lines of JSON */}
            <path d="M18 16h22l10 10v34a3 3 0 0 1-3 3H18a3 3 0 0 1-3-3V19a3 3 0 0 1 3-3Z" />
            <path d="M40 16v10h10" />
            <path d="M23 36h6M23 43h18M23 50h12" />

            {/* A Preset: a Font and a Theme, side by side */}
            <circle cx="104" cy="36" r="13" />
            <circle
              cx="120"
              cy="36"
              r="13"
              fill="currentColor"
              stroke="none"
              opacity="0.5"
            />
            <text
              x="94"
              y="41"
              fill="currentColor"
              stroke="none"
              fontFamily="ui-monospace, monospace"
              fontSize="14"
            >
              Aa
            </text>

            {/* A Snapshot card: a window above its name */}
            <rect x="18" y="98" width="58" height="42" rx="6" />
            <path d="M18 108h58" />
            <circle
              cx="25"
              cy="103"
              r="1.4"
              fill="currentColor"
              stroke="none"
            />
            <circle
              cx="31"
              cy="103"
              r="1.4"
              fill="currentColor"
              stroke="none"
            />
            <path d="M25 118h20M25 125h30M25 132h14" />

            {/* The Registry as rows: a thumbnail and a name on each */}
            <rect x="98" y="94" width="18" height="11" rx="2" />
            <path d="M122 99h40" />
            <rect x="98" y="112" width="18" height="11" rx="2" />
            <path d="M122 117h30" />
            <rect x="98" y="130" width="18" height="11" rx="2" />
            <path d="M122 135h36" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
