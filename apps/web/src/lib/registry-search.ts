import { z } from "zod";
import { EDITOR_IDS } from "@/lib/pairs";

/** A bad value in the URL falls back to "unset" instead of throwing. */
const editor = z.enum(EDITOR_IDS).optional().catch(undefined);

export const registryFilterSchema = z.object({
  q: z
    .string()
    .max(80)
    .transform((v) => v.trim() || undefined)
    .optional()
    .catch(undefined),
  editor,
  appearance: z.enum(["dark", "light"]).optional().catch(undefined),
  license: z.enum(["free", "open", "paid"]).optional().catch(undefined),
});

export const registrySearchSchema = registryFilterSchema.extend({
  view: z.enum(["grid", "list"]).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(999).optional().catch(undefined),
});

export const pairSearchSchema = z.object({ editor });

export const slugInputSchema = z.object({
  slug: z.string().min(1).max(200),
});

export type RegistrySearch = z.output<typeof registrySearchSchema>;
export type RegistryFilters = z.output<typeof registryFilterSchema>;
