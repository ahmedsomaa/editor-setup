import type { ReactNode } from "react";
import { cn } from "cn";

type Variant = "compare" | "studio" | "about" | "pair";

const G = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Four small drawings per page, each about what the page does. Decoration only. */
const TILES: Record<Variant, ReactNode> = {
  // Two windows side by side, arrows between them, and rows compared line by line.
  compare: (
    <g {...G}>
      <rect x="14" y="16" width="54" height="40" rx="6" />
      <path d="M14 26h54" />
      <path d="M22 36h22M22 44h32" />
      <rect x="112" y="16" width="54" height="40" rx="6" />
      <path d="M112 26h54" />
      <path d="M120 36h28M120 44h18" />
      <path d="M76 32h28M96 26l8 6-8 6M84 44h-8m8 0-6-5m6 5-6 5" />
      <path d="M18 100h40M18 112h40M18 124h28" />
      <path d="M116 100h40M116 112h30M116 124h40" />
      <text
        x="78"
        y="116"
        fill="currentColor"
        stroke="none"
        fontFamily="ui-monospace, monospace"
        fontSize="16"
      >
        vs
      </text>
    </g>
  ),
  // Sliders, a font sample, an image frame and a save arrow: the Studio's controls.
  studio: (
    <g {...G}>
      <path d="M14 24h62M14 42h62M14 60h62" />
      <circle
        cx="34"
        cy="24"
        r="5"
        fill="currentColor"
        stroke="none"
        opacity="0.5"
      />
      <circle
        cx="58"
        cy="42"
        r="5"
        fill="currentColor"
        stroke="none"
        opacity="0.5"
      />
      <circle
        cx="26"
        cy="60"
        r="5"
        fill="currentColor"
        stroke="none"
        opacity="0.5"
      />
      <text
        x="108"
        y="46"
        fill="currentColor"
        stroke="none"
        fontFamily="ui-monospace, monospace"
        fontSize="26"
      >
        Aa
      </text>
      <rect x="14" y="98" width="58" height="42" rx="6" />
      <path d="M14 126l16-14 12 10 10-8 20 18" />
      <circle cx="56" cy="110" r="3.5" />
      <path d="M126 100v24m-10-9 10 10 10-10M112 134h28" />
    </g>
  ),
  // A commit graph with a branch, and a page of notes: the Git history is the record.
  about: (
    <g {...G}>
      <path d="M28 14v70" />
      <circle
        cx="28"
        cy="22"
        r="5"
        fill="currentColor"
        stroke="none"
        opacity="0.5"
      />
      <circle
        cx="28"
        cy="52"
        r="5"
        fill="currentColor"
        stroke="none"
        opacity="0.5"
      />
      <circle
        cx="28"
        cy="80"
        r="5"
        fill="currentColor"
        stroke="none"
        opacity="0.5"
      />
      <path d="M28 52c0-12 26-8 26-20" />
      <circle cx="54" cy="26" r="5" />
      <path d="M44 22h0M70 22h22M70 52h30M40 80h40" />
      <path d="M112 100h44a3 3 0 0 1 3 3v36a3 3 0 0 1-3 3h-44a3 3 0 0 1-3-3v-36a3 3 0 0 1 3-3Z" />
      <path d="M118 112h32M118 122h24M118 132h30" />
      <path d="M20 112h30M20 124h20" />
    </g>
  ),
  // A Font and a Theme as one Pair, a colour swatch row and a line of code.
  pair: (
    <g {...G}>
      <circle cx="30" cy="34" r="14" />
      <circle
        cx="48"
        cy="34"
        r="14"
        fill="currentColor"
        stroke="none"
        opacity="0.5"
      />
      <text
        x="20"
        y="40"
        fill="currentColor"
        stroke="none"
        fontFamily="ui-monospace, monospace"
        fontSize="15"
      >
        Aa
      </text>
      <circle
        cx="112"
        cy="26"
        r="6"
        fill="currentColor"
        stroke="none"
        opacity="0.5"
      />
      <circle cx="130" cy="26" r="6" />
      <circle
        cx="148"
        cy="26"
        r="6"
        fill="currentColor"
        stroke="none"
        opacity="0.25"
      />
      <path d="M104 46h52M104 56h34" />
      <path d="M26 108l-10 8 10 8M62 108l10 8-10 8M48 104l-8 24" />
      <path d="M104 112h22M132 112h26M104 124h36" />
    </g>
  ),
};

export function PagePattern({
  variant,
  className,
}: {
  variant: Variant;
  className?: string;
}) {
  const id = `page-tile-${variant}`;
  return (
    <svg
      aria-hidden
      className={cn(
        "text-foreground/[0.13] pointer-events-none absolute inset-0 -z-10 h-full w-full",
        className,
      )}
    >
      <defs>
        <pattern id={id} width="180" height="160" patternUnits="userSpaceOnUse">
          {TILES[variant]}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** A page's heading on a full-width band with its pattern behind, fading out downward. */
export function PageHero({
  variant,
  children,
  className,
}: {
  variant: Variant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="relative isolate z-10">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <PagePattern variant={variant} className="bg-glyphs" />
      </div>
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-4 pt-16 pb-14 sm:pt-24 sm:pb-16",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
