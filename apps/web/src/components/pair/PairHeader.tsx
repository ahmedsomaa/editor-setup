import { ShareButton } from "@/components/common/ShareButton";
import { PageHero } from "@/components/layout/PagePattern";
import { pairLabel, type PairRecord } from "@/lib/registry/pairs";

/** The Preset's title, who submitted it, and a share button. */
export function PairHeader({ pair }: { pair: PairRecord }) {
  return (
    <PageHero variant="pair" className="pt-12 pb-6 sm:pt-16 sm:pb-8">
      <header>
        <h1>
          {pair.theme.name}
          <span className="sr-only"> with </span>
          <span aria-hidden className="text-muted-foreground mx-[0.35em]">
            ·
          </span>
          {pair.font.name}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
          {pair.submittedBy ? (
            <span className="text-muted-foreground font-sans text-base">
              by{" "}
              <a
                href={pair.submittedBy.url}
                target="_blank"
                rel="noreferrer"
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                @{pair.submittedBy.name}
              </a>
            </span>
          ) : null}
          <ShareButton title={pairLabel(pair)} className="sm:ms-auto" />
        </div>
      </header>
    </PageHero>
  );
}
