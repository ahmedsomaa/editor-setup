import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PagePattern";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/site";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/changelog")({
  head: () =>
    pageHead({
      path: "/changelog",
      title: "EditorSetup Changelog: new Pairs, pages and Editors",
      description:
        "Release notes for EditorSetup: new Pairs, pages and Editors, with the date of each change. See what is new in the Registry and Snapshot Studio.",
    }),
  component: Changelog,
});

const ENTRIES = [
  {
    date: "2026-10-17",
    title: "Pair updates",
    changes: [
      "Updated Pair: Fira Code with Palenight Theme.",
      "Updated Pair: Geist Mono with Aura Dark.",
      "Updated Pair: Geist Mono with Vesper.",
      "Updated Pair: Inconsolata with Vitesse Dark.",
      "Updated Pair: Inconsolata with Vitesse Light.",
      "Updated Pair: JetBrains Mono with Gruvbox Dark Hard.",
      "Updated Pair: Zed Mono with Gruvbox Light Hard.",
    ],
  },
  {
    date: "2026-10-17",
    title: "Landing sections and motion",
    changes: [
      "Rebuilt landing sections with animated art for Compare and Snapshot.",
      "A Compare drawer picker, and pagination in the Registry.",
      "A reworked Snapshot Studio with swatches in its menus, plus new Snapshots.",
      "Paid licenses dropped, and icons moved to Lucide.",
      "A page transition, site-wide smooth scroll and scroll motion.",
      "Open Graph image, canonical URLs and tighter page titles for sharing and search.",
      "Fixed the Registry search on mobile.",
    ],
  },
  {
    date: "2026-10-17",
    title: "A rebuilt Registry",
    changes: [
      "New home, Registry, Pair, Compare and Snapshot Studio pages.",
      "Four new Pairs, and every Pair now leads with its Snapshot.",
      "Editors narrowed to VS Code and Cursor.",
      "Thumbnails dropped in favor of cropping the Snapshot.",
      "A Design system page and a Changelog page, linked from the footer.",
    ],
  },
  {
    date: "2026-10-13",
    title: "Pair pages",
    changes: [
      "Each Pair has its own page with a Snapshot and copyable Settings.",
      "The home hook rotates through three open Pairs.",
      "Geist and Geist Mono join the type stack.",
    ],
  },
  {
    date: "2026-10-12",
    title: "A new foundation",
    changes: [
      "The site moved to TanStack Start with shadcn, running on Cloudflare.",
    ],
  },
] as const;

function Changelog() {
  return (
    <main id="main">
      <PageHero variant="about" className="pb-4 sm:pb-6">
        <h1>Changelog</h1>
        <p className="text-muted-foreground mt-6 max-w-[60ch] text-lg">
          Every change, newest first.
        </p>
      </PageHero>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        <ol className="border-border mt-16 list-none border-t p-0">
          {ENTRIES.map((entry) => (
            <Reveal
              as="li"
              key={`${entry.date}-${entry.title}`}
              className="border-border grid gap-2 border-b py-8 sm:grid-cols-[10rem_1fr] sm:gap-8"
            >
              <time
                dateTime={entry.date}
                className="text-muted-foreground font-mono text-sm"
              >
                {entry.date}
              </time>
              <div>
                <h2 className="text-3xl md:text-3xl">{entry.title}</h2>
                <ul className="text-muted-foreground mt-4 max-w-[60ch] list-disc space-y-1 ps-5">
                  {entry.changes.map((change) => (
                    <li key={change}>{change}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="mt-8">
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <a
                href={`${GITHUB_URL}/commits/main`}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            See every commit
            <ArrowUpRight aria-hidden />
          </Button>
        </div>
      </div>
    </main>
  );
}
