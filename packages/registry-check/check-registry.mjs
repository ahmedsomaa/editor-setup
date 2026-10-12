import { readdir, readFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const pairsDir = join(root, "registry/pairs");
const snapshotsDir = join(root, "registry/snapshots");
const schemaPath = join(root, "registry/schema/pair.schema.json");

const errors = [];

function fail(message) {
  errors.push(message);
}

function slugify(name) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pngSize(buffer) {
  if (buffer.length < 24) return null;
  const sig = buffer.subarray(0, 8);
  const expected = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!sig.equals(expected)) return null;
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

function isSixteenByNine(width, height) {
  return width * 9 === height * 16;
}

async function main() {
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);

  let files;
  try {
    files = (await readdir(pairsDir)).filter((f) => f.endsWith(".json")).sort();
  } catch {
    fail(`Missing pairs directory: ${pairsDir}`);
    report();
    return;
  }

  if (files.length === 0) {
    fail("No pair files found under registry/pairs/");
  }

  const seenFontTheme = new Map();

  for (const file of files) {
    const path = join(pairsDir, file);
    const stem = file.replace(/\.json$/, "");
    let data;
    try {
      data = JSON.parse(await readFile(path, "utf8"));
    } catch (error) {
      fail(`${file}: invalid JSON (${error.message})`);
      continue;
    }

    if (!validate(data)) {
      for (const err of validate.errors ?? []) {
        fail(`${file}: schema ${err.instancePath || "/"} ${err.message}`);
      }
      continue;
    }

    const fontSlug = slugify(data.font.name);
    const themeSlug = slugify(data.theme.name);
    const expectedStem = `${fontSlug}--${themeSlug}`;
    if (stem !== expectedStem) {
      fail(
        `${file}: filename must be ${expectedStem}.json (from Font and Theme names)`,
      );
    }

    const fontThemeKey = `${fontSlug}::${themeSlug}`;
    if (seenFontTheme.has(fontThemeKey)) {
      fail(
        `${file}: duplicate Pair for Font+Theme already in ${seenFontTheme.get(fontThemeKey)}`,
      );
    } else {
      seenFontTheme.set(fontThemeKey, file);
    }

    const editorIds = new Set();
    for (const editor of data.editors) {
      if (editorIds.has(editor.id)) {
        fail(`${file}: duplicate Editor id "${editor.id}"`);
      }
      editorIds.add(editor.id);

      if (!editor.settings.trim()) {
        fail(`${file}: editors[${editor.id}].settings must be non-empty`);
      }

      const expectedSnapshot = `${stem}--${editor.id}.png`;
      if (editor.snapshot !== expectedSnapshot) {
        fail(
          `${file}: editors[${editor.id}].snapshot must be "${expectedSnapshot}"`,
        );
      }

      const snapshotPath = join(snapshotsDir, editor.snapshot);
      try {
        await access(snapshotPath);
      } catch {
        fail(`${file}: missing Snapshot ${editor.snapshot}`);
        continue;
      }

      const buffer = await readFile(snapshotPath);
      const size = pngSize(buffer);
      if (!size) {
        fail(`${file}: ${editor.snapshot} is not a valid PNG`);
        continue;
      }
      if (!isSixteenByNine(size.width, size.height)) {
        fail(
          `${file}: ${editor.snapshot} must be 16:9 (got ${size.width}×${size.height})`,
        );
      }
    }
  }

  report();
}

function report() {
  if (errors.length) {
    console.error("Registry check failed:\n");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log("Registry check passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
