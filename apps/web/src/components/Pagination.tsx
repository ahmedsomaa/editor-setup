import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

/** Page numbers for a list. Many pages, or `compact`, shows "Page 2 of 9" between the arrows instead. */
export function Pagination({
  page,
  pageCount,
  onChange,
  compact,
  className,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  compact?: boolean;
  className?: string;
}) {
  if (pageCount <= 1) return null;
  const numbered = !compact && pageCount <= 7;
  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft aria-hidden />
      </Button>
      {numbered ? (
        Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <Button
            key={n}
            variant={n === page ? "default" : "ghost"}
            size="icon-sm"
            aria-label={`Page ${n}`}
            aria-current={n === page ? "page" : undefined}
            onClick={() => onChange(n)}
            className="tabular-nums"
          >
            {n}
          </Button>
        ))
      ) : (
        <span className="text-muted-foreground min-w-24 text-center text-sm tabular-nums" role="status">
          Page {page} of {pageCount}
        </span>
      )}
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
      >
        <ChevronRight aria-hidden />
      </Button>
    </nav>
  );
}
