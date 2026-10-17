import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { PairGrid } from "@/components/PairGrid";
import { RegistryPattern } from "@/components/RegistryPattern";
import { Button } from "@/components/ui/button";
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
  type License,
} from "@/lib/pairs";
import { registrySearchSchema } from "@/lib/registry-search";
import { listPairsFn } from "@/server/pairs.functions";

export const Route = createFileRoute("/registry/")({
  validateSearch: registrySearchSchema,
  loaderDeps: ({ search: { q, editor, appearance, license } }) => ({
    q,
    editor,
    appearance,
    license,
  }),
  loader: ({ deps }) => listPairsFn({ data: deps }),
  // Crawlable listing whose state lives in the URL: render fully on the server.
  ssr: true,
  head: () => ({
    meta: [
      { title: "Registry · EditorSetup" },
      {
        name: "description",
        content:
          "Font and Theme Pairs with Settings you can copy for VS Code and Cursor.",
      },
    ],
  }),
  component: RegistryPage,
});

const EDITOR_OPTIONS = Object.entries(EDITOR_LABELS) as [EditorId, string][];
const APPEARANCE_OPTIONS: { id: Appearance; label: string }[] = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
];
const LICENSE_OPTIONS: { id: License; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "free", label: "Free" },
];
const SEARCH_DEBOUNCE_MS = 200;

function RegistryPage() {
  const search = Route.useSearch();
  const { pairs: filtered, total } = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });
  const editor = search.editor ?? "";
  const appearance = search.appearance ?? "";
  const license = search.license ?? "";

  const [query, setQuery] = useState(search.q ?? "");
  const pushedQ = useRef(search.q);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (search.q === pushedQ.current) return;
    pushedQ.current = search.q;
    setQuery(search.q ?? "");
  }, [search.q]);

  useEffect(() => {
    const next = query.trim() || undefined;
    if (next === pushedQ.current) return;
    const id = window.setTimeout(() => {
      pushedQ.current = next;
      void navigate({
        search: (prev) => ({ ...prev, q: next }),
        replace: true,
      });
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [query, navigate]);

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

  function setParam(patch: Partial<typeof search>) {
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
  }

  const hasFilters =
    query.trim().length > 0 ||
    editor !== "" ||
    appearance !== "" ||
    license !== "";

  function clearFilters() {
    pushedQ.current = undefined;
    setQuery("");
    setParam({
      q: undefined,
      editor: undefined,
      appearance: undefined,
      license: undefined,
    });
  }

  return (
    <main id="main">
      <div className="relative isolate overflow-hidden">
        <RegistryPattern className="bg-glyphs" />
        <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-16 sm:pt-24 sm:pb-20">
          <h1>Registry</h1>
          <p className="text-muted-foreground mt-6 max-w-[60ch] text-lg">
            The full list. Open a Pair to copy its Settings.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        <form
          role="search"
          className="flex flex-col gap-3 md:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="border-border bg-card focus-within:outline-ring flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border px-4 focus-within:outline-2 focus-within:outline-offset-2">
            <MagnifyingGlass
              className="text-muted-foreground size-4 shrink-0"
              aria-hidden
            />
            <span className="sr-only">Search by Font, Theme or submitter</span>
            <input
              ref={inputRef}
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Fira Code"
              autoComplete="off"
              spellCheck={false}
              className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
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
          <div className="flex flex-wrap gap-3">
            <FilterSelect
              label="Editor"
              value={editor}
              onChange={(v) =>
                setParam({ editor: (v || undefined) as EditorId | undefined })
              }
              options={[
                { value: "", label: "All Editors" },
                ...EDITOR_OPTIONS.map(([id, label]) => ({ value: id, label })),
              ]}
            />
            <FilterSelect
              label="Appearance"
              value={appearance}
              onChange={(v) =>
                setParam({
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
            <FilterSelect
              label="License"
              value={license}
              onChange={(v) =>
                setParam({
                  license: (v || undefined) as License | undefined,
                })
              }
              options={[
                { value: "", label: "Any License" },
                ...LICENSE_OPTIONS.map(({ id, label }) => ({
                  value: id,
                  label,
                })),
              ]}
            />
          </div>
        </form>

        <div className="mt-8 mb-4 flex min-h-9 flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm" role="status">
            {hasFilters
              ? `${filtered.length} of ${total} Pairs`
              : `${total} ${total === 1 ? "Pair" : "Pairs"}`}
          </p>
          {hasFilters ? (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : null}
        </div>

        {filtered.length === 0 ? (
          <div className="border-border rounded-xl border border-dashed px-6 py-16">
            <p className="font-medium">
              No Pairs match{search.q ? ` “${search.q}”` : ""}
            </p>
            <p className="text-muted-foreground mt-1 max-w-[50ch] text-sm">
              Try another name, or clear the filters to see the whole Registry.
            </p>
            <Button className="mt-6" variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <PairGrid pairs={filtered} />
        )}
      </div>
    </main>
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
        className="h-11 w-auto min-w-40 font-medium"
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
