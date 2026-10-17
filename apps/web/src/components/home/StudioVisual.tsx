import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "cn";
import { EditorArt } from "@/components/home/EditorArt";
import { Button } from "@/components/ui/button";
import type { PairRecord } from "@/lib/registry/pairs";

/** Studio visual: one editor window repainted in one Pair after another, its code typed in each time. */
export function StudioVisual({ pairs }: { pairs: PairRecord[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const open = pairs;
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Off under reduced motion. It runs only while on screen, and anything that moves for 5 seconds can be paused.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPlaying(open.length > 1);
  }, [open.length]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) =>
      setActive(Boolean(e?.isIntersecting)),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !active) return;
    const id = window.setInterval(() => setI((n) => n + 1), 4200);
    return () => window.clearInterval(id);
  }, [playing, active]);

  if (!open.length) return null;
  const pair = open[i % open.length]!;
  return (
    <div ref={ref} data-paused={!playing}>
      <div aria-hidden className="relative">
        <EditorArt
          complete
          live
          liveKey={i}
          className="w-full"
          colors={{ bg: pair.theme.bg, fg: pair.theme.fg }}
        />
        <div key={i} className="pointer-events-none absolute inset-0">
          <div
            className="snap-frame absolute inset-[3%]"
            style={{ color: pair.theme.fg }}
          >
            {(
              [
                "top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
                "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
                "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
                "bottom-0 right-0 border-r-2 border-b-2 rounded-br-lg",
              ] as const
            ).map((c) => (
              <span
                key={c}
                className={cn("absolute size-6 border-current", c)}
              />
            ))}
          </div>
          <div className="snap-flash absolute inset-0 rounded-[14px] bg-white" />
          <div className="snap-chip bg-card border-border text-foreground absolute right-3 bottom-3 flex items-center gap-2 rounded-full border py-1.5 ps-1.5 pe-3 font-mono text-xs shadow-[var(--shadow-overlay)]">
            <span
              className="border-border block h-[18px] w-8 rounded-[4px] border"
              style={{ background: pair.theme.bg }}
            />
            snapshot.png · 1600×900
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        {open.length > 1 ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label={playing ? "Pause animation" : "Play animation"}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
