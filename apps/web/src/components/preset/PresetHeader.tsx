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

/** "by Ahmed, with Sara and Omar": the author first, then anyone who added an Editor. */
function Credits({ preset }: { preset: PresetRecord }) {
  const others = preset.contributors;
  return (
    <span className="text-muted-foreground font-sans text-base">
      by <Person person={preset.author} />
      {others.length > 0 ? (
        <>
          , with{" "}
          {new Intl.ListFormat("en", { type: "conjunction" })
            .formatToParts(others.map((_, i) => String(i)))
            .map((part, i) =>
              part.type === "element" ? (
                <Person key={i} person={others[Number(part.value)]!} />
              ) : (
                <span key={i}>{part.value}</span>
              ),
            )}
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
