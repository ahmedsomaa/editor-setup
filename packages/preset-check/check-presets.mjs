import { readdir, readFile, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const presetsDir = join(root, "presets");
const snapshotsDir = join(root, "presets/snapshots");
const schemaPath = join(root, "presets/schema/preset.schema.json");

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
    files = (await readdir(presetsDir)).filter((f) => f.endsWith(".json")).sort();
  } catch {
    fail(`Missing presets directory: ${presetsDir}`);
    report();
    return;
  }

  if (files.length === 0) {
    fail("No preset files found under presets/");
  }

  const seenFontTheme = new Map();

  for (const file of files) {
    const path = join(presetsDir, file);
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
        `${file}: duplicate Preset for Font+Theme already in ${seenFontTheme.get(fontThemeKey)}`,
      );
    } else {
      seenFontTheme.set(fontThemeKey, file);
    }

    const credited = new Set([data.author.name.toLowerCase()]);
    const claimed = new Map();
    const presetEditors = new Set(data.editors.map((e) => e.id));
    for (const person of data.contributors ?? []) {
      const key = person.name.toLowerCase();
      if (credited.has(key)) {
        fail(`${file}: "${person.name}" is credited twice (author and contributors)`);
      }
      credited.add(key);
      for (const id of person.editors) {
        if (!presetEditors.has(id)) {
          fail(`${file}: contributor "${person.name}" lists "${id}", which this Preset has no Config for`);
        } else if (claimed.has(id)) {
          fail(`${file}: "${id}" is claimed by both "${claimed.get(id)}" and "${person.name}"`);
        } else {
          claimed.set(id, person.name);
        }
      }
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
    }

    const expectedSnapshot = `${stem}.png`;
    if (data.snapshot !== expectedSnapshot) {
      fail(`${file}: snapshot must be "${expectedSnapshot}"`);
    } else {
      const snapshotPath = join(snapshotsDir, data.snapshot);
      let found = true;
      try {
        await access(snapshotPath);
      } catch {
        fail(`${file}: missing Snapshot ${data.snapshot}`);
        found = false;
      }
      if (found) {
        const size = pngSize(await readFile(snapshotPath));
        if (!size) {
          fail(`${file}: ${data.snapshot} is not a valid PNG`);
        } else if (!isSixteenByNine(size.width, size.height)) {
          fail(`${file}: ${data.snapshot} must be 16:9 (got ${size.width}×${size.height})`);
        }
      }
    }
  }

  report();
}

function report() {
  if (errors.length) {
    console.error("Preset check failed:\n");
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log("Preset check passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
