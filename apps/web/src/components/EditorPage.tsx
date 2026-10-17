import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CircleNotch as Loader2,
  ImageSquare as ImageDown,
  Link as Link2,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import { Route } from "@/routes/studio";
import {
  LANGUAGE_IDS,
  THEMES,
  highlight,
  type Highlighted,
} from "@/lib/highlight";
import { DEFAULTS, type FontFace } from "@/lib/schemas";
import { EDITOR_IDS, EDITOR_LABELS, type EditorId } from "@/lib/pairs";
import { EditorLogo } from "@/components/EditorLogo";
import { zedToVscodeTheme, zedVariants } from "@/lib/zed-theme";
import { sampleFor, SAMPLES } from "@/lib/samples";
import { buildSnapshotHtml } from "@/lib/snapshot-html";
import { download, renderPngs } from "@/lib/export";
import { Combobox, type Option } from "@/components/Combobox";
import { PageHero } from "@/components/PagePattern";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const input =
  "bg-muted border-border text-foreground placeholder:text-muted-foreground h-10 w-full rounded-full border px-4 text-[13px] disabled:opacity-50";
const panel = "bg-card border-border rounded-xl border p-5";

const NO_FACES: FontFace[] = [];

const OTHER = "__other";
const EDITOR_OPTIONS: Option[] = EDITOR_IDS.map((id) => ({
  id,
  label: EDITOR_LABELS[id],
  icon: <EditorLogo id={id} />,
}));
/** Monospace families on Fontsource and Google Fonts. Anything else goes through "Other". */
const FONT_PRESETS = [
  "JetBrains Mono",
  "Fira Code",
  "Geist Mono",
  "Inconsolata",
  "IBM Plex Mono",
  "Source Code Pro",
  "Roboto Mono",
  "Space Mono",
  "Victor Mono",
  "Cascadia Code",
  "DM Mono",
  "Red Hat Mono",
];

const MAX_FONT_FILES = 4;
const MAX_FONT_BYTES = 3_000_000;
const FONT_TYPES: Record<string, { mime: string; format: string }> = {
  woff2: { mime: "font/woff2", format: "woff2" },
  woff: { mime: "font/woff", format: "woff" },
  ttf: { mime: "font/ttf", format: "truetype" },
  otf: { mime: "font/otf", format: "opentype" },
};
const WEIGHTS: [RegExp, number][] = [
  [/thin|hairline/, 100],
  [/extra-?light|ultra-?light/, 200],
  [/light/, 300],
  [/medium/, 500],
  [/semi-?bold|demi-?bold/, 600],
  [/extra-?bold|ultra-?bold/, 800],
  [/black|heavy/, 900],
  [/bold/, 700],
];

/** Weight and style come from the file name, the way font files are usually named. */

function faceMeta(fileName: string): Pick<FontFace, "weight" | "style"> {
  const n = fileName.toLowerCase();
  return {
    weight: WEIGHTS.find(([re]) => re.test(n))?.[1] ?? 400,
    style: /italic|oblique/.test(n) ? "italic" : "normal",
  };
}

/** "Input-Regular_(InputMono-Regular).ttf" becomes "Input". */
function familyFromFile(fileName: string): string {
  const base = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/\(.*\)/, "")
    .replace(/[-_ ]+$/, "");
  return (
    base
      .replace(
        /[-_ ]?(thin|extra-?light|light|regular|medium|semi-?bold|bold|extra-?bold|black|italic|oblique)+$/i,
        "",
      )
      .replace(/[-_]+$/, "")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .trim() || base
  );
}

function readFace(file: File): Promise<FontFace> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const type = FONT_TYPES[ext];
  if (!type)
    return Promise.reject(
      new Error(`${file.name} is not a .woff2, .woff, .ttf or .otf file.`),
    );
  if (file.size > MAX_FONT_BYTES)
    return Promise.reject(new Error(`${file.name} is over 3 MB.`));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.onload = () =>
      resolve({
        ...faceMeta(file.name),
        ...type,
        base64: String(reader.result).split(",")[1] ?? "",
      });
    reader.readAsDataURL(file);
  });
}

