import { z } from "zod";
import type { ThemeEditor } from "./schemas";

/** Only the shape is checked. Unknown keys and odd color values pass through. */
const vscodeTokenColor = z.object({
  name: z.string().optional(),
  scope: z.union([z.string(), z.array(z.string())]).optional(),
  settings: z.record(z.unknown()),
});

export const vscodeThemeSchema = z
  .object({
    name: z.string().optional(),
    type: z.string().optional(),
    colors: z.record(z.unknown()).optional(),
    tokenColors: z.array(vscodeTokenColor).optional(),
  })
  .passthrough()
  .refine((t) => t.colors || t.tokenColors, {
    message: "has no colors or tokenColors, so it is not a VS Code theme",
  });

export const zedThemeSchema = z
  .object({
    name: z.string().optional(),
    author: z.string().optional(),
    themes: z
      .array(
        z
          .object({
            name: z.string(),
            appearance: z.enum(["light", "dark"]),
            style: z.object({ syntax: z.record(z.unknown()).optional() }).passthrough(),
          })
          .passthrough(),
      )
      .min(1),
  })
  .passthrough();

const SCHEMAS = {
  vscode: { label: "VS Code", schema: vscodeThemeSchema },
  zed: { label: "Zed", schema: zedThemeSchema },
} satisfies Record<ThemeEditor, { label: string; schema: z.ZodTypeAny }>;

/** Returns an error message for a theme that does not fit its Editor's format, or null. */
export function checkThemeShape(editor: ThemeEditor, theme: unknown): string | null {
  const { label, schema } = SCHEMAS[editor];
  const res = schema.safeParse(theme);
  if (res.success) return null;
  const issue = res.error.issues[0];
  const path = issue.path.join(".");
  return `That file is not a ${label} theme: ${path ? `"${path}" ` : ""}${issue.message.toLowerCase()}.`;
}
