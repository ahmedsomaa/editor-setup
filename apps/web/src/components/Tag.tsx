import type { ReactNode } from "react";
import {
  Gift,
  LockOpen,
  Moon,
  Sun,
} from "lucide-react";
import type { Appearance, License } from "@/lib/pairs";
import { LICENSE_LABELS } from "@/lib/pairs";
import { cn } from "cn";

type Tone = "neutral" | "green" | "amber" | "accent";

const TONES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  green: "bg-pastel-green text-pastel-green-text",
  amber: "bg-pastel-amber text-pastel-amber-text",
  accent: "bg-accent-soft text-accent-text",
};

/** Small status label. Colour is paired with the word and an icon, never alone. */
export function Tag({
  children,
  tone = "neutral",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-xs font-medium tracking-[0.05em] uppercase",
        icon && "ps-2",
        TONES[tone],
        className,
      )}
    >
      {icon ? (
        <span aria-hidden className="inline-flex shrink-0 [&_svg]:size-3.5">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}

const LICENSE_STYLE: Record<License, { tone: Tone; icon: ReactNode }> = {
  open: { tone: "green", icon: <LockOpen /> },
  free: { tone: "amber", icon: <Gift /> },
};

/** Open is green, "go". Free is amber, "read the terms first". */
export function LicenseTag({ license }: { license: License }) {
  const { tone, icon } = LICENSE_STYLE[license];
  return (
    <Tag tone={tone} icon={icon}>
      {LICENSE_LABELS[license]}
    </Tag>
  );
}

/** One License for a whole Pair: Open only if both sides are Open. */
export function PairLicenseTag({
  font,
  theme,
}: {
  font: License;
  theme: License;
}) {
  const license: License = font === "open" && theme === "open" ? "open" : "free";
  return <LicenseTag license={license} />;
}

export function AppearanceTag({ appearance }: { appearance: Appearance }) {
  return (
    <Tag
      icon={
        appearance === "dark" ? <Moon /> : <Sun />
      }
    >
      {appearance}
    </Tag>
  );
}
