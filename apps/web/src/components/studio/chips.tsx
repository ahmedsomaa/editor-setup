import { LoaderCircle as Loader2, Moon, Sun } from "lucide-react";
import { cn } from "cn";
import SWATCHES from "@/lib/theme/theme-swatches.json";

/** A small tile in front of an option: "Aa" for a Font, an icon for the "Other" choices. */
export function OptionChip({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-card text-foreground border-border flex size-6 shrink-0 items-center justify-center rounded-md border text-[11px] leading-none",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function IconChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-muted text-muted-foreground inline-flex size-7 items-center justify-center rounded-full">
      {children}
    </span>
  );
}

/** A Theme's own colors: its background with four dots for keywords, strings, functions and numbers. */
export function ThemeSwatch({ id, dark }: { id: string; dark?: boolean }) {
  const swatch = (SWATCHES as Record<string, { bg: string; dots: string[] }>)[
    id
  ];
  if (!swatch)
    return (
      <OptionChip
        className={
          dark ? "bg-foreground text-background border-transparent" : undefined
        }
      >
        {dark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
      </OptionChip>
    );
  return (
    <span
      aria-hidden
      className="border-border flex h-6 shrink-0 items-center gap-1 rounded-md border px-1.5"
      style={{ background: swatch.bg }}
    >
      {swatch.dots.map((color, i) => (
        <span
          key={i}
          className="size-1.5 rounded-full"
          style={{ background: color }}
        />
      ))}
    </span>
  );
}

export function Rendering({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn("bg-muted flex items-center justify-center", className)}
      role="status"
    >
      <Loader2
        className="text-muted-foreground size-5 animate-spin motion-reduce:animate-none"
        aria-hidden
      />
      <span className="sr-only">Rendering {label}</span>
    </div>
  );
}
