import { Reveal } from "@/components/layout/Reveal";
import { CopySettings } from "@/components/preset/CopySettings";
import { EditorSwitch } from "@/components/preset/EditorSwitch";
import {
  EDITOR_LABELS,
  type Author,
  type EditorConfig,
  type EditorId,
  type PresetRecord,
} from "@/lib/presets/presets";

/** Who wrote the Settings for an Editor: the contributor who added it, otherwise the author. */
function settingsAuthor(preset: PresetRecord, editor: EditorId): Author {
  return preset.contributors.find((c) => c.editors.includes(editor)) ?? preset.author;
}

function PersonName({ person }: { person: Author }) {
  return person.url ? (
    <a
      href={person.url}
      target="_blank"
      rel="noreferrer"
      className="text-foreground underline underline-offset-4 hover:no-underline"
    >
      {person.name}
    </a>
  ) : (
    <span className="text-foreground">{person.name}</span>
  );
}

/** The Settings text for one Editor, with a switch between Editors and a copy button. */
export function PresetSettings({
  preset,
  config,
  onSelectEditor,
}: {
  preset: PresetRecord;
  config: EditorConfig;
  onSelectEditor: (id: EditorId) => void;
}) {
  return (
    <Reveal
      as="section"
      id="settings"
      aria-labelledby="settings-heading"
      className="mt-16 scroll-mt-32"
    >
      <h2 id="settings-heading">Settings</h2>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <EditorSwitch
          editors={preset.editors}
          selectedId={config.id}
          onSelect={onSelectEditor}
        />
        <CopySettings settings={config.settings} variant="outline" />
      </div>
      <pre className="border-border bg-muted mt-4 max-h-[28rem] overflow-auto rounded-lg border p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
        {config.settings}
      </pre>
      <p className="text-muted-foreground mt-2 text-xs">
        {EDITOR_LABELS[config.id]} Settings by{" "}
        <PersonName person={settingsAuthor(preset, config.id)} />. Plain text, paste it into your editor.
      </p>
    </Reveal>
  );
}
