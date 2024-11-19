"use client";

import Link from "next/link";

import { ThemeToggle } from "./theme-toggle";
import { GithubButton } from "./github-button";
import { PencilRulerIcon } from "lucide-react";

export default function Header() {
  return (
    <header>
      <div className="px-4 sm:px-6">
        <div className="mx-auto mb-16 flex h-[72px] w-full max-w-6xl items-center justify-between border-b border-border/70">
          <Link href="/" aria-label="Home">
            <span className="sr-only">Editor Setup</span>
            <PencilRulerIcon className="stroke-zinc-800 dark:stroke-zinc-100 h-7 w-7" />
          </Link>
          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <ThemeToggle />
              </li>
              <li>
                <GithubButton />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
