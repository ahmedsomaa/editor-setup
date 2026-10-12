import { Link } from '@tanstack/react-router'
import { Mark } from '@/components/Mark'
import { CONTRIBUTE_URL, GITHUB_URL } from '@/lib/site'

export default function Footer() {
  return (
    <footer className="border-border site-shell border-t">
      <div className="text-muted-foreground mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/"
          className="font-heading text-foreground inline-flex items-center gap-2 font-semibold tracking-tight no-underline"
        >
          <Mark className="size-4" />
          editorSetup
        </Link>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link to="/registry" className="hover:text-foreground no-underline">
            Registry
          </Link>
          <a
            href={CONTRIBUTE_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground no-underline"
          >
            Contribute
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground no-underline"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}
