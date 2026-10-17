import type { FontFace } from "@/lib/studio/schemas";

/** Monospace families on Fontsource and Google Fonts. Anything else goes through "Other". */
export const FONT_PRESETS = [
  "JetBrains Mono",
  "Fira Code",
  "Geist Mono",
  "Inconsolata",
  "IBM Plex Mono",
  "Source Code Pro",
  "Roboto Mono",
  "Space Mono",
  "Victor Mono",
  "Cascadia Code",
  "DM Mono",
  "Red Hat Mono",
];

export const MAX_FONT_FILES = 4;
const MAX_FONT_BYTES = 3_000_000;
const FONT_TYPES: Record<string, { mime: string; format: string }> = {
  woff2: { mime: "font/woff2", format: "woff2" },
  woff: { mime: "font/woff", format: "woff" },
  ttf: { mime: "font/ttf", format: "truetype" },
  otf: { mime: "font/otf", format: "opentype" },
};
const WEIGHTS: [RegExp, number][] = [
  [/thin|hairline/, 100],
  [/extra-?light|ultra-?light/, 200],
  [/light/, 300],
  [/medium/, 500],
  [/semi-?bold|demi-?bold/, 600],
  [/extra-?bold|ultra-?bold/, 800],
  [/black|heavy/, 900],
  [/bold/, 700],
];

/** Weight and style come from the file name, the way font files are usually named. */
function faceMeta(fileName: string): Pick<FontFace, "weight" | "style"> {
  const n = fileName.toLowerCase();
  return {
    weight: WEIGHTS.find(([re]) => re.test(n))?.[1] ?? 400,
    style: /italic|oblique/.test(n) ? "italic" : "normal",
  };
}

/** "Input-Regular_(InputMono-Regular).ttf" becomes "Input". */
export function familyFromFile(fileName: string): string {
  const base = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/\(.*\)/, "")
    .replace(/[-_ ]+$/, "");
  return (
    base
      .replace(
        /[-_ ]?(thin|extra-?light|light|regular|medium|semi-?bold|bold|extra-?bold|black|italic|oblique)+$/i,
        "",
      )
      .replace(/[-_]+$/, "")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .trim() || base
  );
}

export function readFace(file: File): Promise<FontFace> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const type = FONT_TYPES[ext];
  if (!type)
    return Promise.reject(
      new Error(`${file.name} is not a .woff2, .woff, .ttf or .otf file.`),
    );
  if (file.size > MAX_FONT_BYTES)
    return Promise.reject(new Error(`${file.name} is over 3 MB.`));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.onload = () =>
      resolve({
        ...faceMeta(file.name),
        ...type,
        base64: String(reader.result).split(",")[1] ?? "",
      });
    reader.readAsDataURL(file);
  });
}
