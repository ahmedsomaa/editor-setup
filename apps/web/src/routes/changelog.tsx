import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/PagePattern";
import { ChangelogList } from "@/components/changelog/ChangelogList";
import { Button } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/site";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/changelog")({
  head: () =>
    pageHead({
      path: "/changelog",
      name: "Changelog",
      title: "EditorSetup Changelog: new Pairs, pages and Editors",
      description:
        "Release notes for EditorSetup: new Pairs, pages and Editors, with the date of each change. See what is new in the Registry and Snapshot Studio.",
    }),
  component: Changelog,
});

function Changelog() {
  return (
    <main id="main">
      <PageHero variant="about" className="pb-4 sm:pb-6">
        <h1>Changelog</h1>
        <p className="text-muted-foreground mt-6 max-w-[60ch] text-lg">
          Every change, newest first.
        </p>
      </PageHero>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        <ChangelogList />
        <div className="mt-8">
          <Button
            variant="outline"
            nativeButton={false}
            render={
              <a
                href={`${GITHUB_URL}/commits/main`}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            See every commit
            <ArrowUpRight aria-hidden />
          </Button>
        </div>
      </div>
    </main>
  );
}
