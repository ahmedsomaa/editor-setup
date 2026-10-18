import { Check } from "lucide-react";
import { cn } from "cn";
import { EDITOR_LABELS, type EditorId, type PresetRecord } from "@/lib/presets/presets";

export function EditorSwitch({
  editors,
  selectedId,
  onSelect,
}: {
  editors: PresetRecord["editors"];
  selectedId: EditorId;
  onSelect: (id: EditorId) => void;
}) {
  return (
    <div role="group" aria-label="Editor" className="flex flex-wrap gap-2">
      {editors.map((editor) => {
        const selected = editor.id === selectedId;
        return (
          <button
            key={editor.id}
            type="button"
            onClick={() => onSelect(editor.id)}
            aria-pressed={selected}
            className={cn(
              "h-9 rounded-full border px-4 text-sm font-medium transition-colors",
              selected
                ? "border-foreground bg-card text-foreground"
                : "border-border bg-card text-secondary-foreground hover:bg-muted",
            )}
          >
            {selected ? (
              <Check className="me-1.5 inline size-3.5" aria-hidden />
            ) : null}
            {EDITOR_LABELS[editor.id]}
          </button>
        );
      })}
    </div>
  );
}
