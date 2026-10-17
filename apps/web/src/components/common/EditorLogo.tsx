import type { EditorId } from "@/lib/registry/pairs";
import { EDITOR_LOGO_PATHS } from "@/lib/editor-logos";

/** One-color mark for an Editor. It follows the surrounding text color. */
export function EditorLogo({ id, className }: { id: EditorId; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className ?? "size-4"}>
      <path d={EDITOR_LOGO_PATHS[id]} />
    </svg>
  );
}
