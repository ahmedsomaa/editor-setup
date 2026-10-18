import { Link } from '@tanstack/react-router'
import { EditorArt } from '@/components/home/EditorArt'
import { Mark } from '@/components/layout/Mark'
import { ThemeSwitch } from '@/components/layout/ThemeToggle'
import { ADD_PAIR_URL, CONTRIBUTE_URL, GITHUB_URL } from '@/lib/site'

const linkClass =
  'text-muted-foreground hover:text-foreground inline-flex min-h-8 items-center text-sm no-underline transition-colors'

const AUTHOR = 'ahmedsomaa'
const AUTHOR_URL = `https://github.com/${AUTHOR}`
const LAST_UPDATED = new Date(__LAST_UPDATED__).toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export default function Footer() {
  return (
    <footer className="border-border relative overflow-hidden border-t">
      <div className="mx-auto max-w-6xl px-4 pt-16">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Link to="/" className="text-foreground inline-flex items-center gap-2 text-lg font-medium tracking-tighter no-underline">
              <Mark className="size-6" />
              EditorSetup
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">
              Font and Theme Pairs from real setups, with Settings you can paste. Open source, kept in Git.
            </p>
            <a
              href="https://www.producthunt.com/products/editorsetup?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-editorsetup"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block"
            >
              <img
                alt="EditorSetup - The easiest way to make your editor look better. | Product Hunt"
                width="250"
                height="54"
                loading="lazy"
                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1284370&theme=light&t=1792334017554"
              />
            </a>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className="font-sans text-sm font-medium tracking-normal">Explore</h2>
            <ul className="mt-3 flex list-none flex-col p-0">
              <li><Link to="/registry" className={linkClass}>Registry</Link></li>
              <li><Link to="/studio" className={linkClass}>Snapshot Studio</Link></li>
              <li><Link to="/about" className={linkClass}>About</Link></li>
              <li><Link to="/changelog" className={linkClass}>Changelog</Link></li>
            </ul>
          </nav>

          <nav aria-labelledby="footer-community">
            <h2 id="footer-community" className="font-sans text-sm font-medium tracking-normal">Community</h2>
            <ul className="mt-3 flex list-none flex-col p-0">
              <li><a href={ADD_PAIR_URL} target="_blank" rel="noreferrer" className={linkClass}>Add a Pair</a></li>
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
              <li><Link to="/design" className={linkClass}>Design system</Link></li>
              <li><a href="/llms.txt" className={linkClass}>llms.txt</a></li>
            </ul>
          </nav>
        </div>

        <div className="border-border mt-14 flex flex-wrap items-center justify-between gap-4 border-t py-6">
          <p className="text-muted-foreground flex flex-wrap items-center gap-x-2 text-sm">
            <span>
              Built in public by{" "}
              <a
                href={AUTHOR_URL}
                target="_blank"
                rel="noreferrer"
                className="text-foreground underline hover:no-underline"
              >
                {AUTHOR}
              </a>
            </span>
            <span aria-hidden>·</span>
            <span>© {new Date().getFullYear()}</span>
            <span aria-hidden>·</span>
            <span>
              Last updated{" "}
              <time dateTime={__LAST_UPDATED__}>{LAST_UPDATED}</time>
            </span>
          </p>
          <ThemeSwitch />
        </div>
      </div>

      <div
        aria-hidden
        className="mx-auto mt-4 h-48 max-w-2xl overflow-hidden px-4 [mask-image:linear-gradient(to_bottom,#000_35%,transparent)] sm:h-56"
      >
        <EditorArt className="w-full" />
      </div>
    </footer>
  )
}
