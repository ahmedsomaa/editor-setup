import { createFileRoute } from "@tanstack/react-router";
import { ENTRIES } from "@/lib/changelog";
import { SITE_URL } from "@/lib/site";

const escapeXml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: () => {
        const items = ENTRIES.map((entry) => {
          const list = entry.changes
            .map((change) => `<li>${escapeXml(change)}</li>`)
            .join("");
          return `    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${SITE_URL}/changelog</link>
      <guid isPermaLink="false">${escapeXml(`${entry.date}-${entry.title}`)}</guid>
      <pubDate>${new Date(`${entry.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(`<ul>${list}</ul>`)}</description>
    </item>`;
        }).join("\n");
        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>EditorSetup Changelog</title>
    <link>${SITE_URL}/changelog</link>
    <description>New Presets, pages and Editors on EditorSetup, newest first.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`,
          { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
        );
      },
    },
  },
});
