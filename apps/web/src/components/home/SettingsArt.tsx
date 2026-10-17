import { ArtPlayer } from "@/components/home/ArtPlayer";
import { artVars, type Colors } from "@/components/home/EditorArt";

/** [key width, value width] for each line of the settings file. */
const LINES = [
  [78, 132],
  [58, 40],
  [86, 56],
  [64, 112],
] as const;

const CODE_ROWS = [
  [24, 70], [48, 110], [48, 84], [72, 96], [72, 54],
  [48, 100], [24, 40], [24, 88], [48, 64],
] as const;

/** Decorative Settings: a settings file fills in, Copy is pressed, and the editor lights up in the Theme. */
export function SettingsArt({ className, colors }: { className?: string; colors?: Colors }) {
  return (
    <ArtPlayer className={className}>
      <svg
        viewBox="0 0 640 400"
        fill="none"
        aria-hidden="true"
        className="art-live art-settings w-full"
        style={artVars(colors)}
      >
        <rect x="1" y="1" width="328" height="398" rx="14" strokeWidth="2" style={{ fill: "var(--a-win)", stroke: "var(--a-edge)" }} />
        <path d="M1 44h328" strokeWidth="2" style={{ stroke: "var(--a-edge)" }} />
        {[26, 44, 62].map((x) => (
          <circle key={x} cx={x} cy="23" r="5" style={{ fill: "var(--a-bar)" }} />
        ))}
        <rect x="96" y="12" width="104" height="24" rx="12" strokeWidth="2" style={{ fill: "var(--a-tab)", stroke: "var(--a-edge)" }} />
        <rect x="112" y="20" width="60" height="8" rx="4" style={{ fill: "var(--a-bar)" }} />

        <rect x="2" y="212" width="326" height="32" style={{ fill: "var(--a-hl)" }} />
        {LINES.map(([k, v], i) => {
          const y = 80 + i * 44;
          return (
            <g key={i}>
              <rect x="24" y={y} width={k} height="14" rx="7" style={{ fill: "var(--a-key)" }} />
              <rect x={24 + k + 12} y={y} width={v} height="14" rx="7" className={`art-line art-line-${i}`} style={{ fill: i === 3 ? "var(--a-str)" : "var(--a-soft)" }} />
            </g>
          );
        })}

        <g className="art-press">
          <rect x="24" y="316" width="156" height="44" rx="22" strokeWidth="2" style={{ fill: "var(--a-tab)", stroke: "var(--a-edge)" }} />
          <rect x="44" y="330" width="16" height="16" rx="4" style={{ fill: "var(--a-bar)" }} />
          <rect x="72" y="334" width="64" height="8" rx="4" style={{ fill: "var(--a-bar)" }} />
          <g className="art-done">
            <rect x="24" y="316" width="156" height="44" rx="22" style={{ fill: "var(--a-caret)" }} />
            <path d="M46 338l6 6 10-12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--a-win)" }} />
            <rect x="74" y="334" width="52" height="8" rx="4" style={{ fill: "var(--a-win)" }} />
          </g>
        </g>

        {[0, 1, 2].map((n) => (
          <circle key={n} cx={354 + n * 18} cy="200" r="4" className={`art-dot art-dot-${n}`} style={{ fill: "var(--a-caret)" }} />
        ))}

        <g className="art-editor">
          <rect x="400" y="1" width="238" height="398" rx="14" strokeWidth="2" style={{ fill: "var(--a-win)", stroke: "var(--a-edge)" }} />
          <path d="M400 44h238" strokeWidth="2" style={{ stroke: "var(--a-edge)" }} />
          {[424, 440, 456].map((x) => (
            <circle key={x} cx={x} cy="23" r="4" style={{ fill: "var(--a-bar)" }} />
          ))}
          <rect x="401" y="150" width="236" height="26" style={{ fill: "var(--a-hl)" }} />
          {CODE_ROWS.map(([dx, w], i) => (
            <rect
              key={i}
              x={424 + dx - 24}
              y={68 + i * 30}
              width={w}
              height="12"
              rx="6"
              style={{ fill: i % 3 === 0 ? "var(--a-key)" : i % 3 === 1 ? "var(--a-soft)" : "var(--a-str)" }}
            />
          ))}
        </g>
      </svg>
    </ArtPlayer>
  );
}
