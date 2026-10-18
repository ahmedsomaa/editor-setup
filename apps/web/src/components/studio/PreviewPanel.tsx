import type { RefObject } from "react";
import { FileJson, ImageDown, LoaderCircle as Loader2 } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { CodeEditor, type CodeColors } from "./CodeEditor";
import { Rendering } from "./chips";

export type StudioTab = "preview" | "code";

const TABS: readonly (readonly [StudioTab, string])[] = [
  ["preview", "Preview"],
  ["code", "Code"],
];

/** The live Snapshot window: a Preview / Code switch, the export buttons, errors and the frame. */
export function PreviewPanel({
  tab,
  onTabChange,
  srcDoc,
  iframeRef,
  code,
  onCodeChange,
  codeColors,
  errors,
  exporting,
  exportDisabled,
  onSavePng,
  onSaveJson,
}: {
  tab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  srcDoc: string;
  iframeRef: RefObject<HTMLIFrameElement | null>;
  code: string;
  onCodeChange: (code: string) => void;
  /** The Theme's colors for the code box; null until the first highlight is done. */
  codeColors: CodeColors | null;
  errors: string[];
  exporting: boolean;
  exportDisabled: boolean;
  onSavePng: () => void;
  onSaveJson: () => void;
}) {
  return (
    <section
      aria-label="Preview"
      className="bg-muted border-border relative flex min-w-0 flex-col gap-3 rounded-xl border p-3 sm:p-4 xl:sticky xl:top-20"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Editor view"
          className="bg-card border-border inline-flex gap-1 rounded-full border p-1"
          onKeyDown={(e) => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();
            const next = tab === "preview" ? "code" : "preview";
            onTabChange(next);
            document.getElementById(`studio-tab-${next}`)?.focus();
          }}
        >
          {TABS.map(([id, text]) => (
            <button
              key={id}
              id={`studio-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={tab === id}
              aria-controls="studio-panel"
              tabIndex={tab === id ? 0 : -1}
              onClick={() => onTabChange(id)}
              className={cn(
                "h-8 rounded-full px-4 text-sm font-medium transition-colors duration-150",
                tab === id
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {text}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Export" className="inline-flex">
          <Button
            size="sm"
            variant="outline"
            disabled={exportDisabled}
            onClick={onSaveJson}
            className="focus-visible:z-10 rounded-e-none"
          >
            <FileJson />
            Export Preset
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={exportDisabled}
            onClick={onSavePng}
            className="focus-visible:z-10 -ms-px rounded-s-none"
          >
            {exporting ? (
              <Loader2 className="animate-spin motion-reduce:animate-none" />
            ) : (
              <ImageDown />
            )}
            Export Snapshot
          </Button>
        </div>
      </div>

      {errors.map((msg) => (
        <p
          key={msg}
          role="alert"
          className="bg-pastel-red text-pastel-red-text rounded-xl px-4 py-3 text-sm"
        >
          {msg}
        </p>
      ))}

      <div
        id="studio-panel"
        role="tabpanel"
        aria-labelledby={`studio-tab-${tab}`}
        className="border-border relative aspect-video w-full overflow-hidden rounded-xl border shadow-[var(--shadow-overlay)]"
      >
        {srcDoc ? (
          // Kept on screen, only hidden, so the window is measured and ready to export while you write.
          <iframe
            ref={iframeRef}
            title="Snapshot preview"
            srcDoc={srcDoc}
            sandbox="allow-scripts allow-same-origin"
            className={cn(
              "absolute inset-0 size-full border-0",
              tab === "code" && "invisible",
            )}
          />
        ) : (
          <Rendering label="Snapshot" className="size-full" />
        )}
        {tab === "code" ? (
          <CodeEditor code={code} onChange={onCodeChange} colors={codeColors} />
        ) : null}
      </div>
    </section>
  );
}
