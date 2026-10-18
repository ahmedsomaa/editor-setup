import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EDITOR_LABELS,
  type Appearance,
  type EditorId,
} from "@/lib/presets/presets";

const EDITOR_OPTIONS = Object.entries(EDITOR_LABELS) as [EditorId, string][];
const APPEARANCE_OPTIONS: { id: Appearance; label: string }[] = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
];

type Filters = {
  editor?: EditorId;
  appearance?: Appearance;
};

/** The search box and the Editor and Appearance filters above the Presets list. */
export function PresetsFilters({
  query,
  onQueryChange,
  filters,
  onFilterChange,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  filters: Filters;
  onFilterChange: (patch: Filters) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" jumps to search, unless you are already typing somewhere.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable)
      )
        return;
      e.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <form
      role="search"
      className="flex flex-col gap-3 md:flex-row"
      onSubmit={(e) => e.preventDefault()}
    >
      <label className="border-border bg-card focus-within:outline-ring flex h-11 min-w-0 shrink-0 items-center gap-2 rounded-full border px-4 md:flex-1 focus-within:outline-2 focus-within:outline-offset-2">
        <Search className="text-muted-foreground size-4 shrink-0" aria-hidden />
        <span className="sr-only">Search by Font, Theme or submitter</span>
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by Font or Theme"
          autoComplete="off"
          spellCheck={false}
          className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        {query ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            className="text-muted-foreground hover:text-foreground -me-1 inline-flex size-8 items-center justify-center rounded-full"
            aria-label="Clear search"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : (
          <kbd className="kbd hidden sm:inline" aria-hidden>
            /
          </kbd>
        )}
      </label>
      <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap">
        <FilterSelect
          label="Editor"
          value={filters.editor ?? ""}
          onChange={(v) =>
            onFilterChange({ editor: (v || undefined) as EditorId | undefined })
          }
          options={[
            { value: "", label: "All Editors" },
            ...EDITOR_OPTIONS.map(([id, label]) => ({ value: id, label })),
          ]}
        />
        <FilterSelect
          label="Appearance"
          value={filters.appearance ?? ""}
          onChange={(v) =>
            onFilterChange({
              appearance: (v || undefined) as Appearance | undefined,
            })
          }
          options={[
            { value: "", label: "Dark and light" },
            ...APPEARANCE_OPTIONS.map(({ id, label }) => ({
              value: id,
              label,
            })),
          ]}
        />
      </div>
    </form>
  );
}

const ALL = "all";

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  // An empty value means "no filter"; the Select needs a real value for that option.
  const items = options.map((o) => ({ value: o.value || ALL, label: o.label }));
  return (
    <Select
      items={items}
      value={value || ALL}
      onValueChange={(v) => onChange(v === ALL || !v ? "" : v)}
    >
      <SelectTrigger
        aria-label={label}
        className="h-11 w-full font-medium md:w-auto md:min-w-40"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
