import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cn } from "cn";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Position in a group; delays the entry by 80ms per step. */
  index?: number;
  /** Where it slides in from: below, or from the leading or trailing side on wide screens. */
  from?: "up" | "start" | "end";
};

const OFFSETS = {
  up: { x: "0px", y: "28px" },
  start: { x: "-56px", y: "16px" },
  end: { x: "56px", y: "16px" },
} as const;

/**
 * Fades a block in once as it scrolls into view. Blocks already on screen
 * are never hidden, and nothing is hidden at all under reduced motion.
 */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  index = 0,
  from = "up",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.classList.add("reveal-pending");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.classList.remove("reveal-pending");
        el.classList.add("reveal-done");
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn(className)}
      style={
        {
          "--i": index,
          "--rx": OFFSETS[from].x,
          "--ry": OFFSETS[from].y,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
