import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { PresetDetails } from "@/components/preset/PresetDetails";
import { PresetHeader } from "@/components/preset/PresetHeader";
import { PresetNotFound } from "@/components/preset/PresetNotFound";
import { PresetSettings } from "@/components/preset/PresetSettings";
import { PresetSnapshot } from "@/components/preset/PresetSnapshot";
import { PresetToolbar } from "@/components/preset/PresetToolbar";
import { RelatedPresets } from "@/components/preset/RelatedPresets";
import { getEditorConfig, resolveEditorId } from "@/lib/presets/presets";
import { presetSearchSchema } from "@/lib/presets/presets-search";
import { getPresetFn, getRelatedPresetsFn } from "@/server/presets.functions";
import { fitTitle, pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/presets/$slug")({
  validateSearch: presetSearchSchema,
  loader: async ({ params }) => {
    const preset = await getPresetFn({ data: { slug: params.slug } });
    if (!preset || preset.editors.length === 0) throw notFound();
    // Not awaited: the page shell streams now, related Presets follow in the same response.
    const related = getRelatedPresetsFn({ data: { slug: params.slug } });
    return { preset, related };
  },
  // Per-Preset content worth indexing: full server render.
  ssr: true,
  head: ({ loaderData }) => {
    const preset = loaderData?.preset;
    if (!preset) return {};
    const name = `${preset.theme.name} with ${preset.font.name}`;
    return pageHead({
      path: `/presets/${preset.slug}`,
      name,
      title: fitTitle([
        `${name}: Font and Theme Preset · EditorSetup`,
        `${name} · EditorSetup Font and Theme Preset`,
        `${name}: Font and Theme Preset`,
        `${name} · EditorSetup`,
      ]),
      description: `See ${name} in a real editor Snapshot, then copy the Settings for VS Code and Zed. A Font and Theme Preset from EditorSetup.`,
    });
  },
  component: PresetPage,
  notFoundComponent: PresetNotFound,
});

function PresetPage() {
  const { preset, related } = Route.useLoaderData();
  const { editor: editorParam } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const editorId = resolveEditorId(preset, editorParam);
  const config = getEditorConfig(preset, editorId) ?? preset.editors[0]!;

  return (
    <main id="main">
      <PresetToolbar preset={preset} settings={config.settings} />
      <PresetHeader preset={preset} />
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 sm:pb-20">
        <PresetSnapshot preset={preset} config={config} />
        <PresetSettings
          preset={preset}
          config={config}
          onSelectEditor={(id) =>
            void navigate({
              search: { editor: id },
              replace: true,
              resetScroll: false,
            })
          }
        />
        <PresetDetails preset={preset} />
        <RelatedPresets related={related} />
      </div>
    </main>
  );
}
