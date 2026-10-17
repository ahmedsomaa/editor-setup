import { Reveal } from "@/components/layout/Reveal";
import { PairDetail } from "@/components/pair/PairDetail";
import type { PairRecord } from "@/lib/registry/pairs";

/** The Font and the Theme side by side, with their Licenses and links. */
export function PairDetails({ pair }: { pair: PairRecord }) {
  return (
    <Reveal
      as="section"
      id="details"
      aria-labelledby="details-heading"
      className="mt-16 scroll-mt-32"
    >
      <h2 id="details-heading">Details</h2>
      <div className="border-border mt-6 grid border-y md:grid-cols-2 md:divide-x">
        <PairDetail
          title="Font"
          name={pair.font.name}
          license={pair.font.license}
          links={pair.font.links}
          className="md:pe-8"
        />
        <PairDetail
          title="Theme"
          name={pair.theme.name}
          license={pair.theme.license}
          links={pair.theme.links}
          appearance={pair.theme.appearance}
          className="border-border max-md:border-t md:ps-8"
        />
      </div>
    </Reveal>
  );
}
