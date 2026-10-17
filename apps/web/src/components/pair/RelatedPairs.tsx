import { Suspense } from "react";
import { Await } from "@tanstack/react-router";
import { Reveal } from "@/components/layout/Reveal";
import { Directory } from "@/components/registry/Directory";
import type { PairRecord } from "@/lib/registry/pairs";

/** Other Pairs, shown once the streamed list arrives. */
export function RelatedPairs({ related }: { related: Promise<PairRecord[]> }) {
  return (
    <Reveal
      as="section"
      className="border-border mt-20 border-t pt-16"
      aria-labelledby="related-heading"
    >
      <h2 id="related-heading">More Pairs</h2>
      <div className="mt-8">
        <Suspense
          fallback={
            <p className="text-muted-foreground text-sm" role="status">
              Loading related Pairs
            </p>
          }
        >
          <Await promise={related}>
            {(pairs: PairRecord[]) =>
              pairs.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No related Pairs yet.
                </p>
              ) : (
                <Directory pairs={pairs} preview={false} />
              )
            }
          </Await>
        </Suspense>
      </div>
    </Reveal>
  );
}
