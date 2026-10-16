import { HeadContent, Scripts, createRootRoute, Link } from '@tanstack/react-router'
import { IconContext } from '@phosphor-icons/react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { themeInitScript } from '../components/ThemeToggle'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'EditorSetup' },
      {
        name: 'description',
        content:
          'Font and Theme Pairs from real setups, shown in their own colors, with Settings you can copy for VS Code, Cursor, Zed, and Neovim.',
      },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  notFoundComponent: () => (
    <main id="main" className="mx-auto w-full max-w-4xl px-4 py-24">
      <h1>Page not found</h1>
      <p className="text-muted-foreground mt-4 max-w-[65ch] text-lg">
        That address does not exist. Try the{' '}
        <Link to="/registry" className="text-foreground underline hover:no-underline">
          Registry
        </Link>
        .
      </p>
    </main>
  ),
  shellComponent: RootDocument,
})

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
        <IconContext.Provider value={{ weight: 'bold', size: '1em' }}>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </IconContext.Provider>
        <Scripts />
      </body>
    </html>
  )
}
