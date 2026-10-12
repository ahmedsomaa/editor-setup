import { MARQUEE_PAIRS } from '@/lib/site'

function Chip({ theme, font }: { theme: string; font: string }) {
  return (
    <span className="border-border bg-card text-secondary-foreground text-body inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium shadow-[var(--shadow-raised)]">
      <span>{theme}</span>
      <span className="text-primary" aria-hidden>
        ·
      </span>
      <span className="text-mono font-normal">{font}</span>
    </span>
  )
}

export function PairMarquee() {
  const items = [...MARQUEE_PAIRS, ...MARQUEE_PAIRS]

  return (
    <section
      aria-label="Example Font and Theme pairs"
      className="border-border/60 border-y py-6"
    >
      <div className="motion-reduce:flex motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-2 motion-reduce:px-4 overflow-hidden">
        <div className="marquee-track motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center flex w-max gap-2 px-2">
          {items.map((pair, i) => (
            <Chip
              key={`${pair.theme}-${pair.font}-${i}`}
              theme={pair.theme}
              font={pair.font}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
