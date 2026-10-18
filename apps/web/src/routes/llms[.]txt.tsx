import { createFileRoute } from "@tanstack/react-router";
import { ADD_PAIR_URL, GITHUB_URL, SITE_URL } from "@/lib/site";

const LLMS_TXT = `# EditorSetup

> A git-backed registry of monospace font and color theme pairings for code editors. Each Pair has the settings that apply it and a snapshot of how it looks. VS Code and Zed are supported.

## Site

- [Registry](${SITE_URL}/registry): every Pair, filterable by search, Editor and Appearance (dark or light)
- [Compare](${SITE_URL}/compare): two or more Pairs side by side through their Snapshots
- [Snapshot Studio](${SITE_URL}/studio): make a Snapshot from a Font and Theme
- [About](${SITE_URL}/about): what a Pair, Snapshot, Config and License are
- [Changelog](${SITE_URL}/changelog): release notes, also as an [RSS feed](${SITE_URL}/rss.xml)

## Project

- [Source code](${GITHUB_URL}): the site and the registry, one JSON file per Pair
- [Adding a Pair](${ADD_PAIR_URL}): how to submit a Pair with a pull request

## Optional

- [Sitemap](${SITE_URL}/sitemap.xml): every page, including each Pair at /registry/<slug>
`;

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(LLMS_TXT, {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }),
    },
  },
});
