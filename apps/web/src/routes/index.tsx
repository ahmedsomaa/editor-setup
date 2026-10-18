import { createFileRoute } from "@tanstack/react-router";
import { FaqSection } from "@/components/home/FaqSection";
import { Hero } from "@/components/home/Hero";
import { FeatureSections } from "@/components/home/FeatureSections";
import { SharePairSection } from "@/components/home/SharePairSection";
import { useHeroStage } from "@/components/home/useHeroStage";
import { HOME_DESCRIPTION, HOME_TITLE, pageHead } from "@/lib/page-head";
import { listPairsFn } from "@/server/pairs.functions";

export const Route = createFileRoute("/")({
  loader: () => listPairsFn({ data: {} }),
  head: () =>
    pageHead({ path: "/", title: HOME_TITLE, description: HOME_DESCRIPTION }),
  component: HomePage,
});

function HomePage() {
  const { pairs } = Route.useLoaderData();
  const hero = useHeroStage(pairs);
  const { heroPair, stage, step } = hero;

  return (
    <main id="main">
      <Hero stage={hero} />

      <FeatureSections
        pairs={pairs}
        colors={heroPair && { bg: stage.bg, fg: stage.fg }}
        step={step}
      />

      <SharePairSection />

      <FaqSection />
    </main>
  );
}
