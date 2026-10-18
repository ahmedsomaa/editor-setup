import { createFileRoute } from "@tanstack/react-router";
import { FaqSection } from "@/components/home/FaqSection";
import { Hero } from "@/components/home/Hero";
import { FeatureSections } from "@/components/home/FeatureSections";
import { SharePresetSection } from "@/components/home/SharePresetSection";
import { useHeroStage } from "@/components/home/useHeroStage";
import { HOME_DESCRIPTION, HOME_TITLE, pageHead } from "@/lib/page-head";
import { listPresetsFn } from "@/server/presets.functions";

export const Route = createFileRoute("/")({
  loader: () => listPresetsFn({ data: {} }),
  head: () =>
    pageHead({ path: "/", title: HOME_TITLE, description: HOME_DESCRIPTION }),
  component: HomePage,
});

function HomePage() {
  const { presets } = Route.useLoaderData();
  const hero = useHeroStage(presets);
  const { heroPreset, stage, step } = hero;

  return (
    <main id="main">
      <Hero stage={hero} />

      <FeatureSections
        presets={presets}
        colors={heroPreset && { bg: stage.bg, fg: stage.fg }}
        step={step}
      />

      <SharePresetSection />

      <FaqSection />
    </main>
  );
}
