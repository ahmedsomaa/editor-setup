import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cn } from "cn";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Position in a group; delays the entry by 80ms per step. */
  index?: number;
};

/**
 * Fades a block in once as it scrolls into view. Blocks already on screen
 * are never hidden, and nothing is hidden at all under reduced motion.
 */
export function Reveal({ children, as: Tag = "div", className, index = 0 }: RevealProps) {
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
    <Tag ref={ref} className={cn(className)} style={{ "--i": index } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
