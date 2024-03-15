import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-14 relative">
      <div className="flex flex-col md:flex-col md:space-x-4 md:space-y-0 items-center gap-5">
        <div className="relative mx-auto max-w-3xl text-center gap-3">
          <h1 className="bg-gradient-to-br from-white to-sky-200 bg-clip-text text-4xl/[1.07] font-bold tracking-tight text-transparent md:text-6xl/[1.07]">
            Find your next optimal Visual Studio Code setup
          </h1>
          <p className="mt-6 text-md font-medium text-slate-100 md:text-lg">
            Explore multiple font and theme pairings for Visual Studio Code that
            just work!
          </p>
          <div className="mt-6 flex flex-col items-center justify-center   gap-y-8">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="font-semibold text-[#007ACC] hover:text-[#007ACC]"
            >
              <Link href="/explore">Explore Pairs</Link>
            </Button>
          </div>
        </div>
        <div className="-m-2 rounded-xl bg-neutral-900/5 dark:bg-neutral-100/10 p-2 ring-1 ring-inset ring-neutral-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
          <Image
            alt="Hero"
            height="400"
            width="600"
            src="/img/hero-img.png"
            style={{
              aspectRatio: "16/9",
              objectFit: "cover",
            }}
            className="rounded-md bg-white shadow-2xl ring-1 ring-sky-900/10"
          />
        </div>
      </div>
    </div>
  );
}
