import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { PairGrid } from "@/components/PairGrid";
import { Pagination } from "@/components/Pagination";
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
import { pageHead } from "@/lib/page-head";

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
  head: () =>
    pageHead({
      path: "/registry",
      title: "Registry: Font and Theme Pairs for VS Code and Zed",
      description:
        "Browse Font and Theme Pairs from real editor setups. Filter by Appearance, License or Editor, open a Pair to see its Snapshot and copy its Settings.",
    }),
  component: RegistryPage,
});

type LicenseFilter = License;

const EDITOR_OPTIONS = Object.entries(EDITOR_LABELS) as [EditorId, string][];
const APPEARANCE_OPTIONS: { id: Appearance; label: string }[] = [
  { id: "dark", label: "Dark" },
  { id: "light", label: "Light" },
];
const LICENSE_OPTIONS: { id: LicenseFilter; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "free", label: "Free" },
];
const SEARCH_DEBOUNCE_MS = 200;
const PAGE_SIZE = 6;

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
        search: (prev) => ({ ...prev, q: next, page: undefined }),
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

  // Any change to the filters goes back to page 1.
  function setParam(patch: Partial<typeof search>) {
    void navigate({
      search: (prev) => ({ ...prev, page: undefined, ...patch }),
      replace: true,
    });
  }

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(search.page ?? 1, pageCount);
  const visible = filtered.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE,
  );

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
            Every font and theme, already paired up.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        <form
          role="search"
          className="flex flex-col gap-3 md:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="border-border bg-card focus-within:outline-ring flex h-11 min-w-0 shrink-0 items-center gap-2 rounded-full border px-4 md:flex-1 focus-within:outline-2 focus-within:outline-offset-2">
            <Search
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
          <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap [&>:last-child]:col-span-2 md:[&>:last-child]:col-span-1">
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
                  license: (v || undefined) as LicenseFilter | undefined,
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

        <div className="border-border mt-10 flex min-h-12 flex-wrap items-end justify-between gap-x-4 gap-y-2 border-b pb-4">
          <h2
            aria-live="polite"
            className="m-0 flex flex-wrap items-baseline gap-x-3 text-4xl leading-none sm:text-5xl"
          >
            <span>
              {filtered.length} {filtered.length === 1 ? "Pair" : "Pairs"}
            </span>
            {hasFilters ? (
              <span className="text-muted-foreground font-sans text-base font-normal">
                of {total}
              </span>
            ) : null}
          </h2>
          {hasFilters ? (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : null}
        </div>

        <div className="mt-6">
          {filtered.length === 0 ? (
            <div className="border-border rounded-xl border border-dashed px-6 py-16">
              <p className="font-medium">
                No Pairs match{search.q ? ` “${search.q}”` : ""}
              </p>
              <p className="text-muted-foreground mt-1 max-w-[50ch] text-sm">
                Try another name, or clear the filters to see the whole
                Registry.
              </p>
              <Button className="mt-6" variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <PairGrid pairs={visible} />
              <Pagination
                className="mt-10"
                page={current}
                pageCount={pageCount}
                onChange={(page) => {
                  setParam({ page: page > 1 ? page : undefined });
                  window.scrollTo({ top: 0 });
                }}
              />
            </>
          )}
        </div>
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
