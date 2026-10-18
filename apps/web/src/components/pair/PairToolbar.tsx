import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CompareToggle } from "@/components/compare/CompareToggle";
import { CopySettings } from "@/components/pair/CopySettings";
import { pairLabel, type PairRecord } from "@/lib/registry/pairs";

/** The bar under the site header: a way back, links to the page's sections, and the main actions. */
export function PairToolbar({
  pair,
  settings,
}: {
  pair: PairRecord;
  settings: string;
}) {
  return (
    <div className="border-border bg-background/90 z-30 border-b backdrop-blur-sm sm:sticky sm:top-16">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          to="/presets"
          className="text-foreground inline-flex items-center gap-2 text-sm font-medium no-underline hover:underline"
        >
          <ArrowLeft aria-hidden className="size-4" />
          <span className="max-sm:sr-only">Presets</span>
        </Link>
        <nav
          aria-label="On this page"
          className="text-muted-foreground hidden items-center gap-6 text-sm md:flex"
        >
          <a href="#snapshot" className="hover:text-foreground no-underline">
            Snapshot
          </a>
          <a href="#settings" className="hover:text-foreground no-underline">
            Settings
          </a>
          <a href="#details" className="hover:text-foreground no-underline">
            Details
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <CompareToggle
            slug={pair.slug}
            label={pairLabel(pair)}
            className="h-9 px-4 text-sm"
          />
          <CopySettings settings={settings} variant="default" />
        </div>
      </div>
    </div>
  );
}
