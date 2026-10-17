import { createServerFn } from "@tanstack/react-start";
import { familyInput, themeUrlInput, type FontFace, type ThemeJson } from "@/lib/schemas";
import { UserFacingError, fetchTheme, resolveFont } from "./assets.server";

/** Failures a visitor can fix come back as data, not as a thrown 500. */
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function run<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    if (e instanceof UserFacingError) return { ok: false, error: e.message };
    console.error(e);
    return { ok: false, error: "Something went wrong fetching that. Try again." };
  }
}

export const resolveFontFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => familyInput.parse(input))
  .handler(
    async ({ data }): Promise<Result<FontFace[]>> => run(() => resolveFont(data.family)),
  );

export const fetchThemeFn = createServerFn({ method: "GET" })
  .validator((input: unknown) => themeUrlInput.parse(input))
  .handler(
    async ({ data }): Promise<Result<ThemeJson>> => run(async () => (await fetchTheme(data.url)) as ThemeJson),
  );
