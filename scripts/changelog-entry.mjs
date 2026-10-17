/**
 * Add a changelog entry for Pairs added or changed between two commits.
 *
 * Reads registry/pairs/*.json changes from `git diff <base> <head>` and
 * prepends one entry to ENTRIES in apps/web/src/routes/changelog.tsx.
 * Does nothing when no Pair changed or the entry is already there.
 *
 * Usage: node scripts/changelog-entry.mjs <base-sha> <head-sha>
 */
import { execFileSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHANGELOG = join(ROOT, "apps/web/src/routes/changelog.tsx");
const MARKER = "const ENTRIES = [\n";

const [base, head] = process.argv.slice(2);
if (!base || !head) {
  console.error("Usage: node scripts/changelog-entry.mjs <base-sha> <head-sha>");
  process.exit(1);
}

function git(...args) {
  return execFileSync("git", ["-C", ROOT, ...args], { encoding: "utf8" });
}

function pairLabel(sha, path) {
  try {
    const { font, theme } = JSON.parse(git("show", `${sha}:${path}`));
    return `${font.name} with ${theme.name}`;
  } catch {
    return null;
  }
}

const added = [];
const updated = [];

const diff = git(
  "diff",
  "--name-status",
  "--no-renames",
  base,
  head,
  "--",
  "registry/pairs/*.json",
);

for (const line of diff.split("\n").filter(Boolean)) {
  const [status, path] = line.split("\t");
  if (status === "A") {
    const label = pairLabel(head, path);
    if (label) added.push(label);
  } else if (status === "M") {
    const label = pairLabel(head, path);
    if (label) updated.push(label);
  }
}

const changes = [
  ...added.map((label) => `New Pair: ${label}.`),
  ...updated.map((label) => `Updated Pair: ${label}.`),
];

if (changes.length === 0) {
  console.log("No Pair changes. Changelog untouched.");
  process.exit(0);
}

const source = await readFile(CHANGELOG, "utf8");
if (!source.includes(MARKER)) {
  console.error(`Could not find "${MARKER.trim()}" in ${CHANGELOG}`);
  process.exit(1);
}

if (changes.every((change) => source.includes(JSON.stringify(change)))) {
  console.log("Entry already in changelog. Nothing to do.");
  process.exit(0);
}

const date = new Date().toISOString().slice(0, 10);
const title = added.length > 0 ? "New Pairs" : "Pair updates";
const entry = `  {
    date: ${JSON.stringify(date)},
    title: ${JSON.stringify(title)},
    changes: [
${changes.map((change) => `      ${JSON.stringify(change)},`).join("\n")}
    ],
  },
`;

await writeFile(CHANGELOG, source.replace(MARKER, MARKER + entry));
console.log(`Added changelog entry with ${changes.length} change(s).`);
