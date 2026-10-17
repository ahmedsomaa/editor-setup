/**
 * Point wrangler at the built Worker config from the repo root.
 *
 * `wrangler preview` runs from the repo root on Cloudflare, but the built config is
 * apps/web/dist/server/wrangler.json. A deploy redirect at the root links the two.
 *
 * Usage: node scripts/write-deploy-redirect.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";

await mkdir(".wrangler/deploy", { recursive: true });
await writeFile(
  ".wrangler/deploy/config.json",
  JSON.stringify({ configPath: "../../apps/web/dist/server/wrangler.json" }) + "\n",
);
