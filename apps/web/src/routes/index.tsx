import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Mark } from '@/components/Mark'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-16">
      <div className="font-heading flex items-center gap-2 text-sm font-semibold tracking-tight">
        <Mark className="size-4" />
        editorSetup
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        TanStack Start is ready
      </h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Untitled UI tokens: violet primary, pill controls, Sora / Geist /{' '}
        <code className="text-foreground">Geist Mono</code>. Cloudflare via
        Wrangler.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button nativeButton={false} render={<Link to="/about" />}>
          About
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<a href="https://tanstack.com/start" />}
        >
          TanStack Start
        </Button>
      </div>
    </main>
  )
}
