import type { ReactNode } from "react";
import {
  CurrencyDollar,
  Gift,
  LockSimpleOpen,
  Moon,
  Sun,
} from "@phosphor-icons/react";
import type { Appearance, License } from "@/lib/pairs";
import { LICENSE_LABELS } from "@/lib/pairs";
import { cn } from "cn";

type Tone = "neutral" | "green" | "accent";

const TONES: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground",
  green: "bg-pastel-green text-pastel-green-text",
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
  open: { tone: "accent", icon: <LockSimpleOpen weight="bold" /> },
  free: { tone: "neutral", icon: <Gift weight="bold" /> },
  paid: { tone: "green", icon: <CurrencyDollar weight="bold" /> },
};

/** Open is teal, Free is grey, Paid is money green. */
export function LicenseTag({ license }: { license: License }) {
  const { tone, icon } = LICENSE_STYLE[license];
  return (
    <Tag tone={tone} icon={icon}>
      {LICENSE_LABELS[license]}
    </Tag>
  );
}

/** One License for a whole Pair: Paid if either side is Paid, Open only if both are Open. */
export function PairLicenseTag({
  font,
  theme,
}: {
  font: License;
  theme: License;
}) {
  const license: License =
    font === "paid" || theme === "paid"
      ? "paid"
      : font === "open" && theme === "open"
        ? "open"
        : "free";
  return <LicenseTag license={license} />;
}

export function AppearanceTag({ appearance }: { appearance: Appearance }) {
  return (
    <Tag
      icon={
        appearance === "dark" ? <Moon weight="bold" /> : <Sun weight="bold" />
      }
    >
      {appearance}
    </Tag>
  );
}
