import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PagePattern";
import {
  ButtonsSection,
  SourceSection,
  TagsSection,
} from "@/components/design/ComponentSections";
import {
  ColorSection,
  PrinciplesSection,
  TypeSection,
} from "@/components/design/TokenSections";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/design")({
  head: () =>
    pageHead({
      path: "/design",
      name: "Design system",
      title: "EditorSetup design system: colors, type, spacing, tags",
      description:
        "The colors, type, spacing and tags behind EditorSetup, a warm monochrome system where a Pair own colors are the only saturated surface on a page.",
    }),
  component: Design,
});

function Design() {
  return (
    <main id="main">
      <PageHero variant="about" className="pb-4 sm:pb-6">
        <h1>Design system</h1>
        <p className="text-muted-foreground mt-6 max-w-[60ch] text-lg">
          Quiet by design, so the pairs speak loudest.
        </p>
      </PageHero>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        <PrinciplesSection />
        <ColorSection />
        <TypeSection />
        <ButtonsSection />
        <TagsSection />
        <SourceSection />
      </div>
    </main>
  );
}
