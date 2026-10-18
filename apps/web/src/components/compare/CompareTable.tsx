import { Link } from "@tanstack/react-router";
import { Plus, X } from "lucide-react";
import { SnapshotImage } from "@/components/common/SnapshotImage";
import { AppearanceTag, PresetLicenseTag } from "@/components/common/Tag";
import { Button } from "@/components/ui/button";
import {
  EDITOR_LABELS,
  presetLabel,
  type PresetRecord,
} from "@/lib/presets/presets";
import { snapshotUrl } from "@/lib/presets/snapshots";

/** Presets as columns and their facts as rows, with an open slot while there is room for another. */
export function CompareTable({
  presets,
  slots,
  onAdd,
  onRemove,
}: {
  presets: PresetRecord[];
  /** Most Presets the table holds. An open slot shows where the next one lands. */
  slots: number;
  onAdd: () => void;
  onRemove: (slug: string) => void;
}) {
  const open = presets.length < slots;
  const rows: { label: string; cell: (p: PresetRecord) => React.ReactNode }[] = [
    { label: "Theme", cell: (p) => p.theme.name },
    { label: "Font", cell: (p) => p.font.name },
    {
      label: "Appearance",
      cell: (p) => <AppearanceTag appearance={p.theme.appearance} />,
    },
    {
      label: "License",
      cell: (p) => (
        <PresetLicenseTag font={p.font.license} theme={p.theme.license} />
      ),
    },
    {
      label: "Editors",
      cell: (p) => p.editors.map((e) => EDITOR_LABELS[e.id]).join(", "),
    },
    {
      label: "Author",
      cell: (p) => p.author.name,
    },
  ];

  return (
    <div
      role="region"
      aria-label="Presets side by side"
      tabIndex={0}
      className="mt-2 overflow-x-auto"
    >
      <table
        className="w-full table-fixed border-collapse text-start text-sm"
        style={{ minWidth: `${7 + (presets.length + (open ? 1 : 0)) * 16}rem` }}
      >
        <caption className="sr-only">Presets side by side</caption>
        <colgroup>
          <col className="w-28" />
          {presets.map((p) => (
            <col key={p.slug} />
          ))}
          {open ? <col /> : null}
        </colgroup>
        <tbody>
          <tr>
            <th
              scope="row"
              className="text-muted-foreground pe-4 text-start align-top font-normal"
            >
              <span className="block pt-1">Snapshot</span>
            </th>
            {presets.map((preset) => {
              const src = snapshotUrl(preset.snapshot);
              return (
                <td key={preset.slug} className="ps-3 pb-4 align-top first:ps-0">
                  {src ? (
                    <SnapshotImage
                      src={src}
                      alt={`${preset.theme.name} with ${preset.font.name}`}
                      className="rounded-xl"
                    />
                  ) : (
                    <div
                      className="border-border text-muted-foreground flex items-center justify-center rounded-xl border border-dashed text-sm"
                      style={{ aspectRatio: "16 / 9" }}
                    >
                      No Snapshot to show
                    </div>
                  )}
                </td>
              );
            })}
            {open ? (
              <td className="ps-3 pb-4 align-top">
                <button
                  type="button"
                  onClick={onAdd}
                  className="border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted/50 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-sm transition-colors duration-150"
                  style={{ aspectRatio: "16 / 9" }}
                >
                  <Plus aria-hidden className="size-6" />
                  Add a Preset
                </button>
              </td>
            ) : null}
          </tr>
          <tr className="border-border border-t">
            <th
              scope="row"
              className="text-muted-foreground py-3 pe-4 text-start align-middle font-normal"
            >
              Preset
            </th>
            {presets.map((preset) => (
              <td key={preset.slug} className="py-3 ps-3 align-middle first:ps-0">
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to="/presets/$slug"
                    params={{ slug: preset.slug }}
                    className="text-foreground min-w-0 truncate font-medium no-underline hover:underline"
                  >
                    {presetLabel(preset)}
                  </Link>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    aria-label={`Remove ${presetLabel(preset)} from the comparison`}
                    onClick={() => onRemove(preset.slug)}
                  >
                    <X aria-hidden />
                  </Button>
                </div>
              </td>
            ))}
          </tr>
          {rows.map((row) => (
            <tr key={row.label} className="border-border border-t">
              <th
                scope="row"
                className="text-muted-foreground py-3 pe-4 text-start font-normal"
              >
                {row.label}
              </th>
              {presets.map((p) => (
                <td key={p.slug} className="py-3 ps-3 align-middle first:ps-0">
                  {row.cell(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
