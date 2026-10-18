import { ShareButton } from "@/components/common/ShareButton";
import { PageHero } from "@/components/layout/PagePattern";
import { presetLabel, type PresetRecord } from "@/lib/presets/presets";

/** The Preset's title, its author, and a share button. */
export function PresetHeader({ preset }: { preset: PresetRecord }) {
  return (
    <PageHero variant="preset" className="pt-12 pb-6 sm:pt-16 sm:pb-8">
      <header>
        <h1>
          {preset.theme.name}
          <span className="sr-only"> with </span>
          <span aria-hidden className="text-muted-foreground mx-[0.35em]">
            ·
          </span>
          {preset.font.name}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-muted-foreground font-sans text-base">
            by{" "}
            {preset.author.url ? (
              <a
                href={preset.author.url}
                target="_blank"
                rel="noreferrer"
                className="text-foreground font-medium underline-offset-4 hover:underline"
              >
                {preset.author.name}
              </a>
            ) : (
              <span className="text-foreground font-medium">{preset.author.name}</span>
            )}
          </span>
          <ShareButton title={presetLabel(preset)} className="sm:ms-auto" />
        </div>
      </header>
    </PageHero>
  );
}
