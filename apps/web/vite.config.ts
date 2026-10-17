import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { defineConfig, searchForWorkspaceRoot } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

/** When the repository was last changed: the latest commit date, or now when git is unavailable. */
function lastUpdated(): string {
  try {
    return execSync('git log -1 --format=%cI', { encoding: 'utf8' }).trim() || new Date().toISOString()
  } catch {
    return new Date().toISOString()
  }
}

const config = defineConfig({
  define: { __LAST_UPDATED__: JSON.stringify(lastUpdated()) },
  // Pair JSON and Snapshot PNGs live in the repo-root registry/, outside apps/web.
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        fileURLToPath(new URL('../../registry', import.meta.url)),
      ],
    },
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
