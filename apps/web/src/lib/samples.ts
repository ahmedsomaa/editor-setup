/** A short intro to EditorSetup in each of a few languages, then longer samples that stress a code font and a theme. */
export const SAMPLES: Record<string, string> = {
  typescript: `// EditorSetup: Font and Theme Pairs you can preview and copy.
const pair = {
  project: "EditorSetup",
  font: "Geist Mono",
  theme: "Vesper",
  editor: "Your Editor",
  functions: ["browse", "preview", "copy", "compare"],
};

console.log(pair.project, "-> preview a Pair, then copy it");
console.log(pair.functions);
// => ["browse", "preview", "copy", "compare"]
const ok = pair.functions.length >= 4 && pair.theme !== "";
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
  javascript: `// EditorSetup: Font and Theme Pairs you can preview and copy.
const pair = {
  project: "EditorSetup",
  font: "Geist Mono",
  theme: "Vesper",
  editor: "Your Editor",
  functions: ["browse", "preview", "copy", "compare"],
};

console.log(pair.project, "-> preview a Pair, then copy it");
console.log(pair.functions);
// => ["browse", "preview", "copy", "compare"]
const ok = pair.functions.length >= 4 && pair.theme !== "";
console.log(ok); // => true`,
  python: `# EditorSetup: Font and Theme Pairs you can preview and copy.
pair = {
    "project": "EditorSetup",
    "font": "Geist Mono",
    "theme": "Vesper",
    "editor": "Your Editor",
    "functions": ["browse", "preview", "copy", "compare"],
}

print(pair["project"], "-> preview a Pair, then copy it")
print(pair["functions"])
# => ['browse', 'preview', 'copy', 'compare']
ok = len(pair["functions"]) >= 4 and pair["theme"] != ""
print(ok)  # => True`,
  rust: `// EditorSetup: Font and Theme Pairs you can preview and copy.
let pair = Pair {
    project: "EditorSetup",
    font: "Geist Mono",
    theme: "Vesper",
    editor: "Your Editor",
    functions: ["browse", "preview", "copy", "compare"],
};

println!("{} -> preview a Pair, then copy it", pair.project);
println!("{:?}", pair.functions);
// => ["browse", "preview", "copy", "compare"]
let ok = pair.functions.len() >= 4 && pair.theme != "";
println!("{ok}"); // => true`,
  go: `// EditorSetup: Font and Theme Pairs you can preview and copy.
pair := Pair{
	Project:   "EditorSetup",
	Font:      "Geist Mono",
	Theme:     "Vesper",
	Editor:    "Your Editor",
	Functions: []string{"browse", "preview", "copy", "compare"},
}

fmt.Println(pair.Project, "-> preview a Pair, then copy it")
fmt.Println(pair.Functions)
// => [browse preview copy compare]
ok := len(pair.Functions) >= 4 && pair.Theme != ""
fmt.Println(ok) // => true`,
  lua: `-- EditorSetup: Font and Theme Pairs you can preview and copy.
local pair = {
  project = "EditorSetup",
  font = "Geist Mono",
  theme = "Vesper",
  editor = "Your Editor",
  functions = { "browse", "preview", "copy", "compare" },
}

print(pair.project, "-> preview a Pair, then copy it")
print(table.concat(pair.functions, ", "))
-- => browse, preview, copy, compare
local ok = #pair.functions >= 4 and pair.theme ~= ""
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
echo "no pairs => give up" >&2`,
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
function pair(font, theme) {
  return font !== "" && theme !== "" ? { font, theme } : null; // 0O 1lI => ->
}`;

export function sampleFor(lang: string): string {
  return SAMPLES[lang] ?? SAMPLE_FALLBACK;
}
