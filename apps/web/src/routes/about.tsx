import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PagePattern";
import {
  AddPairSection,
  LicensesSection,
  TermsSection,
} from "@/components/about/AboutSections";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      path: "/about",
      name: "About",
      title: "About EditorSetup: Presets, Snapshots, Settings, Licenses",
      description:
        "EditorSetup is a curated list of Font and Theme Presets. Learn what a Preset, a Snapshot and a Config are, and how each License works.",
    }),
  component: About,
});

function About() {
  return (
    <main id="main">
      <PageHero variant="about" className="pb-4 sm:pb-6">
        <h1>About</h1>
        <p className="text-muted-foreground mt-6 max-w-[60ch] text-lg">
          A small, open list of Font and Theme Presets, kept in Git.
        </p>
      </PageHero>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        <TermsSection />
        <LicensesSection />
        <AddPairSection />
      </div>
    </main>
  );
}
