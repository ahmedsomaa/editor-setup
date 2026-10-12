import { Link } from '@tanstack/react-router'
import { FolderGit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Mark } from '@/components/Mark'
import { GITHUB_URL } from '@/lib/site'

export default function Header() {
  return (
    <header className="border-border bg-background/80 site-shell sticky top-0 z-50 border-b backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
        <Link
          to="/"
          className="font-heading text-foreground inline-flex items-center gap-2 text-sm font-semibold tracking-tight no-underline"
        >
          <Mark className="size-4" />
          editorSetup
        </Link>
        <div className="text-muted-foreground flex items-center gap-3 text-sm font-medium">
          <Link
            to="/"
            className="hover:text-foreground no-underline"
            activeOptions={{ exact: true }}
            activeProps={{ className: 'text-foreground no-underline' }}
          >
            Home
          </Link>
          <Link
            to="/registry"
            className="hover:text-foreground no-underline"
            activeProps={{ className: 'text-foreground no-underline' }}
          >
            Registry
          </Link>
        </div>
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              />
            }
          >
            <FolderGit2 strokeWidth={2} />
          </Button>
        </div>
      </nav>
    </header>
  )
}
