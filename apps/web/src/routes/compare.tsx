import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ComparePage } from "@/components/ComparePage";
import { listPairsFn } from "@/server/pairs.functions";

export const compareSearchSchema = z.object({
  /** Comma-separated Pair slugs. Missing means "start with the first two"; empty means none. */
  pairs: z.string().max(600).optional().catch(undefined),
});
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/compare")({
  validateSearch: compareSearchSchema,
  loader: () => listPairsFn({ data: {} }),
  head: () =>
    pageHead({
      path: "/compare",
      title: "Compare Font and Theme Pairs side by side · EditorSetup",
      description:
        "Put Font and Theme Pairs side by side and compare their Snapshots in VS Code or Cursor, then copy the Settings for the one you like best.",
    }),
  component: ComparePage,
});
