import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/about')({ component: About })

function About() {
  return (
    <main className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-16">
      <h1 className="text-display font-semibold tracking-[-0.02em]">About</h1>
      <p className="text-muted-foreground text-body max-w-[65ch]">
        This app lives in <code className="text-foreground">apps/web</code> and
        deploys to Cloudflare Workers. UI type is Sora for display, Geist for
        body, and Geist Mono for code.
      </p>
      <Button variant="outline" nativeButton={false} render={<Link to="/" />}>
        Back home
      </Button>
    </main>
  )
}
