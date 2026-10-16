import type { ReactNode } from "react";
import { cn } from "cn";

type Tone = "neutral" | "green";

const TONES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  green: "bg-pastel-green text-pastel-green-text",
};

/** Small status label. Colour is paired with the word, never alone. */
export function Tag({ children, tone = "neutral", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium tracking-[0.05em] uppercase",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
