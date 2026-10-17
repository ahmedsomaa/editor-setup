import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CaretDown,
  CircleNotch as Loader2,
  DownloadSimple as Download,
  ImageSquare as ImageDown,
  Link as Link2,
  Question,
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
import { DEFAULTS, type FontFace, type ThemeEditor } from "@/lib/schemas";
import { sampleFor, SAMPLES } from "@/lib/samples";
import { buildSnapshotHtml } from "@/lib/snapshot-html";
import { download, renderPngs } from "@/lib/export";
import { Combobox, type Option } from "@/components/Combobox";
import { PageHero } from "@/components/PagePattern";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
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
const THEME_EDITOR_OPTIONS: Option[] = [
  { id: "vscode", label: "VS Code" },
  { id: "cursor", label: "Cursor" },
];
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

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
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
  const themeEditor = search.themeEditor;

  const [fontDraft, setFontDraft] = useState(fontName);
  const [fontOther, setFontOther] = useState(
    () => !FONT_PRESETS.includes(fontName),
  );
  const [themeOther, setThemeOther] = useState(
    Boolean(themeUrl || themeEditor),
  );
  const [custom, setCustom] = useState<{
    name: string;
    faces: FontFace[];
    files: string[];
  } | null>(null);
  const [fontFileError, setFontFileError] = useState("");
  const fontFileRef = useRef<HTMLInputElement>(null);
  const [urlDraft, setUrlDraft] = useState(themeUrl);
  const [code, setCode] = useState(() => sampleFor(lang));
  const [title, setTitle] = useState("");
  const [showBar, setShowBar] = useState(true);

  const [srcDoc, setSrcDoc] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "error">("busy");
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<Pick<Highlighted, "themeName">>({
    themeName: themeId,
  });
  const [renders, setRenders] = useState<{ png: Blob; pngUrl: string } | null>(
    null,
  );
  const [exporting, setExporting] = useState<"" | "png" | "html">("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const renderGen = useRef(0);
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
  const customTheme = themeResult && themeResult.ok ? themeResult.data : null;
  const loaderError = [
    !custom && !fontResult.ok ? fontResult.error : "",
    themeResult && !themeResult.ok ? themeResult.error : "",
  ]
    .filter(Boolean)
    .join(" ");

  const dCode = useDebounced(code, 250);
  const dTitle = useDebounced(title, 250);

  const displayTheme = customTheme
    ? meta.themeName
    : (THEMES.find((t) => t.id === themeId)?.name ?? themeId);
  const label = dTitle || `${displayFont} · ${displayTheme}`;

  useEffect(() => {
    let cancelled = false;
    setStatus("busy");
    highlight({ code: dCode, lang, themeId, customTheme })
      .then((h) => {
        if (cancelled) return;
        setMeta({ themeName: h.themeName });
        setSrcDoc(buildSnapshotHtml({ ...h, faces, label, showBar }));
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
  }, [dCode, lang, themeId, customTheme, faces, label, showBar]);

  // Rasterise once per render so the image can be shown, and exports reuse it.
  function renderImages() {
    const frame = iframeRef.current;
    if (!frame) return;
    const gen = ++renderGen.current;
    renderPngs(frame)
      .then(({ png }) => {
        if (gen !== renderGen.current) return;
        setRenders({ png, pngUrl: URL.createObjectURL(png) });
      })
      .catch(() => {
        if (gen === renderGen.current) setRenders(null);
      });
  }

  useEffect(() => {
    return () => {
      if (renders) URL.revokeObjectURL(renders.pngUrl);
    };
  }, [renders]);

  function commitLang(next: string) {
    const id = next.trim().toLowerCase();
    if (!id) return;
    setParam({ lang: id });
    // Swap the sample only if the visitor has not edited the current one.
    if (code === lastSample.current) {
      const s = sampleFor(id);
      setCode(s);
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

  async function exportFile(kind: "png" | "html") {
    setExporting(kind);
    try {
      if (kind === "html") {
        download(new Blob([srcDoc], { type: "text/html" }), `${baseName}.html`);
      } else {
        const frame = iframeRef.current;
        if (!frame)
          throw new Error(
            "The preview is not ready yet. Wait a moment and try again.",
          );
        const { png } = renders ?? (await renderPngs(frame));
        download(png, `${baseName}.png`);
      }
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

  const busy = !srcDoc || status !== "idle";
  const errors = [loaderError, status === "error" ? error : ""].filter(Boolean);
  const exportDisabled = busy || exporting !== "";

  return (
    <main id="main">
      <PageHero variant="studio" className="pb-4 sm:pb-6">
        <header>
          <div className="flex items-center gap-2">
            <h1>Snapshot Studio</h1>
            <Popover>
              <PopoverTrigger aria-label="How to make a Snapshot">
                <Question weight="bold" aria-hidden />
              </PopoverTrigger>
              <PopoverContent align="start">
                <PopoverTitle className="font-sans text-base font-medium tracking-normal">
                  How to make a Snapshot
                </PopoverTitle>
                <ol className="text-muted-foreground mt-3 list-decimal space-y-2 ps-5">
                  <li>
                    Pick a Font and a Theme, or upload your own Font file.
                  </li>
                  <li>Paste about 18 lines of your own code.</li>
                  <li>
                    Save the PNG. Name it{" "}
                    <code className="text-foreground">
                      {baseName}--&lt;editor-id&gt;.png
                    </code>
                    , for example{" "}
                    <code className="text-foreground">--vscode</code>.
                  </li>
                  <li>Add the PNG to your pull request, with the Pair file.</li>
                </ol>
                <p className="text-muted-foreground mt-3">
                  Only Open and Free Fonts and Themes can be picked from the
                  lists. If you own the license to a Paid Font, upload its file
                  and make the Snapshot yourself.
                </p>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-muted-foreground mt-6 max-w-[60ch] text-lg">
            Make a 1600×900 Snapshot of any Font and Theme, then save it as a
            PNG.
          </p>
        </header>
      </PageHero>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        <div className="mt-4 grid gap-4 xl:grid-cols-[22rem_minmax(0,1fr)] xl:items-start">
          {/* Left: every setting */}
          <form
            className={cn(panel, "flex min-w-0 flex-col gap-0 p-0")}
            onSubmit={(e) => {
              e.preventDefault();
              setParam({
                font: fontDraft.trim() || undefined,
                themeUrl: urlDraft.trim() || undefined,
              });
            }}
          >
            <div className="flex flex-col gap-5 px-4 py-4">
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
                  Theme preset
                </legend>
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
                        themeEditor: undefined,
                      });
                    }}
                  />
                </div>
                {themeOther ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[13px] font-medium">
                        Editor the theme is for
                      </span>
                      <Combobox
                        label="Theme editor"
                        value={themeEditor ?? ""}
                        options={THEME_EDITOR_OPTIONS}
                        placeholder="Choose an Editor"
                        onChange={(id) => {
                          setUrlDraft("");
                          setParam({
                            themeEditor: id as ThemeEditor,
                            themeUrl: undefined,
                          });
                        }}
                      />
                    </div>
                    {themeEditor ? (
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
                            setParam({ themeUrl: urlDraft.trim() || undefined })
                          }
                          placeholder="https://github.com/…/my-theme.json"
                          autoComplete="off"
                          spellCheck={false}
                        />
                        <span className="text-muted-foreground text-[11px]">
                          Raw or GitHub/GitLab link to a VS Code theme JSON.
                          Cursor uses the same files.
                        </span>
                      </label>
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
                <label className="flex flex-col gap-1.5">
                  <span className="sr-only">Code</span>
                  <textarea
                    className={cn(
                      input,
                      "h-44 resize-y rounded-xl py-2.5 font-mono text-[11px] leading-relaxed",
                    )}
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    wrap="off"
                  />
                </label>
              </fieldset>

              <Collapsible className="min-w-0">
                <CollapsibleTrigger>
                  <span className="text-sm font-medium">
                    Window{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </span>
                  <CaretDown
                    aria-hidden
                    className="text-muted-foreground size-4 shrink-0 transition-transform duration-200 group-data-[panel-open]:rotate-180 motion-reduce:transition-none"
                  />
                </CollapsibleTrigger>
                <CollapsiblePanel>
                  <div className="flex flex-col gap-3 pt-3">
                    <label className="flex items-center gap-2.5 text-[13px]">
                      <input
                        type="checkbox"
                        checked={showBar}
                        onChange={(e) => setShowBar(e.target.checked)}
                        className="size-4"
                      />
                      Show title bar
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[13px] font-medium">Label</span>
                      <input
                        className={input}
                        name="label"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={`${displayFont} · ${displayTheme}`}
                        disabled={!showBar}
                      />
                    </label>
                  </div>
                </CollapsiblePanel>
              </Collapsible>
            </div>
            <button type="submit" className="sr-only">
              Apply
            </button>
          </form>

          {/* Right: the Snapshot */}
          <section
            aria-label="Preview"
            className="bg-muted border-border relative flex min-w-0 flex-col gap-3 rounded-xl border p-3 sm:p-4 xl:sticky xl:top-24"
          >
            {srcDoc ? (
              // Offscreen render source: the Snapshot is rasterised from it.
              <iframe
                ref={iframeRef}
                title="Snapshot render source"
                srcDoc={srcDoc}
                onLoad={renderImages}
                sandbox="allow-scripts allow-same-origin"
                aria-hidden
                tabIndex={-1}
                className="pointer-events-none fixed top-0 -left-[9999px] h-[900px] w-[1600px] border-0"
              />
            ) : null}

            <div className="bg-card border-border flex max-w-full items-center justify-between gap-3 rounded-full border py-1.5 pr-1.5 pl-4">
              <span className="text-muted-foreground min-w-0 truncate font-mono text-xs">
                {baseName}.png
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={exportDisabled}
                  onClick={() => exportFile("html")}
                >
                  {exporting === "html" ? (
                    <Loader2 className="animate-spin motion-reduce:animate-none" />
                  ) : (
                    <Download />
                  )}
                  Export HTML
                </Button>
                <Button
                  size="sm"
                  disabled={exportDisabled}
                  onClick={() => exportFile("png")}
                >
                  {exporting === "png" ? (
                    <Loader2 className="animate-spin motion-reduce:animate-none" />
                  ) : (
                    <ImageDown />
                  )}
                  Save PNG
                </Button>
              </div>
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

            <div className="flex items-center justify-center">
              {renders ? (
                <img
                  src={renders.pngUrl}
                  alt="Snapshot preview, 1600 by 900"
                  className="border-border max-h-full max-w-full rounded-xl border shadow-[var(--shadow-overlay)]"
                />
              ) : (
                <Rendering
                  label="Snapshot"
                  className="aspect-video w-full max-w-3xl rounded-xl"
                />
              )}
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
