import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { listPairs } from '@/lib/pairs'

export const Route = createFileRoute('/registry')({
  component: RegistryPage,
})

function RegistryPage() {
  const pairs = listPairs()

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="max-w-xl">
        <h1 className="text-display font-semibold tracking-[-0.02em]">
          Registry
        </h1>
        <p className="text-muted-foreground text-body mt-2 max-w-[65ch]">
          Pairs on <code className="text-foreground">main</code> with at least
          one Config. Filters and search land in a later pass.
        </p>
      </div>
      <ul className="mt-8 flex flex-col gap-3">
        {pairs.map((pair) => (
          <li
            key={pair.slug}
            className="border-border bg-card rounded-[var(--radius-lg)] border px-4 py-4 shadow-[var(--shadow-raised)]"
          >
            <p className="font-heading text-heading font-semibold tracking-[-0.02em]">
              {pair.theme.name}
              <span className="text-primary px-1.5 font-normal" aria-hidden>
                ·
              </span>
              <span className="text-mono font-medium">{pair.font.name}</span>
            </p>
            <p className="text-muted-foreground text-body mt-1">
              {pair.theme.appearance} · {pair.editors.length} Editor
              {pair.editors.length === 1 ? '' : 's'} · {pair.font.license} /{' '}
              {pair.theme.license}
            </p>
            <p className="text-muted-foreground text-mono mt-2">
              {pair.editors.map((e) => e.id).join(', ')}
            </p>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button variant="outline" nativeButton={false} render={<Link to="/" />}>
          Back home
        </Button>
      </div>
    </main>
  )
}
