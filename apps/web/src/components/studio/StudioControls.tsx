import { cn } from "cn";
import { Combobox } from "@/components/common/Combobox";
import type { EditorId } from "@/lib/registry/pairs";
import { Field } from "./Field";
import { FontField } from "./FontField";
import { ThemeField } from "./ThemeField";
import { EDITOR_OPTIONS, LANG_OPTIONS } from "./options";
import type { useSnapshotStudio } from "./useSnapshotStudio";

/** Every setting for a Snapshot: Editor, Font, Theme and code language. */
export function StudioControls({
  studio,
}: {
  studio: ReturnType<typeof useSnapshotStudio>;
}) {
  const {
    editor,
    fontName,
    fontDraft,
    setFontDraft,
    custom,
    setCustom,
    themeId,
    themeUrl,
    themeName,
    themeOther,
    setThemeOther,
    urlDraft,
    setUrlDraft,
    variants,
    variant,
    lang,
    commitLang,
    setParam,
  } = studio;

  return (
    <form
      className={cn(
        "bg-card border-border rounded-xl border",
        // z-10 keeps the open lists above the page content that follows, such as the footer.
        "relative z-10 flex min-w-0 flex-col gap-0 p-0 xl:sticky xl:top-20",
      )}
      onSubmit={(e) => {
        e.preventDefault();
        setParam({
          font: fontDraft.trim() || undefined,
          themeUrl: urlDraft.trim() || undefined,
        });
      }}
    >
      <div className="grid items-start gap-x-4 gap-y-4 p-4 sm:grid-cols-2 xl:grid-cols-1">
        <Field legend="Editor">
          <Combobox
            label="Editor"
            value={editor}
            options={EDITOR_OPTIONS}
            onChange={(id) => {
              if (id === editor) return;
              setThemeOther(false);
              setUrlDraft("");
              setParam({
                editor: id as EditorId,
                themeUrl: undefined,
                themeVariant: undefined,
              });
            }}
          />
        </Field>
        <FontField
          fontName={fontName}
          fontDraft={fontDraft}
          custom={custom}
          onCustomChange={setCustom}
          onPick={(font) => {
            setFontDraft(font);
            setParam({ font });
          }}
        />
        <ThemeField
          editor={editor}
          themeId={themeId}
          themeUrl={themeUrl}
          themeName={themeName}
          other={themeOther}
          onOtherChange={setThemeOther}
          urlDraft={urlDraft}
          onUrlDraftChange={setUrlDraft}
          variants={variants}
          variant={variant}
          setParam={setParam}
        />
        <Field legend="Code language">
          <div className="flex flex-col gap-1.5">
            <Combobox
              label="Language"
              value={lang}
              options={LANG_OPTIONS}
              onChange={commitLang}
            />
          </div>
        </Field>
      </div>
      <p className="text-muted-foreground border-border m-0 border-t px-4 py-3 text-xs">
        Use an Open or Free Font and Theme. Snapshots go in a public list,
        so a license that asks for payment, or does not allow public images,
        can&rsquo;t be used.
      </p>
      <button type="submit" className="sr-only">
        Apply
      </button>
    </form>
  );
}
