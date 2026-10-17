import { createServerFn } from "@tanstack/react-start";
import { filterPairs } from "@/lib/registry/pairs";
import {
  registryFilterSchema,
  slugInputSchema,
} from "@/lib/registry/registry-search";
import { getPairBySlug, listPairs, relatedPairs } from "./registry.server";

/**
 * Typed RPC boundary. Handler bodies, and the `.server` imports they use, are
 * stripped from the client bundle; inputs are validated on the server.
 */

export const listPairsFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => registryFilterSchema.parse(input ?? {}))
  .handler(async ({ data }) => {
    const all = listPairs();
    return { pairs: filterPairs(all, data), total: all.length };
  });

export const getPairFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => slugInputSchema.parse(input))
  .handler(async ({ data }) => getPairBySlug(data.slug) ?? null);

export const getRelatedPairsFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => slugInputSchema.parse(input))
  .handler(async ({ data }) => relatedPairs(data.slug));
