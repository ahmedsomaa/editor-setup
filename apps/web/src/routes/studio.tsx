import { createFileRoute } from "@tanstack/react-router";
import { EditorPage } from "@/components/EditorPage";
import { DEFAULTS, snapshotSearchSchema } from "@/lib/schemas";
import { fetchThemeFn, resolveFontFn } from "@/server/assets.functions";

export const Route = createFileRoute("/studio")({
  validateSearch: snapshotSearchSchema,
  head: () => ({ meta: [{ title: "Snapshot Studio · EditorSetup" }] }),
  // Only inputs that need the server drive the loader; theme id and language stay client-side.
  loaderDeps: ({ search: { font, themeUrl } }) => ({
    font: font?.trim() || DEFAULTS.font,
    themeUrl: themeUrl?.trim() || undefined,
  }),
  loader: async ({ deps }) => {
    const [font, theme] = await Promise.all([
      resolveFontFn({ data: { family: deps.font } }),
      deps.themeUrl ? fetchThemeFn({ data: { url: deps.themeUrl } }) : null,
    ]);
    return { font, theme };
  },
  component: EditorPage,
});
