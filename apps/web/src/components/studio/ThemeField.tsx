import { Link2 } from "lucide-react";
import { Combobox } from "@/components/common/Combobox";
import type { EditorId } from "@/lib/registry/pairs";
import { Field } from "./Field";
import { IconChip } from "./chips";
import { OTHER, THEME_OPTIONS } from "./options";
import type { SetParam } from "./types";

const inputClass =
  "bg-muted border-border text-foreground placeholder:text-muted-foreground h-10 w-full rounded-full border px-4 text-[13px] disabled:opacity-50";

/** Pick a preset Theme, or paste a link to a theme file under "Other" (always a link for Zed). */
export function ThemeField({
  editor,
  themeId,
  themeUrl,
  themeName,
  other,
  onOtherChange,
  urlDraft,
  onUrlDraftChange,
  variants,
  variant,
  setParam,
}: {
  editor: EditorId;
  themeId: string;
  themeUrl: string;
  /** Name read from the theme file, shown once a link is loaded. */
  themeName: string;
  other: boolean;
  onOtherChange: (other: boolean) => void;
  urlDraft: string;
  onUrlDraftChange: (url: string) => void;
  variants: string[];
  variant: string | undefined;
  setParam: SetParam;
}) {
  // Presets are VS Code themes, so a Zed theme always comes from a link.
  const linkOnly = editor === "zed";
  const showLink = linkOnly || other;

  return (
    <Field legend={linkOnly ? "Theme" : "Theme preset"}>
      {linkOnly ? null : (
        <div className="flex flex-col gap-1.5">
          <Combobox
            label="Theme"
            value={other ? OTHER : themeId}
            options={THEME_OPTIONS}
            display={other && themeUrl ? `Other (${themeName})` : undefined}
            onChange={(id) => {
              if (id === OTHER) {
                onOtherChange(true);
                return;
              }
              onOtherChange(false);
              onUrlDraftChange("");
              setParam({
                theme: id,
                themeUrl: undefined,
                themeVariant: undefined,
              });
            }}
          />
        </div>
      )}
      {showLink ? (
        <>
          <label className="flex flex-col gap-1.5">
            <span className="flex items-center gap-2 text-[13px] font-medium">
              <IconChip>
                <Link2 className="size-4" aria-hidden />
              </IconChip>{" "}
              Theme link
            </span>
            <input
              className={inputClass}
              name="themeUrl"
              value={urlDraft}
              onChange={(e) => onUrlDraftChange(e.target.value)}
              onBlur={() =>
                urlDraft.trim() !== themeUrl &&
                setParam({
                  themeUrl: urlDraft.trim() || undefined,
                  themeVariant: undefined,
                })
              }
              placeholder="https://github.com/…/my-theme.json"
              autoComplete="off"
              spellCheck={false}
            />
            <span className="text-muted-foreground text-[11px]">
              {linkOnly
                ? "Raw or GitHub/GitLab link to a Zed theme JSON."
                : "Raw or GitHub/GitLab link to a VS Code theme JSON."}
            </span>
          </label>
          {variants.length > 1 ? (
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-medium">
                Theme in this file
              </span>
              <Combobox
                label="Zed theme"
                value={variant ?? ""}
                options={variants.map((v) => ({ id: v, label: v }))}
                onChange={(id) => setParam({ themeVariant: id })}
              />
            </div>
          ) : null}
        </>
      ) : null}
    </Field>
  );
}
