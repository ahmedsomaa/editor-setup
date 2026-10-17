import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopySettings({
  settings,
  variant,
}: {
  settings: string;
  variant: "default" | "outline";
}) {
  const [state, setState] = useState<"done" | "failed" | null>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(settings);
      setState("done");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState(null), 2000);
  }

  return (
    <>
      <Button type="button" size="sm" variant={variant} onClick={copy}>
        {state === "done" ? <Check aria-hidden /> : <Copy aria-hidden />}
        {state === "done"
          ? "Copied"
          : state === "failed"
            ? "Unable to copy"
            : "Copy Settings"}
      </Button>
      <span role="status" className="sr-only">
        {state === "done"
          ? "Settings copied"
          : state === "failed"
            ? "Unable to copy. Select the text and copy it yourself."
            : ""}
      </span>
    </>
  );
}
