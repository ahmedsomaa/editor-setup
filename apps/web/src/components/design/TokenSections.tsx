import { Reveal } from "@/components/layout/Reveal";
import { TermList } from "@/components/common/TermList";

const PRINCIPLES = [
  [
    "Warm monochrome",
    "Canvas, text and edges carry the page. One deep teal accent marks what is active. A Pair's own colors appear only inside its window.",
  ],
  [
    "One hairline",
    "Sections are split by a 1px border. Cards are a fill plus that border. Never put a card inside a card.",
  ],
  [
    "Pills and panels",
    "Anything you press or type into is a pill. Anything that holds content has a 12px radius.",
  ],
  [
    "Flat",
    "No gradients, glass or heavy shadows. The one exception is a dot pattern that fades out behind a hero.",
  ],
] as const;

const COLORS = [
  ["background", "bg-background", "Page canvas"],
  ["foreground", "bg-foreground", "Text and ink"],
  ["card", "bg-card", "Cards and outline buttons"],
  ["muted", "bg-muted", "Tracks and quiet fills"],
  ["muted-foreground", "bg-muted-foreground", "Secondary text"],
  ["border", "bg-border", "The one hairline"],
  ["accent", "bg-accent", "Active nav label, selection"],
  ["accent-soft", "bg-accent-soft", "Selected rows"],
  ["pastel-green", "bg-pastel-green", "Open License tag"],
  ["pastel-amber", "bg-pastel-amber", "Free License tag"],
  ["destructive", "bg-destructive", "Errors"],
] as const;

const TYPE = [
  [
    "Heading",
    "Instrument Serif 400",
    "font-heading text-4xl tracking-[-0.025em]",
  ],
  ["Body", "Geist, line height 1.6", "font-sans text-lg"],
  ["Code", "Geist Mono", "font-mono text-base"],
] as const;

export function PrinciplesSection() {
  return (
    <Reveal as="section" className="mt-20" aria-labelledby="principles">
      <h2 id="principles">Principles</h2>
      <TermList terms={PRINCIPLES} />
    </Reveal>
  );
}

export function ColorSection() {
  return (
    <Reveal as="section" className="mt-20" aria-labelledby="color">
      <h2 id="color">Color</h2>
      <p className="text-muted-foreground mt-6 max-w-[60ch]">
        Light is the default. Dark swaps every token. Switch the theme in the
        footer to see both.
      </p>
      <ul className="mt-8 grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 lg:grid-cols-5">
        {COLORS.map(([name, swatch, use]) => (
          <li
            key={name}
            className="bg-card border-border overflow-hidden rounded-xl border"
          >
            <div
              aria-hidden
              className={`${swatch} border-border h-20 border-b`}
            />
            <div className="p-3">
              <code className="text-sm">{name}</code>
              <p className="text-muted-foreground mt-1 text-xs">{use}</p>
            </div>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export function TypeSection() {
  return (
    <Reveal as="section" className="mt-20" aria-labelledby="type">
      <h2 id="type">Type</h2>
      <dl className="border-border mt-8 border-t">
        {TYPE.map(([name, face, cls]) => (
          <div
            key={name}
            className="border-border grid gap-1 border-b py-6 sm:grid-cols-[10rem_1fr] sm:gap-8"
          >
            <dt>
              <span className="font-medium">{name}</span>
              <span className="text-muted-foreground block text-sm">
                {face}
              </span>
            </dt>
            <dd className={cls}>Make the place you code feel like yours.</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
