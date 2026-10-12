import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  HOOK_INTERVAL_MS,
  HOOK_PAIRS,
  HOOK_SWAP_MS,
  type HookPair,
} from '@/lib/hook-pairs'
import { CONTRIBUTE_URL } from '@/lib/site'
import { cn } from 'cn'

export function Hero() {
  const [index, setIndex] = useState(0)
  const [swapping, setSwapping] = useState(false)
  const pausedRef = useRef(false)
  const pair: HookPair = HOOK_PAIRS[index] ?? HOOK_PAIRS[0]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const intervalId = setInterval(() => {
      if (pausedRef.current) return
      setSwapping(true)
      timeoutId = setTimeout(() => {
        setIndex((i) => (i + 1) % HOOK_PAIRS.length)
        setSwapping(false)
      }, HOOK_SWAP_MS)
    }, HOOK_INTERVAL_MS)

    return () => {
      clearInterval(intervalId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  function pause() {
    pausedRef.current = true
  }

  function resume() {
    pausedRef.current = false
  }

  return (
    <section
      className="relative flex flex-col items-center px-4 pt-16 pb-12 text-center sm:pt-20 sm:pb-16"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          resume()
        }
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-60px] inset-y-0 -z-10 bg-[radial-gradient(ellipse_closest-side,var(--background)_62%,transparent)]"
      />
      <h1
        className={cn(
          'landing-enter text-display max-w-3xl font-semibold tracking-[-0.02em]',
          swapping && 'hook-swapping',
        )}
        aria-label={`Your favorite editor in ${pair.theme} and ${pair.font}.`}
      >
        <span aria-hidden="true" className="flex flex-col items-center gap-1">
          <span className="whitespace-nowrap">Your favorite editor</span>
          <span className="whitespace-nowrap">
            in{' '}
            <span
              className="hook-swap-target inline-block rounded-full border px-[0.45em] py-[0.05em]"
              style={{
                background: pair.bg,
                color: pair.fg,
                borderColor: pair.edge,
              }}
            >
              {pair.theme}
            </span>
          </span>
          <span className="whitespace-nowrap">
            &amp;{' '}
            <span
              className="hook-swap-target font-medium tracking-[-0.01em] underline decoration-[var(--ring)] underline-offset-[0.16em] [text-decoration-thickness:from-font] [text-underline-position:from-font]"
              style={{ fontFamily: pair.fontFamily }}
            >
              {pair.font}
            </span>
          </span>
        </span>
      </h1>
      <p className="landing-enter landing-enter-delay-1 text-muted-foreground text-body mt-4 max-w-[65ch]">
        Real setups from real developers. Find yours and copy the config.
      </p>
      <div className="landing-enter landing-enter-delay-2 mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" nativeButton={false} render={<Link to="/registry" />}>
          Browse Registry
        </Button>
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          render={
            <a href={CONTRIBUTE_URL} target="_blank" rel="noreferrer" />
          }
        >
          Add yours
        </Button>
      </div>
    </section>
  )
}
