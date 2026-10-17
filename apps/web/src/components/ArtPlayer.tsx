import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Frame for a looping art. The loop runs only while the art is on screen, and anything that moves
 * for 5 seconds can be paused. The art reads `[data-paused="true"]` to stop its animations.
 */
export function ArtPlayer({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(Boolean(e?.isIntersecting)));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-paused={!playing || !onScreen}>
      {children}
      <div className="mt-4 flex justify-end motion-reduce:hidden">
        <Button
          variant="ghost"
          size="icon"
          aria-label={playing ? "Pause animation" : "Play animation"}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
        </Button>
      </div>
    </div>
  );
}
