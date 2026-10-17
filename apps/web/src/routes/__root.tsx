import {
  HeadContent,
  Scripts,
  createRootRoute,
  Link,
} from "@tanstack/react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { CompareTray } from "../components/CompareTray";
import { themeInitScript } from "../components/ThemeToggle";

import { HOME_DESCRIPTION, HOME_TITLE, OG_IMAGE } from "../lib/page-head";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: HOME_TITLE },
      { name: "description", content: HOME_DESCRIPTION },
      { property: "og:site_name", content: "EditorSetup" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: HOME_TITLE },
      { property: "og:description", content: HOME_DESCRIPTION },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content:
          "EditorSetup home page: a code window in the Vesper Theme with Geist Mono.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: HOME_TITLE },
      { name: "twitter:description", content: HOME_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  notFoundComponent: () => (
    <main id="main" className="mx-auto w-full max-w-4xl px-4 py-24">
      <h1>Page not found</h1>
      <p className="text-muted-foreground mt-4 max-w-[65ch] text-lg">
        That address does not exist. Try the{" "}
        <Link
          to="/registry"
          className="text-foreground underline hover:no-underline"
        >
          Registry
        </Link>
        .
      </p>
    </main>
  ),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-svh flex-col font-sans">
        <a
          href="#main"
          className="bg-primary text-primary-foreground sr-only z-50 rounded-md px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <CompareTray />
        <Scripts />
      </body>
    </html>
  );
}
