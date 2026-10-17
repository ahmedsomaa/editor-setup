import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    // Moving to another page cross-fades through the browser's View Transitions, styled in styles.css.
    // Search-param updates (filters, Studio settings, Compare picks) stay on the page, so they do not.
    defaultViewTransition: {
      types: ({ pathChanged }) => (pathChanged ? ['page'] : false),
    },
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
