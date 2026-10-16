import "@tanstack/react-start/server-only";
import type { FontFace } from "@/lib/schemas";

/**
 * Outbound fetches for fonts and themes. Server only: the browser cannot reach
 * these hosts reliably (CORS), and an open proxy would be an SSRF hole, so every
 * hop is checked against an allowlist and capped in size.
 */

const ALLOWED_HOSTS = [
  "raw.githubusercontent.com",
  "gist.githubusercontent.com",
  "github.com",
  "gitlab.com",
  "cdn.jsdelivr.net",
  "unpkg.com",
  "api.fontsource.org",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
];
const MAX_BYTES = 3_000_000;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

export class UserFacingError extends Error {}

function assertAllowed(raw: string): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new UserFacingError("That is not a valid URL.");
  }
  if (url.protocol !== "https:") throw new UserFacingError("Only https links are allowed.");
  if (!ALLOWED_HOSTS.includes(url.hostname)) {
    throw new UserFacingError(
      `${url.hostname} is not allowed. Use a GitHub, GitLab, jsDelivr, or unpkg link to the raw file.`,
    );
  }
  return url;
}

export function toRawUrl(u: string): string {
  return u
    .replace(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\//, "https://raw.githubusercontent.com/$1/$2/")
    .replace(/^https:\/\/gitlab\.com\/(.+)\/-\/blob\//, "https://gitlab.com/$1/-/raw/");
}

async function safeFetch(raw: string): Promise<Response> {
  let current = assertAllowed(toRawUrl(raw)).href;
  for (let hop = 0; hop < 4; hop++) {
    const res = await fetch(current, { redirect: "manual", headers: { "user-agent": UA } });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) throw new UserFacingError("Bad redirect.");
      current = assertAllowed(new URL(loc, current).href).href;
      continue;
    }
    if (!res.ok) throw new UserFacingError(`Fetching ${new URL(current).hostname} returned ${res.status}.`);
    return res;
  }
  throw new UserFacingError("Too many redirects.");
}

async function readCapped(res: Response): Promise<Uint8Array> {
  const buf = new Uint8Array(await res.arrayBuffer());
  if (buf.byteLength > MAX_BYTES) throw new UserFacingError("File is too large.");
  return buf;
}

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type RawFace = { weight: number; style: "normal" | "italic"; url: string };

async function fontsourceFaces(family: string): Promise<RawFace[] | null> {
  const res = await fetch(`https://api.fontsource.org/v1/fonts/${slug(family)}`, {
    headers: { "user-agent": UA },
  });
  if (!res.ok) return null;
  const meta = (await res.json()) as {
    variants?: Record<string, Record<string, Record<string, { url?: { woff2?: string } }>>>;
  };
  const faces: RawFace[] = [];
  for (const [weight, styles] of Object.entries(meta.variants ?? {})) {
    if (!["400", "500", "700"].includes(weight)) continue;
    for (const [style, subsets] of Object.entries(styles)) {
      const url = (subsets.latin ?? Object.values(subsets)[0])?.url?.woff2;
      if (url) faces.push({ weight: Number(weight), style: style === "italic" ? "italic" : "normal", url });
    }
  }
  return faces.length ? faces : null;
}

async function googleFaces(family: string): Promise<RawFace[] | null> {
  const q = encodeURIComponent(family).replace(/%20/g, "+");
  const res = await fetch(
    `https://fonts.googleapis.com/css2?family=${q}:ital,wght@0,400;0,700;1,400&display=swap`,
    { headers: { "user-agent": UA } },
  );
  if (!res.ok) return null;
  const css = await res.text();
  const faces: RawFace[] = [];
  for (const m of css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*{([^}]+)}/g)) {
    if (m[1] !== "latin") continue;
    const url = m[2].match(/url\(([^)]+)\)/)?.[1];
    if (!url) continue;
    faces.push({
      weight: Number(m[2].match(/font-weight:\s*(\d+)/)?.[1] ?? 400),
      style: m[2].match(/font-style:\s*(\w+)/)?.[1] === "italic" ? "italic" : "normal",
      url,
    });
  }
  return faces.length ? faces : null;
}

export async function resolveFont(family: string): Promise<FontFace[]> {
  const raw = (await fontsourceFaces(family)) ?? (await googleFaces(family));
  if (!raw) {
    throw new UserFacingError(
      `Could not find "${family}" on Fontsource or Google Fonts. Upload the font file instead.`,
    );
  }
  return Promise.all(
    raw.map(async (f) => ({
      weight: f.weight,
      style: f.style,
      mime: "font/woff2",
      format: "woff2",
      base64: toBase64(await readCapped(await safeFetch(f.url))),
    })),
  );
}

/** Strip comments and trailing commas: VS Code theme files are JSONC. */
function parseJsonc(text: string): Record<string, any> {
  let out = "";
  let inStr = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      out += c;
      if (c === "\\") out += text[++i];
      else if (c === '"') inStr = false;
    } else if (c === '"') {
      inStr = true;
      out += c;
    } else if (c === "/" && text[i + 1] === "/") {
      while (i < text.length && text[i] !== "\n") i++;
      out += "\n";
    } else if (c === "/" && text[i + 1] === "*") {
      i += 2;
      while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++;
      i++;
    } else out += c;
  }
  try {
    return JSON.parse(out.replace(/,(\s*[}\]])/g, "$1"));
  } catch {
    throw new UserFacingError("That file is not a valid VS Code theme JSON.");
  }
}

async function loadTheme(url: string, depth = 0): Promise<Record<string, any>> {
  if (depth > 3) return {};
  const text = new TextDecoder().decode(await readCapped(await safeFetch(url)));
  const theme = parseJsonc(text);
  if (typeof theme.include === "string") {
    const parent = await loadTheme(new URL(theme.include, toRawUrl(url)).href, depth + 1);
    theme.colors = { ...(parent.colors ?? {}), ...(theme.colors ?? {}) };
    theme.tokenColors = [...(parent.tokenColors ?? []), ...(theme.tokenColors ?? [])];
    theme.type ??= parent.type;
    delete theme.include;
  }
  return theme;
}

export async function fetchTheme(url: string) {
  const theme = await loadTheme(url);
  if (!theme.colors && !theme.tokenColors) {
    throw new UserFacingError("That JSON has no colors or tokenColors, so it is not a VS Code theme.");
  }
  return theme;
}
