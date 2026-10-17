import { useEffect, useState } from 'react'
import { Star } from '@phosphor-icons/react'
import { GITHUB_REPO, GITHUB_URL } from '@/lib/site'

function formatStars(count: number): string {
  if (count >= 1000) {
    const k = count / 1000
    return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, '')}k`
  }
  return String(count)
}

const CACHE_KEY = 'editorsetup:stars'
const FRESH_MS = 30 * 60 * 1000

function readCache(): { count: number; at: number } | null {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CACHE_KEY) ?? 'null')
    return typeof parsed?.count === 'number' && typeof parsed?.at === 'number'
      ? parsed
      : null
  } catch {
    return null
  }
}

function writeCache(count: number) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify({ count, at: Date.now() }))
  } catch {
    /* Storage blocked: the count just is not remembered. */
  }
}

/**
 * The repo's star count. GitHub allows only 60 anonymous requests an hour per IP, so the last
 * count is kept in the browser: it shows at once, is refreshed at most every 30 minutes, and
 * stays on screen when GitHub refuses a request.
 */
export function GitHubStars() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    const cached = readCache()
    if (cached) setStars(cached.count)
    if (cached && Date.now() - cached.at < FRESH_MS) return

    fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const count =
          data &&
          typeof data === 'object' &&
          'stargazers_count' in data &&
          typeof (data as { stargazers_count?: unknown }).stargazers_count ===
            'number'
            ? (data as { stargazers_count: number }).stargazers_count
            : null
        if (count !== null) {
          writeCache(count)
          if (!cancelled) setStars(count)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <a
      href={GITHUB_URL}
      target="_blank"
      rel="noreferrer"
      aria-label={stars == null ? 'GitHub repository' : `GitHub repository, ${stars} stars`}
      className="border-border bg-card text-foreground hover:bg-muted inline-flex h-9 items-center gap-2.5 rounded-full border ps-3 pe-3.5 text-sm font-medium no-underline transition-colors"
    >
      <GitHubMark className="size-4" />
      <span className="max-sm:sr-only">GitHub</span>
      <span aria-hidden className="bg-border h-4 w-px" />
      <span className="inline-flex items-center gap-1.5 tabular-nums">
        <Star weight="fill" className="size-4 text-[#e5a50a]" aria-hidden />
        {stars != null ? formatStars(stars) : '–'}
      </span>
    </a>
  )
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 250"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Z" />
    </svg>
  )
}
