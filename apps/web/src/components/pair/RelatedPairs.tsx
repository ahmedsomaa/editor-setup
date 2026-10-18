import { Suspense } from "react";
import { Await } from "@tanstack/react-router";
import { Reveal } from "@/components/layout/Reveal";
import { Directory } from "@/components/registry/Directory";
import type { PairRecord } from "@/lib/registry/pairs";

/** Other Presets, shown once the streamed list arrives. */
export function RelatedPairs({ related }: { related: Promise<PairRecord[]> }) {
  return (
    <Reveal
      as="section"
      className="border-border mt-20 border-t pt-16"
      aria-labelledby="related-heading"
    >
      <h2 id="related-heading">More Presets</h2>
      <div className="mt-8">
        <Suspense
          fallback={
            <p className="text-muted-foreground text-sm" role="status">
              Loading related Presets
            </p>
          }
        >
          <Await promise={related}>
            {(pairs: PairRecord[]) =>
              pairs.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No related Presets yet.
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
