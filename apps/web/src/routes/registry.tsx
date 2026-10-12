import {
  useMemo,
  useState,
  useEffectEvent,
  startTransition,
  type ReactNode,
} from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, LayoutGrid, List, Search, X } from "lucide-react";
import { PairCard } from "@/components/registry/PairCard";
import { Button } from "@/components/ui/button";
import {
  EDITOR_LABELS,
  listPairs,
  matchesLicenseFilter,
  type Appearance,
  type EditorId,
  type License,
} from "@/lib/pairs";
import { cn } from "cn";

export const Route = createFileRoute("/registry")({
  component: RegistryPage,
});

type ViewMode = "grid" | "list";
type LicenseFilter = "free" | License;

const EDITOR_OPTIONS = Object.entries(EDITOR_LABELS) as [EditorId, string][];
const APPEARANCE_OPTIONS: { id: Appearance; label: string }[] = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
];
const LICENSE_OPTIONS: { id: LicenseFilter; label: string }[] = [
  { id: "free", label: "Free" },
  { id: "open", label: "Open" },
  { id: "paid", label: "Paid" },
];

function RegistryPage() {
  const pairs = useMemo(() => listPairs(), []);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("grid");
  const [editor, setEditor] = useState<EditorId | "">("");
  const [appearance, setAppearance] = useState<Appearance | "">("");
  const [license, setLicense] = useState<LicenseFilter | "">("");

  const onQueryChange = useEffectEvent((value: string) => {
    startTransition(() => setQuery(value));
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pairs.filter((pair) => {
      if (q) {
        const hay =
          `${pair.font.name} ${pair.theme.name} ${pair.submittedBy?.name ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (editor && !pair.editors.some((e) => e.id === editor)) return false;
      if (appearance && pair.theme.appearance !== appearance) return false;
      if (license && !matchesLicenseFilter(pair, license)) return false;
      return true;
    });
  }, [pairs, query, editor, appearance, license]);

  const hasFilters =
    query.trim().length > 0 ||
    editor !== "" ||
    appearance !== "" ||
    license !== "";

  function clearFilters() {
    setQuery("");
    setEditor("");
    setAppearance("");
    setLicense("");
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl md:text-6xl">
          Registry
        </h1>
        <p className="text-muted-foreground mt-4 max-w-[65ch] text-lg leading-relaxed md:text-xl">
          Font and Theme Pairs with Settings you can copy. Search by name, filter
          by Editor, Appearance, or License.
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <label className="border-border bg-card focus-within:ring-ring/40 flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border px-4 shadow-[var(--shadow-raised)] focus-within:ring-2">
            <Search
              className="text-muted-foreground size-4 shrink-0"
              strokeWidth={2}
              aria-hidden
            />
            <span className="sr-only">Search by Font, Theme, or submitter</span>
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search Font, Theme, or @handle…"
              autoComplete="off"
              className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-muted-foreground hover:text-foreground -me-1 rounded-full p-1"
                aria-label="Clear search"
              >
                <X className="size-3.5" strokeWidth={2} aria-hidden />
              </button>
            ) : null}
          </label>

          <div
            className="border-border bg-card inline-flex h-11 shrink-0 self-start rounded-full border p-1 shadow-[var(--shadow-raised)]"
            role="group"
            aria-label="View mode"
          >
            <ViewButton
              pressed={view === "grid"}
              onClick={() => setView("grid")}
              label="Grid view"
            >
              <LayoutGrid className="size-4" strokeWidth={2} aria-hidden />
            </ViewButton>
            <ViewButton
              pressed={view === "list"}
              onClick={() => setView("list")}
              label="List view"
            >
              <List className="size-4" strokeWidth={2} aria-hidden />
            </ViewButton>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <FilterSelect
            label="Editor"
            value={editor}
            onChange={(v) => setEditor(v as EditorId | "")}
            options={[
              { value: "", label: "All editors" },
              ...EDITOR_OPTIONS.map(([id, label]) => ({ value: id, label })),
            ]}
          />
          <FilterSelect
            label="Appearance"
            value={appearance}
            onChange={(v) => setAppearance(v as Appearance | "")}
            options={[
              { value: "", label: "All appearances" },
              ...APPEARANCE_OPTIONS.map(({ id, label }) => ({
                value: id,
                label,
              })),
            ]}
          />
          <FilterSelect
            label="License"
            value={license}
            onChange={(v) => setLicense(v as LicenseFilter | "")}
            options={[
              { value: "", label: "All licenses" },
              ...LICENSE_OPTIONS.map(({ id, label }) => ({
                value: id,
                label,
              })),
            ]}
          />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          {filtered.length === 1 ? "1 Pair" : `${filtered.length} Pairs`}
          {hasFilters ? " matching" : ""}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-primary text-sm font-medium underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <EmptyState onClear={clearFilters} />
      ) : (
        <ul
          className={cn(
            "mt-4 list-none p-0",
            view === "grid"
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
              : "flex flex-col gap-3",
          )}
        >
          {filtered.map((pair) => (
            <li key={pair.slug} className="min-w-0">
              <PairCard pair={pair} layout={view} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

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
  const active = value !== "";

  return (
    <label className="relative inline-flex min-w-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "border-border h-10 appearance-none rounded-full border py-0 pe-9 ps-3.5 text-sm font-medium shadow-[var(--shadow-raised)] outline-none transition-[background-color,color,border-color] duration-150 ease-out focus-visible:ring-ring/40 focus-visible:ring-2",
          active
            ? "border-transparent bg-accent text-accent-foreground"
            : "bg-card text-secondary-foreground hover:bg-muted",
        )}
      >
        {options.map((opt) => (
          <option key={opt.value || "all"} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className={cn(
          "pointer-events-none absolute end-3 top-1/2 size-3.5 -translate-y-1/2",
          active ? "text-accent-foreground" : "text-muted-foreground",
        )}
        strokeWidth={2}
        aria-hidden
      />
    </label>
  );
}

function ViewButton({
  pressed,
  onClick,
  label,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full transition-[background-color,color] duration-150 ease-out",
        pressed
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="border-border bg-muted/40 mt-6 flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-dashed px-6 py-12">
      <div>
        <p className="font-heading text-lg font-semibold tracking-tight">
          No Pairs match
        </p>
        <p className="text-muted-foreground mt-1 max-w-[45ch] text-sm leading-relaxed">
          Try a different search, or clear filters to see the full Registry.
        </p>
      </div>
      <Button type="button" variant="outline" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}
