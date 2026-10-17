/** Zed syntax key to the TextMate scopes Shiki matches. General keys come first. */
const SYNTAX_SCOPES: Record<string, string[]> = {
  attribute: ["entity.other.attribute-name", "meta.attribute"],
  boolean: ["constant.language.boolean", "constant.language"],
  comment: ["comment"],
  "comment.doc": ["comment.block.documentation", "comment.block.javadoc"],
  constant: ["constant", "variable.other.constant"],
  constructor: ["entity.name.function.constructor"],
  embedded: ["meta.embedded"],
  emphasis: ["markup.italic"],
  "emphasis.strong": ["markup.bold"],
  enum: ["entity.name.type.enum"],
  function: ["entity.name.function", "support.function", "meta.function-call"],
  keyword: ["keyword", "storage", "storage.type", "storage.modifier"],
  label: ["entity.name.label"],
  link_text: ["string.other.link", "markup.underline.link"],
  link_uri: ["markup.underline.link"],
  number: ["constant.numeric"],
  operator: ["keyword.operator"],
  preproc: ["meta.preprocessor", "keyword.control.directive"],
  property: ["variable.other.property", "variable.other.object.property", "support.type.property-name", "meta.object-literal.key"],
  punctuation: ["punctuation"],
  "punctuation.bracket": ["meta.brace", "punctuation.section"],
  "punctuation.delimiter": ["punctuation.separator", "punctuation.terminator"],
  "punctuation.special": ["punctuation.definition.template-expression", "punctuation.definition.interpolation"],
  string: ["string"],
  "string.escape": ["constant.character.escape"],
  "string.regex": ["string.regexp"],
  "string.special": ["string.other"],
  "string.special.symbol": ["constant.other.symbol"],
  tag: ["entity.name.tag"],
  "text.literal": ["markup.inline.raw"],
  title: ["markup.heading", "entity.name.section"],
  type: ["entity.name.type", "entity.name.class", "support.type", "support.class"],
  variable: ["variable"],
  "variable.special": ["variable.language"],
  variant: ["variable.other.enummember"],
};

/** Zed UI key to the VS Code color key the app reads. */
const COLOR_KEYS: Record<string, string> = {
  "editor.background": "editor.background",
  "editor.foreground": "editor.foreground",
  "editor.line_number": "editorLineNumber.foreground",
  "editor.active_line_number": "editorLineNumber.activeForeground",
  "editor.active_line.background": "editor.lineHighlightBackground",
  "editor.indent_guide": "editorIndentGuide.background",
  "tab_bar.background": "editorGroupHeader.tabsBackground",
  "tab.active_background": "tab.activeBackground",
  "tab.inactive_background": "tab.inactiveBackground",
  "title_bar.background": "titleBar.activeBackground",
  "status_bar.background": "statusBar.background",
  "panel.background": "sideBar.background",
  border: "panel.border",
  text: "foreground",
};

type Rec = Record<string, unknown>;
const isRec = (v: unknown): v is Rec => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown) => (typeof v === "string" ? v : undefined);

export function zedVariants(family: Rec): string[] {
  return (family.themes as Rec[]).map((t) => String(t.name));
}

/** Turn one theme of a Zed theme family into a VS Code theme, which is what Shiki reads. Falls back to the first. */
export function zedToVscodeTheme(family: Rec, variant?: string): Rec {
  const themes = family.themes as Rec[];
  const entry = themes.find((t) => t.name === variant) ?? themes[0]!;
  const style = entry.style as Rec;

  const colors: Record<string, string> = {};
  for (const [from, to] of Object.entries(COLOR_KEYS)) {
    const v = str(style[from]);
    if (v) colors[to] = v;
  }
  colors["editor.foreground"] ??= str(style.text) ?? "#ffffff";
  const player = Array.isArray(style.players) && isRec(style.players[0]) ? style.players[0] : {};
  if (str(player.cursor)) colors["editorCursor.foreground"] = player.cursor as string;
  if (str(player.selection)) colors["editor.selectionBackground"] = player.selection as string;

  const tokenColors: Rec[] = [];
  const syntax = isRec(style.syntax) ? style.syntax : {};
  for (const [key, scope] of Object.entries(SYNTAX_SCOPES)) {
    const s = syntax[key];
    if (!isRec(s)) continue;
    const settings: Record<string, string> = {};
    if (str(s.color)) settings.foreground = s.color as string;
    const fontStyle = [
      s.font_style === "italic" && "italic",
      typeof s.font_weight === "number" && s.font_weight >= 600 && "bold",
    ].filter(Boolean);
    if (fontStyle.length) settings.fontStyle = fontStyle.join(" ");
    if (Object.keys(settings).length) tokenColors.push({ name: key, scope, settings });
  }

  return {
    name: str(entry.name) ?? str(family.name) ?? "zed-theme",
    type: entry.appearance === "light" ? "light" : "dark",
    colors,
    tokenColors,
  };
}
