import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeftRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAX_COMPARE, useCompare } from "@/lib/presets/compare-store";

/**
 * The compare tray: Presets you add with a "Compare" button collect here, on every page,
 * and the button opens the comparison once two or more are picked.
 */
export function CompareTray() {
  const { selected, remove, clear } = useCompare();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (selected.length === 0 || path.startsWith("/compare")) return null;

  const ready = selected.length >= 2;
  return (
    <section
      aria-label="Presets to compare"
      className="border-border bg-card fixed start-1/2 bottom-4 z-40 flex max-w-[calc(100vw-1.5rem)] -translate-x-1/2 items-center gap-2 rounded-full border p-1.5 shadow-[var(--shadow-overlay)] sm:bottom-6 rtl:translate-x-1/2"
    >
      <ul className="m-0 flex min-w-0 list-none items-center gap-1.5 overflow-x-auto p-0 ps-1">
        {selected.map((item) => (
          <li
            key={item.slug}
            className="bg-muted flex shrink-0 items-center gap-1 rounded-full py-0.5 ps-3 pe-0.5 text-sm"
          >
            <span className="max-w-36 truncate sm:max-w-48">{item.label}</span>
            <button
              type="button"
              aria-label={`Remove ${item.label} from the comparison`}
              onClick={() => remove(item.slug)}
              className="text-muted-foreground hover:text-foreground inline-flex size-7 items-center justify-center rounded-full outline-none focus-visible:outline-2 focus-visible:outline-[color:var(--ring)]"
            >
              <X aria-hidden className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
      <span
        role="status"
        className="text-muted-foreground hidden shrink-0 text-xs tabular-nums sm:inline"
      >
        {selected.length} of {MAX_COMPARE}
      </span>
      <Button variant="ghost" size="sm" onClick={clear} className="shrink-0">
        Clear
      </Button>
      {ready ? (
        <Button
          size="sm"
          className="shrink-0"
          nativeButton={false}
          render={
            <Link
              to="/compare"
              search={{ presets: selected.map((i) => i.slug).join(",") }}
            />
          }
        >
          <ArrowLeftRight aria-hidden />
          Compare {selected.length}
        </Button>
      ) : (
        <Button size="sm" className="shrink-0" disabled>
          Pick one more
        </Button>
      )}
    </section>
  );
}
