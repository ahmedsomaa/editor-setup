import { Link2 } from "lucide-react";
import { Combobox } from "@/components/common/Combobox";
import type { EditorId } from "@/lib/presets/presets";
import { Field } from "./Field";
import { IconChip } from "./chips";
import { CUSTOM_OPTION, THEME_OPTIONS } from "./options";
import type { SetParam } from "./types";

const inputClass =
  "bg-muted border-border text-foreground placeholder:text-muted-foreground h-10 w-full rounded-full border px-4 text-[13px] disabled:opacity-50";

/** Pick a listed Theme, or paste a link to a theme file under "Custom" (always a link for Zed). */
export function ThemeField({
  editor,
  themeId,
  themeUrl,
  themeName,
  custom,
  onCustomChange,
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
  custom: boolean;
  onCustomChange: (custom: boolean) => void;
  urlDraft: string;
  onUrlDraftChange: (url: string) => void;
  variants: string[];
  variant: string | undefined;
  setParam: SetParam;
}) {
  // The list holds VS Code themes, so a Zed theme always comes from a link.
  const linkOnly = editor === "zed";
  const showLink = linkOnly || custom;

  return (
    <Field legend="Theme">
      {linkOnly ? null : (
        <div className="flex flex-col gap-1.5">
          <Combobox
            label="Theme"
            value={custom ? CUSTOM_OPTION : themeId}
            options={THEME_OPTIONS}
            display={custom && themeUrl ? `Custom (${themeName})` : undefined}
            onChange={(id) => {
              if (id === CUSTOM_OPTION) {
                onCustomChange(true);
                return;
              }
              onCustomChange(false);
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
