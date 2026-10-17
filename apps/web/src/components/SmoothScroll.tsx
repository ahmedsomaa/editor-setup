import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

type Api = {
  gsap: typeof import("gsap").default;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  lenis: import("lenis").default;
};

/**
 * Smooth scrolling for every page, with the scrubbed moves a page asks for: a `data-hero-scrub` block
 * eases away as you leave the first screen, and `data-drift` art drifts a little against the page.
 * Lenis is the only smooth-scroll engine and drives GSAP's ticker. It lives across page changes, the
 * scrubs are rebuilt for each page, and nothing starts under reduced motion. Scroll areas inside the
 * page (lists, the drawer, text boxes) carry `data-lenis-prevent` so they keep their own scrolling.
 */
export function SmoothScroll() {
  const [api, setApi] = useState<Api | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("lenis"),
          import("lenis/dist/lenis.css"),
        ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
      setApi({ gsap, ScrollTrigger, lenis });
    })();

    return () => {
      cancelled = true;
      cleanup?.();
      setApi(null);
    };
  }, []);

  // The scrubs belong to a page, so build them again after each page change.
  useEffect(() => {
    if (!api) return;
    const { gsap, ScrollTrigger, lenis } = api;
    let ctx: ReturnType<typeof gsap.context> | undefined;

    const frame = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        if (document.querySelector("[data-hero]")) {
          gsap.to("[data-hero-scrub]", {
            yPercent: -8,
            opacity: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-hero]",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: 6 },
            {
              yPercent: -6,
              ease: "none",
              scrollTrigger: {
                trigger: el.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      });

      lenis.resize();
      // Fonts and images move things: measure again once they are in.
      void document.fonts.ready.then(() => ScrollTrigger.refresh());
    });

    return () => {
      cancelAnimationFrame(frame);
      ctx?.revert();
    };
  }, [api, pathname]);

  return null;
}
