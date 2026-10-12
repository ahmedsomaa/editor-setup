import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { CONTRIBUTE_URL } from '@/lib/site'

export function FinalCta() {
  return (
    <section className="border-border border-t px-4 py-16 sm:py-20">
      <div className="border-border bg-card mx-auto flex max-w-3xl flex-col items-center rounded-[var(--radius-lg)] border px-6 py-12 text-center shadow-[var(--shadow-raised)] sm:px-10">
        <h2 className="text-heading font-semibold tracking-[-0.02em]">
          Find a Pair, or add yours
        </h2>
        <p className="text-muted-foreground text-body mt-2 max-w-[65ch]">
          Browse the Registry for Settings you can copy, or open a pull request
          with a new Font and Theme Pair.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" nativeButton={false} render={<Link to="/registry" />}>
            Browse Registry
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={
              <a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer" />
            }
          >
            Add yours
          </Button>
        </div>
      </div>
    </section>
  )
}
