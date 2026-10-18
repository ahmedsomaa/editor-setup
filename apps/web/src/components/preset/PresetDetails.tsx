import { Reveal } from "@/components/layout/Reveal";
import { PresetDetail } from "@/components/preset/PresetDetail";
import type { PresetRecord } from "@/lib/presets/presets";

/** The Font and the Theme side by side, with their Licenses and links. */
export function PresetDetails({ preset }: { preset: PresetRecord }) {
  return (
    <Reveal
      as="section"
      id="details"
      aria-labelledby="details-heading"
      className="mt-16 scroll-mt-32"
    >
      <h2 id="details-heading">Details</h2>
      <div className="border-border mt-6 grid border-y md:grid-cols-2 md:divide-x">
        <PresetDetail
          title="Font"
          name={preset.font.name}
          license={preset.font.license}
          links={preset.font.links}
          className="md:pe-8"
        />
        <PresetDetail
          title="Theme"
          name={preset.theme.name}
          license={preset.theme.license}
          links={preset.theme.links}
          appearance={preset.theme.appearance}
          className="border-border max-md:border-t md:ps-8"
        />
      </div>
    </Reveal>
  );
}
