import { z } from "zod";

export const familyInput = z.object({ family: z.string().trim().min(1).max(80) });
export const themeUrlInput = z.object({ url: z.string().trim().url().max(500) });

/** URL state of the tool. Bad values fall back to unset instead of throwing. */
export const snapshotSearchSchema = z.object({
  font: z.string().max(80).optional().catch(undefined),
  theme: z.string().max(80).optional().catch(undefined),
  lang: z.string().max(40).optional().catch(undefined),
  themeUrl: z.string().max(500).optional().catch(undefined),
});

export const DEFAULTS = {
  font: "JetBrains Mono",
  theme: "gruvbox-dark-hard",
  lang: "typescript",
} as const;

export type FontFace = {
  weight: number;
  style: "normal" | "italic";
  mime: string;
  format: string;
  base64: string;
};

export type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
export type ThemeJson = { [k: string]: Json };
