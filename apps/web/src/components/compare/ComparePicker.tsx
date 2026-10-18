import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import { Pagination } from "@/components/presets/Pagination";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { filterPresets, presetLabel, type PresetRecord } from "@/lib/presets/presets";
import { cn } from "cn";

const PAGE_SIZE = 6;

/** Pick the Presets to compare in a drawer: search and tick up to `max`. Each tick updates the page behind it. The page owns `open`, so any button can open it. */
export function ComparePicker({
  presets,
  values,
  max,
  onChange,
  open,
  onOpenChange,
}: {
  presets: PresetRecord[];
  values: string[];
  max: number;
  onChange: (slugs: string[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const matches = useMemo(() => filterPresets(presets, { q }), [presets, q]);
  const pageCount = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const shown = matches.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const full = values.length >= max;

  const toggle = (slug: string) =>
    onChange(
      values.includes(slug)
        ? values.filter((s) => s !== slug)
        : [...values, slug],
    );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Presets</DrawerTitle>
          <DrawerDescription>
            Pick up to {max} Presets to line up side by side.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-6 pb-3">
          <div className="bg-muted border-border flex h-10 items-center gap-2 rounded-full border px-4">
            <Search
              aria-hidden
              className="text-muted-foreground size-4 shrink-0"
            />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              aria-label="Search Presets"
              placeholder="Search Font or Theme"
              autoComplete="off"
              spellCheck={false}
              className="placeholder:text-muted-foreground h-full w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <ul
          aria-label="Presets"
          data-lenis-prevent
          className="m-0 min-h-0 flex-1 list-none overflow-y-auto overscroll-contain px-3 pb-3"
        >
          {shown.length === 0 ? (
            <li className="text-muted-foreground px-3 py-10 text-center text-sm">
              No Presets match. Clear a filter to see more.
            </li>
          ) : null}
          {shown.map((p) => {
            const on = values.includes(p.slug);
            const locked = full && !on;
            return (
              <li key={p.slug}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  aria-disabled={locked || undefined}
                  onClick={() => !locked && toggle(p.slug)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors duration-150",
                    on ? "bg-accent-soft" : "hover:bg-muted",
                    locked &&
                      "cursor-not-allowed opacity-50 hover:bg-transparent",
                  )}
                >
                  <span
                    aria-hidden
                    className="border-border flex size-10 shrink-0 items-center justify-center rounded-lg border text-sm leading-none"
                    style={{
                      background: p.theme.bg,
                      color: p.theme.fg,
                      fontFamily: p.font.fontFamily,
                    }}
                  >
                    Aa
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {presetLabel(p)}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "border-border flex size-5 shrink-0 items-center justify-center rounded-md border",
                      on && "bg-accent border-accent text-accent-foreground",
                    )}
                  >
                    {on ? <Check className="size-3.5" /> : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <Pagination
          compact
          page={current}
          pageCount={pageCount}
          onChange={setPage}
          className="pb-3"
        />

        <DrawerFooter>
          <span role="status" className="text-muted-foreground text-sm">
            {values.length} of {max} selected
          </span>
          <span className="flex items-center gap-2">
            {values.length ? (
              <Button variant="ghost" onClick={() => onChange([])}>
                Clear
              </Button>
            ) : null}
            <DrawerClose render={<Button />}>Done</DrawerClose>
          </span>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
