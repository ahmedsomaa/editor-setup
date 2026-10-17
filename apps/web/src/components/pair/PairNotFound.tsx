import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function PairNotFound() {
  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-24">
      <h1>Pair not found</h1>
      <p className="text-muted-foreground mt-3 max-w-[65ch] text-lg">
        That Pair is not in the Registry, or it has no Config yet.
      </p>
      <Button
        className="mt-8"
        variant="outline"
        nativeButton={false}
        render={<Link to="/registry" />}
      >
        Back to Registry
      </Button>
    </main>
  );
}
