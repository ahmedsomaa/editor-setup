import type { PlaygroundTheme } from "@/lib/playground-tokens";
import { cn } from "cn";

type TokenWindowProps = {
  theme: PlaygroundTheme;
  fontFamily: string;
  filename: string;
  className?: string;
  /** Smaller type, so longer lines fit a narrow window without scrolling. */
  compact?: boolean;
  /** Wrap long lines instead of scrolling sideways, so nothing hides past the edge on a narrow screen. */
  wrap?: boolean;
};

/** A window painted with a real Theme's own token colours, in the Pair's Font. */
export function TokenWindow({
  theme,
  fontFamily,
  filename,
  className,
  compact = false,
  wrap = false,
}: TokenWindowProps) {
  const mix = (pct: number) =>
    `color-mix(in srgb, ${theme.fg} ${pct}%, ${theme.bg})`;
  return (
    <div
      className={cn("overflow-hidden rounded-xl text-start", className)}
      style={{
        background: theme.bg,
        color: theme.fg,
        border: `1px solid ${mix(16)}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        transition: "background-color 300ms ease-out, color 300ms ease-out",
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ borderBottom: `1px solid ${mix(14)}` }}
      >
        <span aria-hidden className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-2.5 rounded-full"
              style={{ background: mix(26) }}
            />
          ))}
        </span>
        <span
          className="min-w-0 truncate text-xs"
          style={{ color: mix(65), fontFamily }}
        >
          {filename}
        </span>
      </div>
      <pre
        className={cn(
          "m-0 overflow-x-auto px-4 py-5 leading-[1.7]",
          compact
            ? "text-[11px] sm:text-[12.5px]"
            : "text-[13px] sm:text-sm lg:text-base",
        )}
        style={{ fontFamily, background: "transparent" }}
      >
        <code
          className={cn(
            "block bg-transparent p-0 text-[length:inherit]",
            wrap ? "w-full whitespace-pre-wrap break-words" : "w-max min-w-full",
          )}
          style={{ fontFamily: "inherit" }}
        >
          {theme.lines.map((line, i) => (
            <span key={i} className="flex">
              <span
                aria-hidden
                className="w-6 shrink-0 pe-3 text-end tabular-nums select-none"
                style={{ color: mix(32) }}
              >
                {i + 1}
              </span>
              <span className="min-w-0">
                {line.length === 0
                  ? " "
                  : line.map(([text, color, style], j) => (
                      <span
                        key={j}
                        style={{
                          color,
                          fontStyle: style & 1 ? "italic" : undefined,
                          fontWeight: style & 2 ? 700 : undefined,
                          textDecoration: style & 4 ? "underline" : undefined,
                        }}
                      >
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
