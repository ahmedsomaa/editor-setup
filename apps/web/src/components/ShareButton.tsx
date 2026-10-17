import { useState } from "react";
import { Check, ShareNetwork } from "@phosphor-icons/react";
import { cn } from "cn";

/**
 * Shares a page: the system share sheet where the browser has one, otherwise a copy of the
 * link. The label says what happened, and a status region announces it.
 */
export function ShareButton({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  const [state, setState] = useState<"copied" | "failed" | null>(null);

  async function share() {
    const url = window.location.href;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (e) {
        // Closing the share sheet is not a failure; anything else falls back to copying.
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState(null), 2000);
  }

  return (
    <>
      <button
        type="button"
        onClick={share}
        className={cn(
          "border-border bg-card text-foreground hover:bg-muted inline-flex h-6 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors duration-150 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)]",
          className,
        )}
      >
        {state === "copied" ? (
          <Check weight="bold" aria-hidden className="size-3.5" />
        ) : (
          <ShareNetwork weight="bold" aria-hidden className="size-3.5" />
        )}
        {state === "copied"
          ? "Link copied"
          : state === "failed"
            ? "Unable to copy"
            : "Share"}
      </button>
      <span role="status" className="sr-only">
        {state === "copied"
          ? "Link copied to the clipboard"
          : state === "failed"
            ? "Unable to copy the link. Copy it from the address bar."
            : ""}
      </span>
    </>
  );
}
