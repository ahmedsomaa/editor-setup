import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { XLinks } from "@/components/x-links";
import { HeroImage } from "@/components/hero-image";
import Illustration from "@/components/illustration";

// --------- PAGE ---------
export default function Home() {
  return (
    <>
      <Illustration />
      <main>
        <div className="px-4 sm:px-6">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-4">
              <p className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-background px-3 py-1 text-sm font-medium text-foreground shadow-sm shadow-black/[.12] dark:bg-accent">
                <span className="mr-2 flex shrink-0 border-r border-border pr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={12}
                    height={12}
                    fill="none"
                  >
                    <path
                      className="fill-zinc-500"
                      d="M6.958.713a1 1 0 0 0-1.916 0l-.999 3.33-3.33 1a1 1 0 0 0 0 1.915l3.33.999 1 3.33a1 1 0 0 0 1.915 0l.999-3.33 3.33-1a1 1 0 0 0 0-1.915l-3.33-.999-1-3.33Z"
                    />
                  </svg>
                </span>
                New pair every week
              </p>
            </div>

            <div className="mb-16">
              <h1 className="font-display mx-auto mb-4 max-w-3xl text-4xl/[1.1] font-extrabold tracking-tight text-foreground md:text-5xl/[1.1]">
                Find your next optimal Visual Studio Code setup
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore a curated list of font and theme pairings for Visual
                Studio Code that just work!
              </p>
            </div>

            <div className="mb-12">
              <div className="mt-6 flex flex-col items-center justify-center gap-y-10">
                <Link
                  href="/explore"
                  className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full bg-primary p-6 text-sm font-medium text-primary-foreground shadow-sm shadow-black/5 ring-offset-background transition-shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                >
                  Explore list
                  <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                </Link>
                <HeroImage />
              </div>
            </div>

            <div className="mt-16">
              <XLinks />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
