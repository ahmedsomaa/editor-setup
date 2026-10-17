import { useSyncExternalStore } from "react";

/** Most Pairs one comparison holds. */
export const MAX_COMPARE = 3;

export type CompareItem = { slug: string; label: string };

const KEY = "editorsetup:compare";
const EMPTY: CompareItem[] = [];

let items: CompareItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      items = parsed
        .filter(
          (i): i is CompareItem =>
            typeof i?.slug === "string" && typeof i?.label === "string",
        )
        .slice(0, MAX_COMPARE);
    }
  } catch {
    items = EMPTY;
  }
}

function set(next: CompareItem[]) {
  items = next.length ? next : EMPTY;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* Private mode or blocked storage: the tray still works until the tab closes. */
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The Pairs picked for comparison, kept across pages and visits. Empty on the server. */
export function useCompare() {
  const selected = useSyncExternalStore(
    subscribe,
    () => (load(), items),
    () => EMPTY,
  );
  return {
    selected,
    isSelected: (slug: string) => selected.some((i) => i.slug === slug),
    full: selected.length >= MAX_COMPARE,
    toggle(item: CompareItem) {
      load();
      if (items.some((i) => i.slug === item.slug)) {
        set(items.filter((i) => i.slug !== item.slug));
      } else if (items.length < MAX_COMPARE) {
        set([...items, item]);
      }
    },
    remove(slug: string) {
      load();
      set(items.filter((i) => i.slug !== slug));
    },
    clear() {
      set([]);
    },
  };
}
