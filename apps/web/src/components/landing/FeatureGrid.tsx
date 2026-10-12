import { Copy, GitPullRequestArrow, Layers2, Search } from 'lucide-react'

const FEATURES = [
  {
    title: 'Browse Pairs',
    body: 'Every Pair on main with at least one Config, ordered by Font then Theme.',
    icon: Search,
  },
  {
    title: 'Copy Settings',
    body: 'Open a Pair, pick an Editor, and copy the Settings as plain text.',
    icon: Copy,
  },
  {
    title: 'Compare Editors',
    body: 'Put two Pairs side by side for one Editor and judge the Snapshots.',
    icon: Layers2,
  },
  {
    title: 'Contribute by PR',
    body: 'Add a Pair file and Snapshots in a pull request. No sign-in on the site.',
    icon: GitPullRequestArrow,
  },
] as const

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Built for finding a setup you can use
        </h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          A git-backed Registry of Font and Theme Pairs—browse, copy, compare,
          contribute.
        </p>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {FEATURES.map(({ title, body, icon: Icon }) => (
          <li
            key={title}
            className="border-border bg-card/80 rounded-[var(--radius-lg)] border p-5"
          >
            <div className="flex items-start gap-3">
              <Icon
                className="text-primary mt-0.5 size-5 shrink-0"
                strokeWidth={2}
                aria-hidden
              />
              <div>
                <h3 className="font-heading text-base font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {body}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
