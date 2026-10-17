import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ComparePage } from "@/components/ComparePage";
import { listPairsFn } from "@/server/pairs.functions";

export const compareSearchSchema = z.object({
  /** Comma-separated Pair slugs. Missing means "start with the first two"; empty means none. */
  pairs: z.string().max(600).optional().catch(undefined),
});

export const Route = createFileRoute("/compare")({
  validateSearch: compareSearchSchema,
  loader: () => listPairsFn({ data: {} }),
  head: () => ({
    meta: [
      { title: "Compare · EditorSetup" },
      {
        name: "description",
        content:
          "Put Font and Theme Pairs side by side and compare their Snapshots.",
      },
    ],
  }),
  component: ComparePage,
});
