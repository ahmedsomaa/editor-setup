import type { CodeLine, TokenKind } from "@/lib/studio/settings-snippet";
import { cn } from "cn";

export type WindowPair = {
  fontFamily: string;
  bg: string;
  fg: string;
};

/** Split plain Settings text into keys, values and punctuation for painting. */
export function textToLines(text: string): CodeLine[] {
  return text.split("\n").map((line) => {
    const out: Array<[string, TokenKind]> = [];
    const re = /("(?:[^"\\]|\\.)*")|([^"]+)/g;
    let m: RegExpExecArray | null;
    let seenKey = false;
    while ((m = re.exec(line))) {
      if (m[1]) {
        const isKey = !seenKey && /^\s*"/.test(line) && /:\s/.test(line.slice(m.index + m[1].length, m.index + m[1].length + 2));
        out.push([m[1], isKey ? "k" : "s"]);
        seenKey = true;
      } else {
        out.push([m[2], "p"]);
      }
    }
    return out;
  });
}

type PairWindowProps = {
  pair: WindowPair;
  filename: string;
  lines: CodeLine[];
  className?: string;
  /** Smaller type for dense layouts. */
  compact?: boolean;
  /** Wrap long lines instead of scrolling sideways, so nothing hides past the edge on a narrow screen. */
  wrap?: boolean;
};

/** A window painted in one Preset's own colours and Font: the only saturated thing on a page. */
export function PairWindow({ pair, filename, lines, className, compact = false, wrap = false }: PairWindowProps) {
  const mix = (pct: number) => `color-mix(in srgb, ${pair.fg} ${pct}%, ${pair.bg})`;
  const tone = { k: mix(78), s: pair.fg, p: mix(45) } as const;

  return (
    <div
      className={cn("overflow-hidden rounded-xl text-start", className)}
      style={{
        background: pair.bg,
        color: pair.fg,
        border: `1px solid ${mix(16)}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        transition: "background-color 300ms ease-out, color 300ms ease-out, border-color 300ms ease-out",
      }}
    >
      <div className={cn("flex items-center gap-3", compact ? "px-3 py-2" : "px-4 py-3")} style={{ borderBottom: `1px solid ${mix(14)}` }}>
        <span aria-hidden className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full" style={{ background: mix(26) }} />
          ))}
        </span>
        <span className="min-w-0 truncate text-xs" style={{ color: mix(65), fontFamily: pair.fontFamily }}>
          {filename}
        </span>
      </div>
      <pre
        className={cn("m-0 overflow-x-auto leading-[1.75]", compact ? "px-3 py-3 text-[11px]" : "px-4 py-5 text-[13px] sm:text-sm")}
        style={{ fontFamily: pair.fontFamily, background: "transparent" }}
      >
        <code
          className={cn("block bg-transparent p-0 text-[length:inherit]", wrap ? "w-full whitespace-pre-wrap break-words" : "w-max min-w-full")}
          style={{ fontFamily: "inherit" }}
        >
          {lines.map((line, i) => (
            <span key={i} className="flex">
              <span aria-hidden className="w-6 shrink-0 pe-3 text-end tabular-nums select-none" style={{ color: mix(32) }}>
                {i + 1}
              </span>
              <span className="min-w-0">
                {line.map(([text, kind], j) => (
                  <span key={j} style={{ color: tone[kind] }}>
                    {text}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
