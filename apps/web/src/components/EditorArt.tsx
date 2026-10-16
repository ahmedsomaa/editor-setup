import type { CSSProperties } from "react";

type Colors = { bg: string; fg: string };

const mix = (a: string, pct: number, b: string) => `color-mix(in srgb, ${a} ${pct}%, ${b})`;

/** Without colours it uses the site's tokens; with a Pair's colours it is painted in that Theme. */
function vars(c?: Colors): CSSProperties {
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

/** Decorative editor window. Cropped by its parent; pass a Pair's colours to paint it in that Theme. */
export function EditorArt({ className, colors, complete = false }: { className?: string; colors?: Colors; complete?: boolean }) {
  const h = complete ? 378 : 420;
  return (
    <svg
      className={className}
      viewBox="0 0 640 380"
      fill="none"
      aria-hidden="true"
      style={{ ...vars(colors), transition: "all 400ms ease-out" }}
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
      <g transform="translate(168 0)">
        <rect x="64" y="107" width="14" height="8" rx="4" style={{ fill: "var(--a-soft)" }} />
        <rect x="96" y="104" width="46" height="14" rx="7" style={{ fill: "var(--a-key)" }} />
        <rect x="152" y="104" width="70" height="14" rx="7" style={{ fill: "var(--a-soft)" }} />
        <rect x="232" y="104" width="18" height="14" rx="7" style={{ fill: "var(--a-faint)" }} />
        <rect x="64" y="133" width="14" height="8" rx="4" style={{ fill: "var(--a-soft)" }} />
        <rect x="124" y="130" width="34" height="14" rx="7" style={{ fill: "var(--a-key)" }} />
        <rect x="168" y="130" width="92" height="14" rx="7" style={{ fill: "var(--a-soft)" }} />
        <rect x="270" y="130" width="34" height="14" rx="7" style={{ fill: "var(--a-str)" }} />
        <rect x="64" y="159" width="14" height="8" rx="4" style={{ fill: "var(--a-soft)" }} />
        <rect x="124" y="156" width="34" height="14" rx="7" style={{ fill: "var(--a-key)" }} />
        <rect x="168" y="156" width="58" height="14" rx="7" style={{ fill: "var(--a-soft)" }} />
        <rect x="236" y="156" width="78" height="14" rx="7" style={{ fill: "var(--a-str)" }} />
        <rect x="64" y="185" width="14" height="8" rx="4" style={{ fill: "var(--a-soft)" }} />
        <rect x="152" y="182" width="64" height="14" rx="7" style={{ fill: "var(--a-soft)" }} />
        <rect x="226" y="182" width="22" height="14" rx="7" style={{ fill: "var(--a-faint)" }} />
        <rect x="258" y="182" width="100" height="14" rx="7" style={{ fill: "var(--a-str)" }} />
        <rect x="64" y="211" width="14" height="8" rx="4" style={{ fill: "var(--a-soft)" }} />
        <rect x="152" y="208" width="40" height="14" rx="7" style={{ fill: "var(--a-key)" }} />
        <rect x="202" y="208" width="84" height="14" rx="7" style={{ fill: "var(--a-soft)" }} />
        <rect x="64" y="237" width="14" height="8" rx="4" style={{ fill: "var(--a-soft)" }} />
        <rect x="124" y="234" width="18" height="14" rx="7" style={{ fill: "var(--a-faint)" }} />
        <rect x="64" y="263" width="14" height="8" rx="4" style={{ fill: "var(--a-soft)" }} />
        <rect x="96" y="260" width="46" height="14" rx="7" style={{ fill: "var(--a-key)" }} />
        <rect x="152" y="260" width="54" height="14" rx="7" style={{ fill: "var(--a-soft)" }} />
        <rect x="216" y="260" width="26" height="14" rx="7" style={{ fill: "var(--a-faint)" }} />
        <rect x="252" y="260" width="70" height="14" rx="7" style={{ fill: "var(--a-soft)" }} />
        <rect x="332" y="260" width="18" height="14" rx="7" style={{ fill: "var(--a-faint)" }} />
        <rect x="64" y="289" width="14" height="8" rx="4" style={{ fill: "var(--a-soft)" }} />
        <rect x="124" y="286" width="88" height="14" rx="7" style={{ fill: "var(--a-soft)" }} />
        <rect x="222" y="286" width="30" height="14" rx="7" style={{ fill: "var(--a-str)" }} />
        <rect x="64" y="315" width="14" height="8" rx="4" style={{ fill: "var(--a-soft)" }} />
        <rect x="124" y="312" width="34" height="14" rx="7" style={{ fill: "var(--a-key)" }} />
        <rect x="168" y="312" width="72" height="14" rx="7" style={{ fill: "var(--a-soft)" }} />
        <rect x="250" y="312" width="44" height="14" rx="7" style={{ fill: "var(--a-faint)" }} />
      </g>
      <rect x="462" y="154" width="3" height="18" rx="1.5" style={{ fill: "var(--a-caret)" }} />
    </svg>
  );
}
