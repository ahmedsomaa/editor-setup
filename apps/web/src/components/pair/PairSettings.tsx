import { Reveal } from "@/components/layout/Reveal";
import { CopySettings } from "@/components/pair/CopySettings";
import { EditorSwitch } from "@/components/pair/EditorSwitch";
import {
  EDITOR_LABELS,
  type EditorConfig,
  type EditorId,
  type PairRecord,
} from "@/lib/registry/pairs";

/** The Settings text for one Editor, with a switch between Editors and a copy button. */
export function PairSettings({
  pair,
  config,
  onSelectEditor,
}: {
  pair: PairRecord;
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
          editors={pair.editors}
          selectedId={config.id}
          onSelect={onSelectEditor}
        />
        <CopySettings settings={config.settings} variant="outline" />
      </div>
      <pre className="border-border bg-muted mt-4 max-h-[28rem] overflow-auto rounded-lg border p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap sm:text-sm">
        {config.settings}
      </pre>
      <p className="text-muted-foreground mt-2 text-xs">
        Plain text for {EDITOR_LABELS[config.id]}. Paste it into your Editor.
      </p>
    </Reveal>
  );
}
