import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { CONTRIBUTE_URL, DEMO_FONT, DEMO_THEME } from '@/lib/site'

export function Hero() {
  return (
    <section className="relative flex flex-col items-center px-4 pt-16 pb-12 text-center sm:pt-20 sm:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-60px] inset-y-0 -z-10 bg-[radial-gradient(ellipse_closest-side,var(--background)_62%,transparent)]"
      />
      <h1
        className="landing-enter font-heading max-w-3xl text-[clamp(1.75rem,5.2vw,2.25rem)] leading-[1.15] font-semibold tracking-[-0.025em] text-balance"
        aria-label={`Your favorite editor in ${DEMO_THEME} and ${DEMO_FONT}.`}
      >
        <span aria-hidden="true" className="flex flex-col items-center gap-1">
          <span className="whitespace-nowrap">Your favorite editor</span>
          <span className="whitespace-nowrap">
            in{' '}
            <span className="border-border inline-block rounded-full border px-[0.45em] py-[0.05em]">
              {DEMO_THEME}
            </span>
          </span>
          <span className="whitespace-nowrap">
            &amp;{' '}
            <span className="font-medium tracking-[-0.01em] underline decoration-[var(--ring)] decoration-[3px] underline-offset-[0.16em]">
              {DEMO_FONT}
            </span>
          </span>
        </span>
      </h1>
      <p className="landing-enter landing-enter-delay-1 text-muted-foreground mt-4 max-w-[52ch] text-base leading-[1.45] text-balance">
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