/** Snapshot Studio: make the Snapshot for a Pair from an Open or Free Font and Theme. */
export function EditorPage() {
  const search = Route.useSearch();
  const { font: fontResult, theme: themeResult } = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });

  const fontName = search.font?.trim() || DEFAULTS.font;
  const themeId = search.theme ?? DEFAULTS.theme;
  const lang = search.lang ?? DEFAULTS.lang;
  const themeUrl = search.themeUrl?.trim() ?? "";
  const editor: EditorId = search.editor ?? "vscode";
  // Presets are VS Code themes, so a Zed theme always comes from a link.
  const linkOnly = editor === "zed";

  const [fontDraft, setFontDraft] = useState(fontName);
  const [fontOther, setFontOther] = useState(
    () => !FONT_PRESETS.includes(fontName),
  );
  const [themeOther, setThemeOther] = useState(Boolean(themeUrl));
  const showLink = linkOnly || themeOther;
  const [custom, setCustom] = useState<{
    name: string;
    faces: FontFace[];
    files: string[];
  } | null>(null);
  const [fontFileError, setFontFileError] = useState("");
  const fontFileRef = useRef<HTMLInputElement>(null);
  const [urlDraft, setUrlDraft] = useState(themeUrl);
  const [code, setCode] = useState(() => sampleFor(lang));

  const [srcDoc, setSrcDoc] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "error">("busy");
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<Pick<Highlighted, "themeName">>({
    themeName: themeId,
  });
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [exporting, setExporting] = useState<"" | "png">("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastSample = useRef(sampleFor(lang));

  const setParam = (patch: Partial<typeof search>) =>
    void navigate({
      search: (prev) => ({ ...prev, ...patch }),
      replace: true,
      resetScroll: false,
    });

  // Stable identity: the preview effect depends on this, so a fresh [] each render would loop.
  const faces = custom
    ? custom.faces
    : fontResult.ok
      ? fontResult.data
      : NO_FACES;
  const displayFont = custom?.name.trim() || fontName;
  const themeData = themeResult && themeResult.ok ? themeResult.data : null;
  // A Zed file holds a family of themes; the rest are already in the shape Shiki reads.
  const zedFamily = themeData && editor === "zed" ? themeData : null;
  const variants = useMemo(
    () => (zedFamily ? zedVariants(zedFamily) : []),
    [zedFamily],
  );
  const variant = variants.includes(search.themeVariant ?? "")
    ? search.themeVariant!
    : variants[0];
  // Stable identity: the preview effect depends on this.
  const customTheme = useMemo(
    () => (zedFamily ? zedToVscodeTheme(zedFamily, variant) : themeData),
    [zedFamily, themeData, variant],
  );
  const loaderError = [
    !custom && !fontResult.ok ? fontResult.error : "",
    themeResult && !themeResult.ok ? themeResult.error : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Typing is colored after a pause; a swapped sample is colored at once (see commitLang).
  const [hCode, setHCode] = useState(code);
  useEffect(() => {
    const id = setTimeout(() => setHCode(code), 250);
    return () => clearTimeout(id);
  }, [code]);

  const displayTheme = customTheme
    ? meta.themeName
    : (THEMES.find((t) => t.id === themeId)?.name ?? themeId);
  const label = `${displayFont} · ${displayTheme}`;

  useEffect(() => {
    let cancelled = false;
    setStatus("busy");
    highlight({ code: hCode, lang, themeId, customTheme })
      .then((h) => {
        if (cancelled) return;
        setMeta({ themeName: h.themeName });
        setSrcDoc(
          buildSnapshotHtml({
            ...h,
            faces,
            label,
            lang,
          }),
        );
        setStatus("idle");
        setError("");
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setStatus("error");
        setError(
          e instanceof Error
            ? e.message
            : "Could not highlight that code. Pick another language.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [hCode, lang, themeId, customTheme, faces, label]);

  function commitLang(next: string) {
    const id = next.trim().toLowerCase();
    if (!id) return;
    setParam({ lang: id });
    // Swap the sample only if the visitor has not edited the current one.
    if (code === lastSample.current) {
      const s = sampleFor(id);
      // A swapped sample is not typing, so it skips the pause.
      setCode(s);
      setHCode(s);
      lastSample.current = s;
    }
  }

  const fontOptions = useMemo<Option[]>(
    () => [
      ...FONT_PRESETS.map((f) => ({ id: f, label: f, group: "Fonts" })),
      { id: OTHER, label: "Other", group: "Your own" },
    ],
    [],
  );
  const themeOptions = useMemo<Option[]>(
    () => [
      ...THEMES.filter((t) => t.type === "dark").map((t) => ({
        id: t.id,
        label: t.name,
        group: "Dark",
      })),
      ...THEMES.filter((t) => t.type === "light").map((t) => ({
        id: t.id,
        label: t.name,
        group: "Light",
      })),
      { id: OTHER, label: "Other", group: "Your own" },
    ],
    [],
  );
  const langOptions = useMemo<Option[]>(
    () => [
      ...Object.keys(SAMPLES).map((id) => ({
        id,
        label: id,
        group: "With a sample",
      })),
      ...LANGUAGE_IDS.filter((id) => !(id in SAMPLES)).map((id) => ({
        id,
        label: id,
        group: "All languages",
      })),
    ],
    [],
  );

  const baseName = useMemo(
    () => `${slug(displayFont)}--${slug(displayTheme)}`,
    [displayFont, displayTheme],
  );

  async function savePng() {
    setExporting("png");
    try {
      const frame = iframeRef.current;
      if (!frame)
        throw new Error(
          "The preview is not ready yet. Wait a moment and try again.",
        );
      const { png } = await renderPngs(frame);
      download(png, `${baseName}.png`);
      setError("");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Export failed. Try again.");
    } finally {
      setExporting("");
    }
  }

  async function onFontFiles(list: FileList | null) {
    const files = Array.from(list ?? []).slice(0, MAX_FONT_FILES);
    if (files.length === 0) return;
    try {
      const faces = await Promise.all(files.map(readFace));
      // A name typed into "Family name" names the uploaded font.
      const typed = fontDraft.trim();
      setCustom({
        name:
          typed && !FONT_PRESETS.includes(typed)
            ? typed
            : familyFromFile(files[0]!.name),
        faces,
        files: files.map((f) => f.name),
      });
      setFontFileError("");
    } catch (e) {
      setFontFileError(
        e instanceof Error ? e.message : "Could not read that font file.",
      );
    }
    if (fontFileRef.current) fontFileRef.current.value = "";
  }

  // A pause in typing is still ahead of the colors: wait for them before the PNG is made.
  const busy = !srcDoc || status !== "idle" || code !== hCode;
  const errors = [loaderError, status === "error" ? error : ""].filter(Boolean);
  const exportDisabled = busy || exporting !== "";

  return (
    <main id="main">
      <PageHero variant="studio" className="pt-8 pb-8 sm:pt-8 sm:pb-10">
        <header>
          <h1>Snapshot Studio</h1>
          <p className="text-muted-foreground mt-3 max-w-[60ch] text-lg">
            See your own code in any font and theme.
          </p>
        </header>
      </PageHero>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        <div className="grid gap-4 xl:grid-cols-[22rem_minmax(0,1fr)] xl:items-start">
          {/* Left: every setting */}
          <form
            className={cn(
              panel,
              // z-10 keeps the open lists above the page content that follows, such as the footer.
              "relative z-10 flex min-w-0 flex-col gap-0 p-0 xl:sticky xl:top-20",
            )}
            onSubmit={(e) => {
              e.preventDefault();
              setParam({
                font: fontDraft.trim() || undefined,
                themeUrl: urlDraft.trim() || undefined,
              });
            }}
          >
            <div className="grid items-start gap-x-4 gap-y-4 p-4 sm:grid-cols-2 xl:grid-cols-1">
              <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
                <legend className="mb-2 text-sm font-medium">Editor</legend>
                <Combobox
                  label="Editor"
                  value={editor}
                  options={EDITOR_OPTIONS}
                  onChange={(id) => {
                    if (id === editor) return;
                    setThemeOther(false);
                    setUrlDraft("");
                    setParam({
                      editor: id as EditorId,
                      themeUrl: undefined,
                      themeVariant: undefined,
                    });
                  }}
                />
              </fieldset>

              <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
                <legend className="mb-2 text-sm font-medium">
                  Font family
                </legend>
                <div className="flex flex-col gap-1.5">
                  <Combobox
                    label="Font"
                    value={fontOther ? OTHER : fontName}
                    options={fontOptions}
                    display={
                      fontOther
                        ? custom
                          ? `Other (${custom.name.trim() || "your font"})`
                          : "Other"
                        : undefined
                    }
                    onChange={(id) => {
                      if (id === OTHER) {
                        setFontOther(true);
                        return;
                      }
                      setFontOther(false);
                      setCustom(null);
                      setFontFileError("");
                      setFontDraft(id);
                      setParam({ font: id });
                    }}
                  />
                </div>
                {fontOther ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <IconChip>
                          <UploadSimple className="size-4" aria-hidden />
                        </IconChip>{" "}
                        Your own font
                      </span>
                      <input
                        ref={fontFileRef}
                        type="file"
                        accept=".woff2,.woff,.ttf,.otf"
                        multiple
                        className="hidden"
                        tabIndex={-1}
                        aria-hidden
                        onChange={(e) => void onFontFiles(e.target.files)}
                      />
                      {custom ? (
                        <div className="bg-muted border-border flex items-center justify-between gap-3 rounded-full border py-1.5 ps-4 pe-1.5 text-sm">
                          <span className="flex min-w-0 flex-1 items-center gap-2">
                            <input
                              aria-label="Name shown on the Snapshot"
                              value={custom.name}
                              onChange={(e) =>
                                setCustom({ ...custom, name: e.target.value })
                              }
                              className="min-w-0 flex-1 bg-transparent font-medium outline-none"
                            />
                            <span className="text-muted-foreground shrink-0">
                              {custom.files.length}{" "}
                              {custom.files.length === 1 ? "file" : "files"}
                            </span>
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCustom(null);
                              setFontFileError("");
                            }}
                          >
                            <X aria-hidden />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fontFileRef.current?.click()}
                        >
                          <UploadSimple aria-hidden />
                          Choose font files
                        </Button>
                      )}
                      {fontFileError ? (
                        <span
                          role="alert"
                          className="text-pastel-red-text text-xs"
                        >
                          {fontFileError}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">
                          .woff2, .woff, .ttf or .otf, up to 4 files of 3 MB.
                          Add regular, bold and italic together for a full
                          family. We don't keep your files: they stay in your
                          browser.
                        </span>
                      )}
                    </div>
                  </>
                ) : null}
              </fieldset>
              <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
                <legend className="mb-2 text-sm font-medium">
                  {linkOnly ? "Theme" : "Theme preset"}
                </legend>
                {linkOnly ? null : (
                  <div className="flex flex-col gap-1.5">
                    <Combobox
                      label="Theme"
                      value={themeOther ? OTHER : themeId}
                      options={themeOptions}
                      display={
                        themeOther && themeUrl
                          ? `Other (${meta.themeName})`
                          : undefined
                      }
                      onChange={(id) => {
                        if (id === OTHER) {
                          setThemeOther(true);
                          return;
                        }
                        setThemeOther(false);
                        setUrlDraft("");
                        setParam({
                          theme: id,
                          themeUrl: undefined,
                          themeVariant: undefined,
                        });
                      }}
                    />
                  </div>
                )}
                {showLink ? (
                  <>
                    <label className="flex flex-col gap-1.5">
                      <span className="flex items-center gap-2 text-[13px] font-medium">
                        <IconChip>
                          <Link2 className="size-4" aria-hidden />
                        </IconChip>{" "}
                        Theme link
                      </span>
                      <input
                        className={input}
                        name="themeUrl"
                        value={urlDraft}
                        onChange={(e) => setUrlDraft(e.target.value)}
                        onBlur={() =>
                          urlDraft.trim() !== themeUrl &&
                          setParam({
                            themeUrl: urlDraft.trim() || undefined,
                            themeVariant: undefined,
                          })
                        }
                        placeholder="https://github.com/…/my-theme.json"
                        autoComplete="off"
                        spellCheck={false}
                      />
                      <span className="text-muted-foreground text-[11px]">
                        {editor === "zed"
                          ? "Raw or GitHub/GitLab link to a Zed theme JSON."
                          : "Raw or GitHub/GitLab link to a VS Code theme JSON."}
                      </span>
                    </label>
                    {variants.length > 1 ? (
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[13px] font-medium">
                          Theme in this file
                        </span>
                        <Combobox
                          label="Zed theme"
                          value={variant ?? ""}
                          options={variants.map((v) => ({ id: v, label: v }))}
                          onChange={(id) => setParam({ themeVariant: id })}
                        />
                      </div>
                    ) : null}
                  </>
                ) : null}
              </fieldset>
              <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
                <legend className="mb-2 text-sm font-medium">
                  Code language
                </legend>
                <div className="flex flex-col gap-1.5">
                  <Combobox
                    label="Language"
                    value={lang}
                    options={langOptions}
                    onChange={commitLang}
                  />
                </div>
              </fieldset>
            </div>
            <button type="submit" className="sr-only">
              Apply
            </button>
          </form>

          {/* Right: the live window */}
          <section
            aria-label="Preview"
            className="bg-muted border-border relative flex min-w-0 flex-col gap-3 rounded-xl border p-3 sm:p-4 xl:sticky xl:top-20"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                role="tablist"
                aria-label="Editor view"
                className="bg-card border-border inline-flex gap-1 rounded-full border p-1"
                onKeyDown={(e) => {
                  if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
                  e.preventDefault();
                  const next = tab === "preview" ? "code" : "preview";
                  setTab(next);
                  document.getElementById(`studio-tab-${next}`)?.focus();
                }}
              >
                {(
                  [
                    ["preview", "Preview"],
                    ["code", "Code"],
                  ] as const
                ).map(([id, text]) => (
                  <button
                    key={id}
                    id={`studio-tab-${id}`}
                    type="button"
                    role="tab"
                    aria-selected={tab === id}
                    aria-controls="studio-panel"
                    tabIndex={tab === id ? 0 : -1}
                    onClick={() => setTab(id)}
                    className={cn(
                      "h-8 rounded-full px-4 text-sm font-medium transition-colors duration-150",
                      tab === id
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {text}
                  </button>
                ))}
              </div>
              <Button size="sm" disabled={exportDisabled} onClick={savePng}>
                {exporting === "png" ? (
                  <Loader2 className="animate-spin motion-reduce:animate-none" />
                ) : (
                  <ImageDown />
                )}
                Save PNG
              </Button>
            </div>

            {errors.map((msg) => (
              <p
                key={msg}
                role="alert"
                className="bg-pastel-red text-pastel-red-text rounded-xl px-4 py-3 text-sm"
              >
                {msg}
              </p>
            ))}

            <div
              id="studio-panel"
              role="tabpanel"
              aria-labelledby={`studio-tab-${tab}`}
              className="border-border relative aspect-video w-full overflow-hidden rounded-xl border shadow-[var(--shadow-overlay)]"
            >
              {srcDoc ? (
                // Kept on screen, only hidden, so the window is measured and ready for Save PNG while you write.
                <iframe
                  ref={iframeRef}
                  title="Snapshot preview"
                  srcDoc={srcDoc}
                  sandbox="allow-scripts allow-same-origin"
                  className={cn(
                    "absolute inset-0 size-full border-0",
                    tab === "code" && "invisible",
                  )}
                />
              ) : (
                <Rendering label="Snapshot" className="size-full" />
              )}
              {tab === "code" ? (
                <textarea
                  aria-label="Code"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste or write your code here"
                  spellCheck={false}
                  wrap="off"
                  autoFocus
                  className="bg-card text-foreground placeholder:text-muted-foreground absolute inset-0 size-full resize-none border-0 p-5 font-mono text-sm leading-relaxed outline-none"
                />
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function IconChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-muted text-muted-foreground inline-flex size-7 items-center justify-center rounded-full">
      {children}
    </span>
  );
}

function Rendering({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn("bg-muted flex items-center justify-center", className)}
      role="status"
    >
      <Loader2
        className="text-muted-foreground size-5 animate-spin motion-reduce:animate-none"
        aria-hidden
      />
      <span className="sr-only">Rendering {label}</span>
    </div>
  );
}
