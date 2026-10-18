import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Combobox } from "@/components/common/Combobox";
import { Button } from "@/components/ui/button";
import {
  FONT_CHOICES,
  MAX_FONT_FILES,
  familyFromFile,
  readFace,
} from "@/lib/studio/font-files";
import { Field } from "./Field";
import { IconChip } from "./chips";
import { FONT_OPTIONS, OTHER } from "./options";
import type { CustomFont } from "./types";

/** Pick a listed Font, or upload your own font files under "Other". */
export function FontField({
  fontName,
  fontDraft,
  custom,
  onCustomChange,
  onPick,
}: {
  fontName: string;
  fontDraft: string;
  custom: CustomFont | null;
  onCustomChange: (custom: CustomFont | null) => void;
  onPick: (font: string) => void;
}) {
  const [other, setOther] = useState(() => !FONT_CHOICES.includes(fontName));
  const [fileError, setFileError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFiles(list: FileList | null) {
    const files = Array.from(list ?? []).slice(0, MAX_FONT_FILES);
    if (files.length === 0) return;
    try {
      const faces = await Promise.all(files.map(readFace));
      // A name typed into "Family name" names the uploaded font.
      const typed = fontDraft.trim();
      onCustomChange({
        name:
          typed && !FONT_CHOICES.includes(typed)
            ? typed
            : familyFromFile(files[0]!.name),
        faces,
        files: files.map((f) => f.name),
      });
      setFileError("");
    } catch (e) {
      setFileError(
        e instanceof Error ? e.message : "Could not read that font file.",
      );
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeCustom() {
    onCustomChange(null);
    setFileError("");
  }

  return (
    <Field legend="Font family">
      <div className="flex flex-col gap-1.5">
        <Combobox
          label="Font"
          value={other ? OTHER : fontName}
          options={FONT_OPTIONS}
          display={
            other
              ? custom
                ? `Other (${custom.name.trim() || "your font"})`
                : "Other"
              : undefined
          }
          onChange={(id) => {
            if (id === OTHER) {
              setOther(true);
              return;
            }
            setOther(false);
            removeCustom();
            onPick(id);
          }}
        />
      </div>
      {other ? (
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-2 text-sm font-medium">
            <IconChip>
              <Upload className="size-4" aria-hidden />
            </IconChip>{" "}
            Your own font
          </span>
          <input
            ref={fileRef}
            type="file"
            accept=".woff2,.woff,.ttf,.otf"
            multiple
            className="hidden"
            tabIndex={-1}
            aria-hidden
            onChange={(e) => void onFiles(e.target.files)}
          />
          {custom ? (
            <div className="bg-muted border-border flex items-center justify-between gap-3 rounded-full border py-1.5 ps-4 pe-1.5 text-sm">
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <input
                  aria-label="Name shown on the Snapshot"
                  value={custom.name}
                  onChange={(e) =>
                    onCustomChange({ ...custom, name: e.target.value })
                  }
                  className="min-w-0 flex-1 bg-transparent font-medium outline-none"
                />
                <span className="text-muted-foreground shrink-0">
                  {custom.files.length}{" "}
                  {custom.files.length === 1 ? "file" : "files"}
                </span>
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={removeCustom}
              >
                <X aria-hidden />
                Remove
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
            >
              <Upload aria-hidden />
              Choose font files
            </Button>
          )}
          {fileError ? (
            <span role="alert" className="text-pastel-red-text text-xs">
              {fileError}
            </span>
          ) : (
            <span className="text-muted-foreground text-[11px]">
              .woff2, .woff, .ttf or .otf, up to 4 files of 3 MB. Add regular,
              bold and italic together for a full family. We don't keep your
              files: they stay in your browser.
            </span>
          )}
        </div>
      ) : null}
    </Field>
  );
}
