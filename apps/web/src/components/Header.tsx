import { Link } from '@tanstack/react-router'
import { FolderGit2, PencilSparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4">
        <Link
          to="/"
          className="text-foreground inline-flex items-center gap-2 text-sm font-medium no-underline"
        >
          <PencilSparkles className="size-4" aria-hidden />
          editorSetup
        </Link>
        <div className="text-muted-foreground flex items-center gap-3 text-sm">
          <Link
            to="/"
            className="hover:text-foreground no-underline"
            activeProps={{ className: 'text-foreground no-underline' }}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-foreground no-underline"
            activeProps={{ className: 'text-foreground no-underline' }}
          >
            About
          </Link>
        </div>
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            render={
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              />
            }
          >
            <FolderGit2 />
          </Button>
        </div>
      </nav>
    </header>
  )
}
