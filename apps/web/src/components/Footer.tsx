import { Link } from '@tanstack/react-router'
import { Mark } from '@/components/Mark'
import { ThemeSwitch } from '@/components/ThemeToggle'
import { CONTRIBUTE_URL, GITHUB_URL } from '@/lib/site'

const linkClass =
  'text-muted-foreground hover:text-foreground inline-flex min-h-8 items-center text-sm no-underline transition-colors'

export default function Footer() {
  return (
    <footer className="border-border relative overflow-hidden border-t">
      <div className="mx-auto max-w-5xl px-4 pt-16">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Link to="/" className="text-foreground inline-flex items-center gap-2 text-lg font-medium tracking-tighter no-underline">
              <Mark className="size-6" />
              EditorSetup
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">
              Font and Theme Pairs from real setups, with Settings you can paste. Open source, kept in Git.
            </p>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className="font-sans text-sm font-medium tracking-normal">Explore</h2>
            <ul className="mt-3 flex list-none flex-col p-0">
              <li><Link to="/registry" className={linkClass}>Registry</Link></li>
              <li><Link to="/studio" className={linkClass}>Snapshot Studio</Link></li>
              <li><Link to="/about" className={linkClass}>About</Link></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-contribute">
            <h2 id="footer-contribute" className="font-sans text-sm font-medium tracking-normal">Contribute</h2>
            <ul className="mt-3 flex list-none flex-col p-0">
              <li><a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer" className={linkClass}>Contribution guide</a></li>
              <li><a href={`${GITHUB_URL}/pulls`} target="_blank" rel="noreferrer" className={linkClass}>Pull requests</a></li>
              <li><a href={`${GITHUB_URL}/issues`} target="_blank" rel="noreferrer" className={linkClass}>Issues</a></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-project">
            <h2 id="footer-project" className="font-sans text-sm font-medium tracking-normal">Project</h2>
            <ul className="mt-3 flex list-none flex-col p-0">
              <li><a href={GITHUB_URL} target="_blank" rel="noreferrer" className={linkClass}>GitHub</a></li>
              <li><a href={`${GITHUB_URL}/blob/main/GLOSSARY.md`} target="_blank" rel="noreferrer" className={linkClass}>Glossary</a></li>
              <li><a href={`${GITHUB_URL}/tree/main/docs/design-system`} target="_blank" rel="noreferrer" className={linkClass}>Design system</a></li>
            </ul>
          </nav>
        </div>

        <div className="border-border mt-14 flex flex-wrap items-center justify-between gap-4 border-t py-6">
          <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} EditorSetup. Fonts and Themes belong to their makers.</p>
          <ThemeSwitch />
        </div>
      </div>

      <p
        aria-hidden
        className="font-heading text-foreground/[0.05] pointer-events-none -mb-[0.2em] text-center text-[clamp(4rem,17vw,15rem)] leading-none tracking-[-0.04em] select-none"
      >
        EditorSetup
      </p>
    </footer>
  )
}
