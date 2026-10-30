import { createFileRoute } from "@tanstack/react-router";
import { StudioPage } from "@/components/studio/StudioPage";
import { DEFAULTS, snapshotSearchSchema } from "@/lib/studio/schemas";
import { fetchThemeFn, resolveFontFn } from "@/server/assets.functions";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/studio")({
  // Studio is a client-only tool (editor, canvas, file reads), so it renders in the browser. Other pages stay server-rendered.
  ssr: false,
  validateSearch: snapshotSearchSchema,
  head: () =>
    pageHead({
      path: "/studio",
      name: "Preset Studio",
      title: "Preset Studio: make a Snapshot of your Font and Theme",
      description:
        "Pick an Open or Free Font and Theme, paste your code and save a 1600x900 Snapshot of your editor setup for your pull request.",
    }),
  // Only inputs that need the server drive the loader; theme id and language stay client-side.
  loaderDeps: ({ search: { font, themeUrl, editor } }) => ({
    font: font?.trim() || DEFAULTS.font,
    themeUrl: themeUrl?.trim() || undefined,
    editor: editor ?? "vscode",
  }),
  loader: async ({ deps }) => {
    const [font, theme] = await Promise.all([
      resolveFontFn({ data: { family: deps.font } }),
      deps.themeUrl ? fetchThemeFn({ data: { url: deps.themeUrl, editor: deps.editor } }) : null,
    ]);
    return { font, theme };
  },
  component: StudioPage,
});
