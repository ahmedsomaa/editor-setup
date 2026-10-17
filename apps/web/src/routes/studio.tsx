import { createFileRoute } from "@tanstack/react-router";
import { EditorPage } from "@/components/EditorPage";
import { DEFAULTS, snapshotSearchSchema } from "@/lib/schemas";
import { fetchThemeFn, resolveFontFn } from "@/server/assets.functions";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/studio")({
  validateSearch: snapshotSearchSchema,
  head: () =>
    pageHead({
      path: "/studio",
      title: "Snapshot Studio: make a Snapshot of your Font and Theme",
      description:
        "Pick an Open or Free Font and Theme, paste your code and save a 1600x900 Snapshot of your editor setup for your Registry pull request.",
    }),
  // Only inputs that need the server drive the loader; theme id and language stay client-side.
  loaderDeps: ({ search: { font, themeUrl, themeEditor } }) => ({
    font: font?.trim() || DEFAULTS.font,
    themeUrl: themeUrl?.trim() || undefined,
    themeEditor,
  }),
  loader: async ({ deps }) => {
    const [font, theme] = await Promise.all([
      resolveFontFn({ data: { family: deps.font } }),
      deps.themeUrl ? fetchThemeFn({ data: { url: deps.themeUrl, editor: deps.themeEditor } }) : null,
    ]);
    return { font, theme };
  },
  component: EditorPage,
});
