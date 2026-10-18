/**
 * Resolve each Preset file's submitter from the merged PR that introduced it.
 *
 * For every presets/*.json:
 *   1. Find the commit that first added the file (git)
 *   2. Ask GitHub which PR that commit belongs to (gh api)
 *   3. Use that PR's author login
 *
 * Fallback: commit author login from the GitHub commits API, then git %an.
 *
 * Usage: bun run scripts/resolve-preset-submitters.ts
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join, basename } from "node:path";
import { $ } from "bun";

const ROOT = join(import.meta.dir, "..");
const PRESETS_DIR = join(ROOT, "presets");
const OUT_DIR = join(ROOT, "apps/web/src/data");
const OUT_FILE = join(OUT_DIR, "preset-submitters.json");
const REPO = "ahmedsomaa/editor-setup";

export type SubmitterRecord = {
  name: string;
  url: string;
  source: "pull_request" | "commit_author" | "git_author";
  prNumber?: number;
};

async function firstAddCommit(relPath: string): Promise<string | null> {
  const result =
    await $`git -C ${ROOT} log --diff-filter=A --format=%H -- ${relPath}`.quiet();
  const sha = result.stdout.toString().trim().split("\n")[0]?.trim();
  return sha || null;
}

async function gitAuthorName(relPath: string): Promise<string | null> {
  const result =
    await $`git -C ${ROOT} log --diff-filter=A --format=%an -- ${relPath}`.quiet();
  const name = result.stdout.toString().trim().split("\n")[0]?.trim();
  return name || null;
}

async function prAuthorForCommit(
  sha: string,
): Promise<{ login: string; number: number } | null> {
  try {
    const result =
      await $`gh api repos/${REPO}/commits/${sha}/pulls`.quiet().nothrow();
    if (result.exitCode !== 0) return null;
    const pulls = JSON.parse(result.stdout.toString()) as Array<{
      number: number;
      user?: { login?: string };
      merged_at?: string | null;
    }>;
    // Prefer a merged PR; otherwise first associated PR
    const merged = pulls.find((p) => p.merged_at && p.user?.login);
    const pick = merged ?? pulls.find((p) => p.user?.login);
    if (!pick?.user?.login) return null;
    return { login: pick.user.login, number: pick.number };
  } catch {
    return null;
  }
}

async function commitAuthorLogin(sha: string): Promise<string | null> {
  try {
    const result =
      await $`gh api repos/${REPO}/commits/${sha} --jq .author.login`.quiet().nothrow();
    if (result.exitCode !== 0) return null;
    const login = result.stdout.toString().trim();
    return login && login !== "null" ? login : null;
  } catch {
    return null;
  }
}

async function resolveSubmitter(
  fileName: string,
): Promise<SubmitterRecord | null> {
  const relPath = `presets/${fileName}`;
  const sha = await firstAddCommit(relPath);
  if (!sha) return null;

  const pr = await prAuthorForCommit(sha);
  if (pr) {
    return {
      name: pr.login,
      url: `https://github.com/${pr.login}`,
      source: "pull_request",
      prNumber: pr.number,
    };
  }

  const login = await commitAuthorLogin(sha);
  if (login) {
    return {
      name: login,
      url: `https://github.com/${login}`,
      source: "commit_author",
    };
  }

  const name = await gitAuthorName(relPath);
  if (!name) return null;
  return {
    name,
    url: `https://github.com/${encodeURIComponent(name)}`,
    source: "git_author",
  };
}

async function main() {
  const files = (await readdir(PRESETS_DIR))
    .filter((f) => f.endsWith(".json"))
    .sort();

  const submitters: Record<string, SubmitterRecord> = {};

  for (const file of files) {
    const slug = basename(file, ".json");
    const record = await resolveSubmitter(file);
    if (record) {
      submitters[slug] = record;
      console.log(
        `${slug}: @${record.name} (${record.source}${record.prNumber ? ` #${record.prNumber}` : ""})`,
      );
    } else {
      console.warn(`${slug}: no submitter resolved`);
    }
  }

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, `${JSON.stringify(submitters, null, 2)}\n`, "utf8");
  console.log(`Wrote ${OUT_FILE} (${Object.keys(submitters).length} presets)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
