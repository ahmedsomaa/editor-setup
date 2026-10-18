/** A short intro to EditorSetup in each of a few languages, then longer samples that stress a code font and a theme. */
export const SAMPLES: Record<string, string> = {
  typescript: `// EditorSetup: Font and Theme Presets you can preview and copy.
const preset = {
  project: "EditorSetup",
  font: "Geist Mono",
  theme: "Vesper",
  editor: "Your Editor",
  functions: ["browse", "preview", "copy", "compare"],
};

console.log(preset.project, "-> preview a Preset, then copy it");
console.log(preset.functions);
// => ["browse", "preview", "copy", "compare"]
const ok = preset.functions.length >= 4 && preset.theme !== "";
console.log(ok); // => true`,
  tsx: `type Props = { name: string; count?: number };

export function Badge({ name, count = 0 }: Props) {
  const [open, setOpen] = useState(false); // 0O 1lI

  return (
    <button onClick={() => setOpen(!open)} aria-pressed={open}>
      {name} {count >= 1 && <span className="count">({count})</span>}
      {open ? "=> hide" : "-> show"}
    </button>
  );
}`,
  javascript: `// EditorSetup: Font and Theme Presets you can preview and copy.
const preset = {
  project: "EditorSetup",
  font: "Geist Mono",
  theme: "Vesper",
  editor: "Your Editor",
  functions: ["browse", "preview", "copy", "compare"],
};

console.log(preset.project, "-> preview a Preset, then copy it");
console.log(preset.functions);
// => ["browse", "preview", "copy", "compare"]
const ok = preset.functions.length >= 4 && preset.theme !== "";
console.log(ok); // => true`,
  python: `# EditorSetup: Font and Theme Presets you can preview and copy.
preset = {
    "project": "EditorSetup",
    "font": "Geist Mono",
    "theme": "Vesper",
    "editor": "Your Editor",
    "functions": ["browse", "preview", "copy", "compare"],
}

print(preset["project"], "-> preview a Preset, then copy it")
print(preset["functions"])
# => ['browse', 'preview', 'copy', 'compare']
ok = len(preset["functions"]) >= 4 and preset["theme"] != ""
print(ok)  # => True`,
  rust: `// EditorSetup: Font and Theme Presets you can preview and copy.
let preset = Preset {
    project: "EditorSetup",
    font: "Geist Mono",
    theme: "Vesper",
    editor: "Your Editor",
    functions: ["browse", "preview", "copy", "compare"],
};

println!("{} -> preview a Preset, then copy it", preset.project);
println!("{:?}", preset.functions);
// => ["browse", "preview", "copy", "compare"]
let ok = preset.functions.len() >= 4 && preset.theme != "";
println!("{ok}"); // => true`,
  go: `// EditorSetup: Font and Theme Presets you can preview and copy.
preset := Preset{
	Project:   "EditorSetup",
	Font:      "Geist Mono",
	Theme:     "Vesper",
	Editor:    "Your Editor",
	Functions: []string{"browse", "preview", "copy", "compare"},
}

fmt.Println(preset.Project, "-> preview a Preset, then copy it")
fmt.Println(preset.Functions)
// => [browse preview copy compare]
ok := len(preset.Functions) >= 4 && preset.Theme != ""
fmt.Println(ok) // => true`,
  lua: `-- EditorSetup: Font and Theme Presets you can preview and copy.
local preset = {
  project = "EditorSetup",
  font = "Geist Mono",
  theme = "Vesper",
  editor = "Your Editor",
  functions = { "browse", "preview", "copy", "compare" },
}

print(preset.project, "-> preview a Preset, then copy it")
print(table.concat(preset.functions, ", "))
-- => browse, preview, copy, compare
local ok = #preset.functions >= 4 and preset.theme ~= ""
print(ok) -- => true`,
  bash: `#!/usr/bin/env bash
set -euo pipefail

RETRIES=3 # 0O 1lI

for i in $(seq 0 "$RETRIES"); do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$URL?page=$i")
  if [[ "$status" != "200" ]]; then continue; fi
  curl -s "$URL?page=$i" | jq '.[] | select(.font != "" and .theme != "")'
  exit 0
done
echo "no presets => give up" >&2`,
  json: `{
  "editor.fontFamily": "JetBrains Mono",
  "editor.fontSize": 14,
  "editor.fontLigatures": true,
  "editor.lineHeight": 1.6,
  "workbench.colorTheme": "Gruvbox Dark Hard",
  "files.trimTrailingWhitespace": false,
  "terminal.integrated.fontWeight": "400",
  "diffEditor.ignoreTrimWhitespace": null,
  "tags": ["0O", "1lI", "=>", "->", "!==", "<="]
}`,
  css: `:root {
  --font: "JetBrains Mono", ui-monospace, monospace; /* 0O 1lI */
  --radius: 8px;
}

.card > a:hover,
.card[data-open="true"] {
  font: 500 14px/1.6 var(--font);
  color: color-mix(in srgb, #737373 60%, white);
  border: 1px solid rgb(255 255 255 / 12%);
  transition: transform 150ms ease-out;
}`,
};

export const SAMPLE_FALLBACK = `// Paste your own code on the left.
function preset(font, theme) {
  return font !== "" && theme !== "" ? { font, theme } : null; // 0O 1lI => ->
}`;

export function sampleFor(lang: string): string {
  return SAMPLES[lang] ?? SAMPLE_FALLBACK;
}
