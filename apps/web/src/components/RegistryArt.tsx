import { artVars, type Colors } from "@/components/EditorArt";

const ROW_Y = 116;
const ROW_PITCH = 54;
const ROWS = [
  { font: 92, theme: 70, tag: "key" },
  { font: 74, theme: 96, tag: "str" },
  { font: 108, theme: 60, tag: "key" },
  { font: 66, theme: 84, tag: "soft" },
  { font: 98, theme: 78, tag: "str" },
] as const;

const TAGS = { key: "var(--a-hl)", str: "var(--a-faint)", soft: "var(--a-tab)" } as const;

/** Row each hero Pair lands on, and where the pointer rests on it, so the browsing does not read as a top-to-bottom scan. */
const ROW_FOR = [0, 2, 1, 3] as const;
const POINTER_X = [420, 250, 380, 190, 330] as const;

/**
 * Decorative Registry: a highlight and a pointer move to a new row each time the hero changes Pair.
 * It has no loop of its own, so the hero's pause button stops it too.
 */
export function RegistryArt({
  className,
  colors,
  step = 0,
}: {
  className?: string;
  colors?: Colors;
  /** Index of the Pair the hero is showing. */
  step?: number;
}) {
  const row = ROW_FOR[((step % ROW_FOR.length) + ROW_FOR.length) % ROW_FOR.length]!;
  const dy = row * ROW_PITCH;
  return (
    <div className={className}>
      <svg
        viewBox="0 0 640 400"
        fill="none"
        aria-hidden="true"
        className="art-live art-browse w-full"
        style={artVars(colors)}
      >
        <rect
          x="1"
          y="1"
          width="638"
          height="398"
          rx="14"
          strokeWidth="2"
          style={{ fill: "var(--a-win)", stroke: "var(--a-edge)" }}
        />
        <path d="M1 44h638" strokeWidth="2" style={{ stroke: "var(--a-edge)" }} />
        <circle cx="26" cy="23" r="5" style={{ fill: "var(--a-bar)" }} />
        <circle cx="44" cy="23" r="5" style={{ fill: "var(--a-bar)" }} />
        <circle cx="62" cy="23" r="5" style={{ fill: "var(--a-bar)" }} />

        <rect x="24" y="62" width="300" height="32" rx="16" style={{ fill: "var(--a-tab)" }} />
        <circle cx="44" cy="78" r="6" strokeWidth="2" style={{ stroke: "var(--a-bar)" }} />
        <path d="M49 83l5 5" strokeWidth="2" strokeLinecap="round" style={{ stroke: "var(--a-bar)" }} />
        <rect x="64" y="74" width="96" height="8" rx="4" style={{ fill: "var(--a-bar)" }} />
        {[340, 410, 480].map((x, i) => (
          <rect
            key={x}
            x={x}
            y="62"
            width={i === 1 ? 62 : 56}
            height="32"
            rx="16"
            strokeWidth="2"
            style={{ fill: "none", stroke: "var(--a-edge)" }}
          />
        ))}

        {ROWS.map((r, i) => {
          const y = ROW_Y + i * ROW_PITCH;
          return (
            <g key={i}>
              <rect
                x="24"
                y={y}
                width="592"
                height="44"
                rx="12"
                strokeWidth="2"
                style={{ fill: "none", stroke: "var(--a-edge)" }}
              />
              <rect x="38" y={y + 10} width="24" height="24" rx="8" style={{ fill: "var(--a-faint)" }} />
              <rect x="74" y={y + 14} width={r.font} height="16" rx="8" style={{ fill: "var(--a-soft)" }} />
              <rect x="282" y={y + 17} width={r.theme} height="10" rx="5" style={{ fill: "var(--a-faint)" }} />
              <rect x="526" y={y + 11} width="76" height="22" rx="11" style={{ fill: TAGS[r.tag] }} />
            </g>
          );
        })}

        <g className="art-browse-hl" style={{ transform: `translateY(${dy}px)` }}>
          <rect
            x="24"
            y={ROW_Y}
            width="592"
            height="44"
            rx="12"
            strokeWidth="2"
            style={{ fill: "var(--a-hl)", stroke: "var(--a-caret)" }}
          />
          <rect x="38" y={ROW_Y + 10} width="24" height="24" rx="8" style={{ fill: "var(--a-caret)" }} />
          <rect x="74" y={ROW_Y + 14} width="92" height="16" rx="8" style={{ fill: "var(--a-key)" }} />
          <rect x="282" y={ROW_Y + 17} width="70" height="10" rx="5" style={{ fill: "var(--a-soft)" }} />
        </g>

        <g
          className="art-browse-cursor"
          style={{ transform: `translate(${POINTER_X[row]}px, ${dy}px)` }}
        >
          <path
            d="M0 0l0 20 5.5-5 4 8.5 3-1.4-4-8.3 7.5-.3z"
            strokeWidth="1.5"
            strokeLinejoin="round"
            style={{ fill: "var(--a-caret)", stroke: "var(--a-win)" }}
            transform={`translate(0 ${ROW_Y + 12})`}
          />
        </g>
      </svg>
    </div>
  );
}
