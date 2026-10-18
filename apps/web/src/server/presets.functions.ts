import { createServerFn } from "@tanstack/react-start";
import { filterPresets } from "@/lib/presets/presets";
import {
  presetsFilterSchema,
  slugInputSchema,
} from "@/lib/presets/presets-search";
import { getPresetBySlug, listPresets, relatedPresets } from "./presets.server";

/**
 * Typed RPC boundary. Handler bodies, and the `.server` imports they use, are
 * stripped from the client bundle; inputs are validated on the server.
 */

export const listPresetsFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => presetsFilterSchema.parse(input ?? {}))
  .handler(async ({ data }) => {
    const all = listPresets();
    return { presets: filterPresets(all, data), total: all.length };
  });

export const getPresetFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => slugInputSchema.parse(input))
  .handler(async ({ data }) => getPresetBySlug(data.slug) ?? null);

export const getRelatedPresetsFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => slugInputSchema.parse(input))
  .handler(async ({ data }) => relatedPresets(data.slug));
