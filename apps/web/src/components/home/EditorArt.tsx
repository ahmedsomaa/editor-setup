import type { CSSProperties } from "react";
import { cn } from "cn";

export type Colors = { bg: string; fg: string };

const mix = (a: string, pct: number, b: string) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

/** Without colours it uses the site's tokens; with a Preset's colours it is painted in that Theme. */
export function artVars(c?: Colors): CSSProperties {
  if (!c) {
    return {
      "--a-win": "var(--card)",
      "--a-edge": "var(--border)",
      "--a-bar": mix("var(--foreground)", 20, "transparent"),
      "--a-soft": mix("var(--foreground)", 12, "transparent"),
      "--a-faint": mix("var(--foreground)", 8, "transparent"),
      "--a-key": mix("var(--accent-text)", 30, "transparent"),
      "--a-str": mix("var(--pastel-green-text)", 30, "transparent"),
      "--a-hl": "var(--accent-soft)",
      "--a-caret": "var(--accent)",
      "--a-tab": "var(--muted)",
    } as CSSProperties;
  }
  return {
    "--a-win": mix(c.fg, 7, c.bg),
    "--a-edge": mix(c.fg, 24, c.bg),
    "--a-bar": mix(c.fg, 34, c.bg),
    "--a-soft": mix(c.fg, 24, c.bg),
    "--a-faint": mix(c.fg, 14, c.bg),
    "--a-key": mix(c.fg, 72, c.bg),
    "--a-str": mix(c.fg, 46, c.bg),
    "--a-hl": mix(c.fg, 13, c.bg),
    "--a-caret": c.fg,
    "--a-tab": mix(c.fg, 12, c.bg),
  } as CSSProperties;
}

/** One [x, y, width, height, radius, colour] per word-shaped bar in the code area. */
const CODE: ReadonlyArray<readonly [number, number, number, number, number, string]> = [
  [64, 107, 14, 8, 4, "soft"],
  [96, 104, 46, 14, 7, "key"],
  [152, 104, 70, 14, 7, "soft"],
  [232, 104, 18, 14, 7, "faint"],
  [64, 133, 14, 8, 4, "soft"],
  [124, 130, 34, 14, 7, "key"],
  [168, 130, 92, 14, 7, "soft"],
  [270, 130, 34, 14, 7, "str"],
  [64, 159, 14, 8, 4, "soft"],
  [124, 156, 34, 14, 7, "key"],
  [168, 156, 58, 14, 7, "soft"],
  [236, 156, 78, 14, 7, "str"],
  [64, 185, 14, 8, 4, "soft"],
  [152, 182, 64, 14, 7, "soft"],
  [226, 182, 22, 14, 7, "faint"],
  [258, 182, 100, 14, 7, "str"],
  [64, 211, 14, 8, 4, "soft"],
  [152, 208, 40, 14, 7, "key"],
  [202, 208, 84, 14, 7, "soft"],
  [64, 237, 14, 8, 4, "soft"],
  [124, 234, 18, 14, 7, "faint"],
  [64, 263, 14, 8, 4, "soft"],
  [96, 260, 46, 14, 7, "key"],
  [152, 260, 54, 14, 7, "soft"],
  [216, 260, 26, 14, 7, "faint"],
  [252, 260, 70, 14, 7, "soft"],
  [332, 260, 18, 14, 7, "faint"],
  [64, 289, 14, 8, 4, "soft"],
  [124, 286, 88, 14, 7, "soft"],
  [222, 286, 30, 14, 7, "str"],
  [64, 315, 14, 8, 4, "soft"],
  [124, 312, 34, 14, 7, "key"],
  [168, 312, 72, 14, 7, "soft"],
  [250, 312, 44, 14, 7, "faint"]
];

/** Decorative editor window. Cropped by its parent; pass a Preset's colours to paint it in that Theme. */
export function EditorArt({
  className,
  colors,
  complete = false,
  live = false,
  liveKey,
}: {
  className?: string;
  colors?: Colors;
  complete?: boolean;
  /** Types the code in, blinks the caret and fades between colours. Needs no-preference motion. */
  live?: boolean;
  /** Change it to type the code in again. */
  liveKey?: string | number;
}) {
  const h = complete ? 378 : 420;
  return (
    <svg
      className={cn(className, live && "art-live")}
      viewBox="0 0 640 380"
      fill="none"
      aria-hidden="true"
      style={artVars(colors)}
    >
      <rect x="1" y="1" width="638" height={h - 2} rx="14" strokeWidth="2" style={{ fill: "var(--a-win)", stroke: "var(--a-edge)" }} />
      <g strokeWidth="2" style={{ stroke: "var(--a-edge)" }}>
        <path d="M1 44h638" />
        <path d={`M168 44v${h - 44}`} />
      </g>
      <circle cx="26" cy="23" r="5" style={{ fill: "var(--a-bar)" }} />
      <circle cx="44" cy="23" r="5" style={{ fill: "var(--a-bar)" }} />
      <circle cx="62" cy="23" r="5" style={{ fill: "var(--a-bar)" }} />
      <rect x="196" y="12" width="104" height="24" rx="12" strokeWidth="2" style={{ fill: "var(--a-tab)", stroke: "var(--a-edge)" }} />
      <rect x="212" y="20" width="60" height="8" rx="4" style={{ fill: "var(--a-bar)" }} />
      <rect x="312" y="16" width="70" height="16" rx="8" style={{ fill: "var(--a-faint)" }} />
      <rect x="24" y="68" width="96" height="10" rx="5" style={{ fill: "var(--a-bar)" }} />
      <rect x="36" y="94" width="104" height="10" rx="5" style={{ fill: "var(--a-soft)" }} />
      <rect x="36" y="118" width="72" height="10" rx="5" style={{ fill: "var(--a-soft)" }} />
      <rect x="36" y="142" width="92" height="10" rx="5" style={{ fill: "var(--a-key)" }} />
      <rect x="36" y="166" width="64" height="10" rx="5" style={{ fill: "var(--a-soft)" }} />
      <rect x="36" y="190" width="88" height="10" rx="5" style={{ fill: "var(--a-soft)" }} />
      <rect x="169" y="150" width="470" height="26" style={{ fill: "var(--a-hl)" }} />
      <g transform="translate(168 0)" className="art-code" key={liveKey}>
        {CODE.map(([x, y, w, h, rx, f], n) => (
          <rect key={n} x={x} y={y} width={w} height={h} rx={rx} style={{ fill: `var(--a-${f})`, "--n": n } as CSSProperties} />
        ))}
      </g>
      <rect className="art-caret" x="462" y="154" width="3" height="18" rx="1.5" style={{ fill: "var(--a-caret)" }} />
    </svg>
  );
}
