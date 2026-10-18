import { ShareButton } from "@/components/common/ShareButton";
import { PageHero } from "@/components/layout/PagePattern";
import { presetLabel, type Author, type PresetRecord } from "@/lib/presets/presets";

const NAME = "text-foreground font-medium";

function Person({ person }: { person: Author }) {
  return person.url ? (
    <a
      href={person.url}
      target="_blank"
      rel="noreferrer"
      className={`${NAME} underline-offset-4 hover:underline`}
    >
      {person.name}
    </a>
  ) : (
    <span className={NAME}>{person.name}</span>
  );
}

const CONTRIBUTORS = new Intl.PluralRules("en");

/** "by Ahmed and 2 contributors": the author, then a link to the Settings, where each Editor names who wrote it. */
function Credits({ preset }: { preset: PresetRecord }) {
  const count = preset.contributors.length;
  return (
    <span className="text-muted-foreground font-sans text-base">
      by <Person person={preset.author} />
      {count > 0 ? (
        <>
          {" "}
          and{" "}
          <a href="#settings" className="text-foreground underline underline-offset-4 hover:no-underline">
            {count} {CONTRIBUTORS.select(count) === "one" ? "contributor" : "contributors"}
          </a>
        </>
      ) : null}
    </span>
  );
}

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
          <Credits preset={preset} />
          <ShareButton title={presetLabel(preset)} className="sm:ms-auto" />
        </div>
      </header>
    </PageHero>
  );
}
