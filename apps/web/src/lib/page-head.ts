import { SITE_URL } from "./site";

export const OG_IMAGE = `${SITE_URL}/og.png`;

export const HOME_TITLE = "EditorSetup: Font and Theme Pairs for VS Code and Zed";
export const HOME_DESCRIPTION =
  "Font and Theme Pairs from real editor setups, shown in their own colors. Preview each Snapshot, then copy the Settings for VS Code and Zed.";

/** Link-preview checkers want titles of 50 to 60 characters and descriptions of 120 to 160. */
const TITLE_RANGE = [50, 60] as const;

/** The first candidate inside the title range, else the one closest to it. */
export function fitTitle(candidates: string[]): string {
  const [min, max] = TITLE_RANGE;
  const fit = candidates.find((c) => c.length >= min && c.length <= max);
  if (fit) return fit;
  const distance = (c: string) => (c.length < min ? min - c.length : c.length - max);
  return [...candidates].sort((a, b) => distance(a) - distance(b))[0]!;
}

/** Title, description, Open Graph, Twitter and canonical tags for one page, all tied to one URL. */
export function pageHead({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}) {
  const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
