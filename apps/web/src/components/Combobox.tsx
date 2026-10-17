import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Check,
  CaretUpDown as ChevronsUpDown,
  MagnifyingGlass as Search,
} from "@phosphor-icons/react";
import { cn } from "cn";

export type Option = {
  id: string;
  label: string;
  group?: string;
  hint?: string;
};

type Props = {
  label: string;
  value: string;
  options: Option[];
  onChange: (id: string) => void;
  /** Shown on the trigger instead of the selected option (e.g. a custom theme). */
  display?: string;
  disabled?: boolean;
  placeholder?: string;
};

/** Searchable dropdown: filter by typing, arrows to move, Enter to pick, Esc to close. */
export function Combobox({
  label,
  value,
  options,
  onChange,
  display,
  disabled,
  placeholder,
}: Props) {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);

  const selected = options.find((o) => o.id === value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? options.filter((o) => `${o.label} ${o.id}`.toLowerCase().includes(q))
      : options;
  }, [options, query]);

  const close = (refocus = true) => {
    setOpen(false);
    setQuery("");
    if (refocus) trigger.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open)
      setActive(
        Math.max(
          0,
          filtered.findIndex((o) => o.id === value),
        ),
      );
    // Reset the cursor when the list changes or opens.
  }, [open, query]);

  useEffect(() => {
    list.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function pick(o: Option | undefined) {
    if (!o) return;
    onChange(o.id);
    close();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(filtered.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      pick(filtered[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      close(false);
    }
  }

  let lastGroup: string | undefined;

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="bg-muted border-border text-foreground hover:border-foreground/30 flex h-10 w-full items-center justify-between gap-2 rounded-full border ps-4 pe-3 text-start text-[13px] transition-colors duration-150 disabled:pointer-events-none disabled:opacity-60"
      >
        <span
          className={cn(
            "truncate",
            !selected && !display && "text-muted-foreground",
          )}
        >
          {display ?? selected?.label ?? placeholder ?? "Select…"}
        </span>
        <ChevronsUpDown
          className="text-muted-foreground size-4 shrink-0"
          aria-hidden
        />
      </button>

      {open ? (
        <div className="bg-popover border-border absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border shadow-[var(--shadow-overlay)]">
          <div className="border-border flex items-center gap-2 border-b px-3">
            <Search
              className="text-muted-foreground size-4 shrink-0"
              aria-hidden
            />
            <input
              autoFocus
              role="combobox"
              aria-expanded
              aria-controls={`${uid}-list`}
              aria-activedescendant={
                filtered[active] ? `${uid}-${filtered[active].id}` : undefined
              }
              aria-label={`Search ${label}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search…"
              autoComplete="off"
              spellCheck={false}
              className="placeholder:text-muted-foreground h-10 w-full bg-transparent text-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <ul
            id={`${uid}-list`}
            ref={list}
            role="listbox"
            aria-label={label}
            className="max-h-64 overflow-y-auto p-1.5"
          >
            {filtered.length === 0 ? (
              <li className="text-muted-foreground px-3 py-6 text-center text-sm">
                No match
              </li>
            ) : null}
            {filtered.map((o, i) => {
              const header = o.group && o.group !== lastGroup ? o.group : null;
              lastGroup = o.group;
              return (
                <li key={o.id} role="presentation">
                  {header ? (
                    <p className="text-muted-foreground px-2.5 pt-2.5 pb-1 text-xs font-medium">
                      {header}
                    </p>
                  ) : null}
                  <div
                    id={`${uid}-${o.id}`}
                    role="option"
                    aria-selected={o.id === value}
                    data-index={i}
                    onMouseMove={() => setActive(i)}
                    onClick={() => pick(o)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-[13px]",
                      "text-foreground",
                      o.id === value
                        ? "bg-accent-soft"
                        : i === active
                          ? "bg-muted"
                          : "",
                    )}
                  >
                    <span className="truncate">{o.label}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      {o.hint ? (
                        <span className="text-muted-foreground text-xs">
                          {o.hint}
                        </span>
                      ) : null}
                      {o.id === value ? (
                        <Check className="size-4" aria-hidden />
                      ) : null}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
