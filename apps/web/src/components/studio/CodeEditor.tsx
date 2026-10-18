import { useRef, type CSSProperties } from "react";
import type { ThemedToken } from "shiki/core";

export type CodeColors = { bg: string; fg: string; lines: ThemedToken[][]; text: string };

const TEXT = "p-5 font-mono text-sm leading-relaxed whitespace-pre";

/**
 * A code box with syntax colors: the colored text is drawn in a `pre` and a transparent textarea sits on top to take the typing.
 * Both share the same font, padding and scroll, so they line up. While a pause in typing is still ahead of the colors, the
 * text is drawn in one color, because old colors would no longer match the new text.
 */
export function CodeEditor({
  code,
  onChange,
  colors,
}: {
  code: string;
  onChange: (code: string) => void;
  colors: CodeColors | null;
}) {
  const preRef = useRef<HTMLPreElement>(null);
  const ready = colors !== null && colors.text === code && colors.lines.map((l) => l.map((t) => t.content).join("")).join("\n") === code;

  return (
    <div
      className="absolute inset-0"
      style={{ background: colors?.bg, "--fg": colors?.fg } as CSSProperties}
    >
      <pre
        ref={preRef}
        aria-hidden
        className={`${TEXT} pointer-events-none absolute inset-0 m-0 overflow-hidden`}
        style={{ color: colors?.fg }}
      >
        {ready
          ? colors.lines.map((line, i) => (
              <span key={i}>
                {line.map((token, j) => (
                  <span key={j} style={{ color: token.color }}>
                    {token.content}
                  </span>
                ))}
                {"\n"}
              </span>
            ))
          : `${code}\n`}
      </pre>
      <textarea
        data-lenis-prevent
        aria-label="Code"
        name="code"
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onScroll={(e) => {
          const pre = preRef.current;
          if (!pre) return;
          pre.scrollTop = e.currentTarget.scrollTop;
          pre.scrollLeft = e.currentTarget.scrollLeft;
        }}
        placeholder="Paste or write your code here"
        spellCheck={false}
        wrap="off"
        autoFocus
        className={`${TEXT} absolute inset-0 size-full resize-none border-0 bg-transparent text-transparent outline-none placeholder:text-[var(--fg,var(--muted-foreground))] placeholder:opacity-50 selection:bg-[color-mix(in_srgb,var(--fg,#888)_25%,transparent)]`}
        style={{ caretColor: colors?.fg }}
      />
    </div>
  );
}
