import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";

const STATIC_PATHS = ["/", "/presets", "/compare", "/studio", "/about", "/changelog"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { listPresets } = await import("@/server/presets.server");
        const paths = [
          ...STATIC_PATHS,
          ...listPresets().map((preset) => `/presets/${preset.slug}`),
        ];
        const urls = paths
          .map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`)
          .join("\n");
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
          { headers: { "Content-Type": "application/xml; charset=utf-8" } },
        );
      },
    },
  },
});
