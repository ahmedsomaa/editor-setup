import { createFileRoute, Link } from '@tanstack/react-router'
import { PencilSparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="mx-auto flex max-w-lg flex-col gap-4 px-6 py-16">
      <div className="flex items-center gap-2 text-sm font-medium">
        <PencilSparkles className="size-4" aria-hidden />
        editorSetup
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">
        TanStack Start is ready
      </h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Scaffolded with shadcn/ui (Nova + Lucide), Tailwind CSS, and Cloudflare
        Workers deploy via Wrangler. Display is Sora, body is Geist, code is{' '}
        <code className="text-foreground">Geist Mono</code>.
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
