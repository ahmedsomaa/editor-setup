import { z } from "zod";

export const requestSchema = z.object({
  key: z
    .string({ required_error: "API key is required" })
    .min(32, "API key must be 32 characters")
});

export const responseSchema = z.object({
  code: z.number(),
  data: z.object({
    pairs: z.array(
      z.object({
        id: z.string(),
        image: z.string(),
        font: z.object({
          name: z.string(),
          url: z.string(),
        }),
        theme: z.object({
          name: z.string(),
          url: z.string(),
        }),
      })
    ),
  }),
});
