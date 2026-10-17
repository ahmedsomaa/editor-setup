import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "@phosphor-icons/react";
import { PageHero } from "@/components/PagePattern";
import { AppearanceTag, LicenseTag } from "@/components/Tag";
import { Button } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/site";

export const Route = createFileRoute("/design")({
  head: () => ({ meta: [{ title: "Design system · EditorSetup" }] }),
  component: Design,
});

const COLORS = [
  ["background", "bg-background", "Page canvas"],
  ["foreground", "bg-foreground", "Text and ink"],
  ["card", "bg-card", "Cards and outline buttons"],
  ["muted", "bg-muted", "Tracks and quiet fills"],
  ["muted-foreground", "bg-muted-foreground", "Secondary text"],
  ["border", "bg-border", "The one hairline"],
  ["accent", "bg-accent", "Active nav label, selection"],
  ["accent-soft", "bg-accent-soft", "Open License tag"],
  ["pastel-green", "bg-pastel-green", "Paid License tag"],
  ["destructive", "bg-destructive", "Errors"],
] as const;

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

const TYPE = [
  ["Heading", "Instrument Serif 400", "font-heading text-4xl tracking-[-0.025em]"],
  ["Body", "Geist, line height 1.6", "font-sans text-lg"],
  ["Code", "Geist Mono", "font-mono text-base"],
] as const;

function Design() {
  return (
    <main id="main">
      <PageHero variant="about" className="pb-4 sm:pb-6">
        <h1>Design system</h1>
        <p className="text-muted-foreground mt-6 max-w-[60ch] text-lg">
          The colors, type and parts behind EditorSetup. Quiet by design, so the
          Fonts and Themes in the Registry are the loudest thing on the page.
        </p>
      </PageHero>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        <section className="mt-20" aria-labelledby="principles">
          <h2 id="principles">Principles</h2>
          <dl className="border-border mt-8 border-t">
            {PRINCIPLES.map(([term, text]) => (
              <div
                key={term}
                className="border-border grid gap-1 border-b py-5 sm:grid-cols-[10rem_1fr] sm:gap-8"
              >
                <dt className="font-medium">{term}</dt>
                <dd className="text-muted-foreground max-w-[60ch]">{text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-20" aria-labelledby="color">
          <h2 id="color">Color</h2>
          <p className="text-muted-foreground mt-6 max-w-[60ch]">
            Light is the default. Dark swaps every token. Switch the theme in
            the footer to see both.
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
        </section>

        <section className="mt-20" aria-labelledby="type">
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
        </section>

        <section className="mt-20" aria-labelledby="buttons">
          <h2 id="buttons">Buttons</h2>
          <p className="text-muted-foreground mt-6 max-w-[60ch]">
            One ink button per view. The rest are outline or ghost. Labels start
            with a verb.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button>Explore the Registry</Button>
            <Button variant="outline">Add a Pair</Button>
            <Button variant="secondary">Copy Settings</Button>
            <Button variant="ghost">Save PNG</Button>
            <Button variant="link">Read more</Button>
          </div>
        </section>

        <section className="mt-20" aria-labelledby="tags">
          <h2 id="tags">Tags</h2>
          <p className="text-muted-foreground mt-6 max-w-[60ch]">
            Color is always paired with a word and an icon, never alone.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <LicenseTag license="open" />
            <LicenseTag license="free" />
            <LicenseTag license="paid" />
            <AppearanceTag appearance="dark" />
            <AppearanceTag appearance="light" />
          </div>
        </section>

        <section className="mt-20" aria-labelledby="source">
          <h2 id="source">Source</h2>
          <p className="text-muted-foreground mt-6 max-w-[60ch]">
            Tokens, component guidelines and the full rules live in the
            repository.
          </p>
          <div className="mt-8">
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <a
                  href={`${GITHUB_URL}/tree/main/docs/design-system`}
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              Read the design docs
              <ArrowUpRight aria-hidden />
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
