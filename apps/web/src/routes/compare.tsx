import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ComparePage } from "@/components/compare/ComparePage";
import { listPresetsFn } from "@/server/presets.functions";

export const compareSearchSchema = z.object({
  /** Comma-separated Preset slugs. Missing means "start with the first two"; empty means none. */
  presets: z.string().max(600).optional().catch(undefined),
});
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/compare")({
  validateSearch: compareSearchSchema,
  loader: () => listPresetsFn({ data: {} }),
  head: () =>
    pageHead({
      path: "/compare",
      name: "Compare Presets",
      title: "Compare Font and Theme Presets side by side · EditorSetup",
      description:
        "Put Font and Theme Presets side by side and compare their Snapshots, then copy the Settings for the one you like best.",
    }),
  component: ComparePage,
});
