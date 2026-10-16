/** One idiomatic ~13-line sample per language, written to stress a code font and a theme. */
export const SAMPLES: Record<string, string> = {
  typescript: `type Pair = { font: string; theme: string; ligatures?: boolean };

const RETRIES = 3; // 0O 1lI

export async function loadPairs(url: string): Promise<Pair[]> {
  for (let i = 0; i <= RETRIES; i++) {
    const res = await fetch(\`\${url}?page=\${i}\`);
    if (res.status !== 200) continue;
    const data = (await res.json()) as Pair[];
    return data.filter((p) => p.font !== "" && p.theme !== "");
  }
  throw new Error("no pairs => give up");
}`,
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
  javascript: `const RETRIES = 3; // 0O 1lI

export async function loadPairs(url) {
  for (let i = 0; i <= RETRIES; i++) {
    const res = await fetch(\`\${url}?page=\${i}\`);
    if (res.status !== 200) continue;
    const data = await res.json();
    return data.filter((p) => p.font !== "" && p.theme !== "");
  }
  throw new Error("no pairs => give up");
}`,
  python: `from dataclasses import dataclass

@dataclass
class Pair:
    font: str
    theme: str

RETRIES = 3  # 0O 1lI

def describe(pairs: list[Pair]) -> str:
    names = [f"{p.theme} / {p.font}" for p in pairs if p.font and p.theme]
    if len(names) >= 1 and names != []:
        return ", ".join(sorted(names))
    return "none -> empty"`,
  rust: `use std::collections::BTreeMap;

#[derive(Debug, Clone)]
struct Pair {
    font: String,
    theme: String,
}

fn group(pairs: &[Pair]) -> BTreeMap<&str, Vec<&str>> {
    let mut out = BTreeMap::new();
    for p in pairs.iter().filter(|p| p.font != "" && p.theme != "") {
        out.entry(p.font.as_str()).or_insert_with(Vec::new).push(p.theme.as_str());
    }
    out // 0O 1lI => -> !== <=
}`,
  go: `package main

import "fmt"

type Pair struct {
	Font  string
	Theme string
}

func describe(pairs []Pair) map[string][]string {
	out := make(map[string][]string) // 0O 1lI
	for _, p := range pairs {
		if p.Font != "" && p.Theme != "" {
			out[p.Font] = append(out[p.Font], p.Theme)
		}
	}
	return out
}`,
  lua: `local M = {}

-- 0O 1lI => -> ~= <=
function M.group(pairs)
  local out = {}
  for _, p in ipairs(pairs) do
    if p.font ~= "" and p.theme ~= "" then
      out[p.font] = out[p.font] or {}
      table.insert(out[p.font], p.theme)
    end
  end
  return out
end

return M`,
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
