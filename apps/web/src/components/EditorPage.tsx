import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CircleNotch as Loader2,
  DownloadSimple as Download,
  ImageSquare as ImageDown,
  Link as Link2,
  Palette,
  TextAa as Type,
} from "@phosphor-icons/react";
import { Route } from "@/routes/studio";
import { LANGUAGE_IDS, THEMES, highlight, type Highlighted } from "@/lib/highlight";
import { DEFAULTS, type FontFace } from "@/lib/schemas";
import { sampleFor, SAMPLES } from "@/lib/samples";
import { buildSnapshotHtml } from "@/lib/snapshot-html";
import { download, renderPngs } from "@/lib/export";
import { Combobox, type Option } from "@/components/Combobox";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const input =
  "bg-muted border-border text-foreground placeholder:text-muted-foreground h-11 w-full rounded-full border px-4 text-sm disabled:opacity-50";
const panel = "bg-card border-border rounded-xl border p-5";

const NO_FACES: FontFace[] = [];

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

/** Snapshot Studio: make the Snapshot and thumbnail for a Pair from an Open or Free Font and Theme. */
export function EditorPage() {
  const search = Route.useSearch();
  const { font: fontResult, theme: themeResult } = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });

  const fontName = search.font?.trim() || DEFAULTS.font;
  const themeId = search.theme ?? DEFAULTS.theme;
  const lang = search.lang ?? DEFAULTS.lang;
  const themeUrl = search.themeUrl?.trim() ?? "";

  const [fontDraft, setFontDraft] = useState(fontName);
  const [urlDraft, setUrlDraft] = useState(themeUrl);
  const [code, setCode] = useState(() => sampleFor(lang));
  const [title, setTitle] = useState("");
  const [showBar, setShowBar] = useState(true);

  const [srcDoc, setSrcDoc] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "error">("busy");
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<Pick<Highlighted, "themeName">>({ themeName: themeId });
  const [renders, setRenders] = useState<{ png: Blob; thumb: Blob; pngUrl: string; thumbUrl: string } | null>(null);
  const [exporting, setExporting] = useState<"" | "png" | "thumb" | "html">("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const renderGen = useRef(0);
  const lastSample = useRef(sampleFor(lang));

  const setParam = (patch: Partial<typeof search>) =>
    void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false });

  // Stable identity: the preview effect depends on this, so a fresh [] each render would loop.
  const faces = fontResult.ok ? fontResult.data : NO_FACES;
  const customTheme = themeResult && themeResult.ok ? themeResult.data : null;
  const loaderError = [
    !fontResult.ok ? fontResult.error : "",
    themeResult && !themeResult.ok ? themeResult.error : "",
  ]
    .filter(Boolean)
    .join(" ");

  const dCode = useDebounced(code, 250);
  const dTitle = useDebounced(title, 250);

  const displayTheme = customTheme ? meta.themeName : (THEMES.find((t) => t.id === themeId)?.name ?? themeId);
  const label = dTitle || `${fontName} · ${displayTheme}`;

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
        setError(e instanceof Error ? e.message : "Could not highlight that code. Pick another language.");
      });
    return () => {
      cancelled = true;
    };
  }, [dCode, lang, themeId, customTheme, faces, label, showBar]);

  // Rasterise once per render so both images can be shown, and exports reuse them.
  function renderImages() {
    const frame = iframeRef.current;
    if (!frame) return;
    const gen = ++renderGen.current;
    renderPngs(frame)
      .then(({ png, thumb }) => {
        if (gen !== renderGen.current) return;
        setRenders({ png, thumb, pngUrl: URL.createObjectURL(png), thumbUrl: URL.createObjectURL(thumb) });
      })
      .catch(() => {
        if (gen === renderGen.current) setRenders(null);
      });
  }

  useEffect(() => {
    return () => {
      if (renders) {
        URL.revokeObjectURL(renders.pngUrl);
        URL.revokeObjectURL(renders.thumbUrl);
      }
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

  const themeOptions = useMemo<Option[]>(
    () => [
      ...THEMES.filter((t) => t.type === "dark").map((t) => ({ id: t.id, label: t.name, group: "Dark" })),
      ...THEMES.filter((t) => t.type === "light").map((t) => ({ id: t.id, label: t.name, group: "Light" })),
    ],
    [],
  );
  const langOptions = useMemo<Option[]>(
    () => [
      ...Object.keys(SAMPLES).map((id) => ({ id, label: id, group: "With a sample" })),
      ...LANGUAGE_IDS.filter((id) => !(id in SAMPLES)).map((id) => ({ id, label: id, group: "All languages" })),
    ],
    [],
  );

  const baseName = useMemo(() => `${slug(fontName)}--${slug(displayTheme)}`, [fontName, displayTheme]);

  async function exportFile(kind: "png" | "thumb" | "html") {
    setExporting(kind);
    try {
      if (kind === "html") {
        download(new Blob([srcDoc], { type: "text/html" }), `${baseName}.html`);
      } else {
        const frame = iframeRef.current;
        if (!frame) throw new Error("The preview is not ready yet. Wait a moment and try again.");
        const { png, thumb } = renders ?? (await renderPngs(frame));
        if (kind === "png") download(png, `${baseName}.png`);
        else download(thumb, `${baseName}.thumb.png`);
      }
      setError("");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Export failed. Try again.");
    } finally {
      setExporting("");
    }
  }

  const busy = !srcDoc || status !== "idle";
  const [tab, setTab] = useState<"font" | "theme">("font");
  const [rightTab, setRightTab] = useState<"code" | "window">("code");
  const errors = [loaderError, status === "error" ? error : ""].filter(Boolean);
  const exportDisabled = busy || exporting !== "";

  return (
    <main id="main" className="mx-auto w-full max-w-[1600px] p-3 sm:p-4">
      <h1 className="sr-only">Snapshot Studio</h1>
      <div className="grid gap-3 xl:h-[calc(100svh-6rem)] xl:min-h-[40rem] xl:grid-cols-[18.5rem_minmax(0,1fr)_19rem]">
        {/* Left: Font and Theme */}
        <form
          className={cn(panel, "flex min-h-0 min-w-0 flex-col gap-0 p-0")}
          onSubmit={(e) => {
            e.preventDefault();
            setParam({ font: fontDraft.trim() || undefined, themeUrl: urlDraft.trim() || undefined });
          }}
        >
          <div className="px-5 pt-5 pb-4">
            <p className="flex items-center gap-2 text-lg font-medium tracking-tight">
              <Palette className="size-5" aria-hidden /> Snapshot Studio
            </p>
            <p className="text-muted-foreground mt-3 truncate text-sm">{label}</p>
          </div>
          <Tabs
            label="Pair setup"
            value={tab}
            onChange={setTab}
            items={[
              { id: "font", label: "Font" },
              { id: "theme", label: "Theme" },
            ]}
          />
          <div className="border-border mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto border-t px-5 py-5">
            <details open className="border-border bg-muted rounded-xl border p-4 text-sm">
              <summary className="cursor-pointer font-medium">How to make a Snapshot</summary>
              <ol className="text-muted-foreground mt-3 list-decimal space-y-2 ps-5">
                <li>Pick an Open or Free Font and Theme.</li>
                <li>Paste about 18 lines of your own code.</li>
                <li>
                  Save the PNG and the thumbnail. Name the PNG <code className="text-foreground">{baseName}--&lt;editor-id&gt;.png</code>, for
                  example <code className="text-foreground">--vscode</code>.
                </li>
                <li>Add both files to your pull request, with the Pair file.</li>
              </ol>
              <p className="text-muted-foreground mt-3">
                Paid Fonts and Themes cannot be used here. A developer can add a Snapshot of one, made with their own license.
              </p>
            </details>
            {tab === "font" ? (
              <label className="flex flex-col gap-1.5">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <IconChip>
                    <Type className="size-4" aria-hidden />
                  </IconChip>{" "}
                  Family
                </span>
                <input
                  className={input}
                  name="font"
                  value={fontDraft}
                  onChange={(e) => setFontDraft(e.target.value)}
                  onBlur={() => fontDraft.trim() !== fontName && setParam({ font: fontDraft.trim() || undefined })}
                  placeholder="JetBrains Mono"
                  autoComplete="off"
                  spellCheck={false}
                />
                <span className="text-muted-foreground text-xs">Any Fontsource or Google Fonts family. Only Open or Free Fonts.</span>
              </label>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <IconChip>
                      <Palette className="size-4" aria-hidden />
                    </IconChip>{" "}
                    Preset
                  </span>
                  <Combobox
                    label="Theme"
                    value={customTheme ? "" : themeId}
                    options={themeOptions}
                    display={themeUrl ? `Custom (${meta.themeName})` : undefined}
                    disabled={Boolean(themeUrl)}
                    onChange={(id) => setParam({ theme: id })}
                  />
                  {themeUrl ? <span className="text-muted-foreground text-xs">Clear the theme link to pick from the list.</span> : null}
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-2 text-sm font-medium">
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
                    onBlur={() => urlDraft.trim() !== themeUrl && setParam({ themeUrl: urlDraft.trim() || undefined })}
                    placeholder="https://github.com/…/my-theme.json"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <span className="text-muted-foreground text-xs">
                    Raw or GitHub/GitLab link to a VS Code theme JSON. Only Open or Free Themes. Overrides the preset.
                  </span>
                </label>
              </>
            )}
          </div>
          <button type="submit" className="sr-only">
            Apply
          </button>
        </form>

        {/* Center: the Snapshot and thumbnail */}
        <section aria-label="Preview" className="bg-muted border-border relative flex min-h-[28rem] min-w-0 flex-col gap-3 rounded-xl border p-3 sm:p-4">
          {srcDoc ? (
            // Offscreen render source: the Snapshot and thumbnail are rasterised from it.
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

          <div className="bg-card border-border mx-auto flex max-w-full items-center gap-3 rounded-full border py-1.5 pr-1.5 pl-4">
            <span className="text-muted-foreground truncate font-mono text-xs">{baseName}.*</span>
            <Button size="sm" disabled={exportDisabled} onClick={() => exportFile("png")}>
              {exporting === "png" ? <Loader2 className="animate-spin motion-reduce:animate-none" /> : <ImageDown />}
              Save PNG
            </Button>
          </div>

          {errors.map((msg) => (
            <p key={msg} role="alert" className="bg-pastel-red text-pastel-red-text rounded-xl px-4 py-3 text-sm">
              {msg}
            </p>
          ))}

          <div className="flex min-h-0 flex-1 items-center justify-center">
            {renders ? (
              <img
                src={renders.pngUrl}
                alt="Snapshot preview, 1600 by 900"
                className="border-border max-h-full max-w-full rounded-xl border shadow-[var(--shadow-overlay)]"
              />
            ) : (
              <Rendering label="Snapshot" className="aspect-video w-full max-w-2xl rounded-xl" />
            )}
          </div>

          <div className="bg-card border-border mx-auto flex w-full max-w-md items-center gap-3 rounded-xl border p-2">
            {renders ? (
              <img src={renders.thumbUrl} alt="Thumbnail preview, 400 by 225" className="border-border aspect-video w-36 shrink-0 rounded-lg border object-cover" />
            ) : (
              <Rendering label="thumbnail" className="aspect-video w-36 shrink-0 rounded-lg" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Thumbnail</p>
              <p className="text-muted-foreground font-mono text-xs">400×225</p>
            </div>
            <Button size="icon-sm" variant="outline" aria-label="Save thumbnail" disabled={exportDisabled} onClick={() => exportFile("thumb")}>
              {exporting === "thumb" ? <Loader2 className="animate-spin motion-reduce:animate-none" /> : <Download />}
            </Button>
          </div>
        </section>

        {/* Right: code and window */}
        <aside className={cn(panel, "flex min-h-0 min-w-0 flex-col p-0")}>
          <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4">
            <p className="text-lg font-medium tracking-tight">Snippet</p>
            <Button variant="outline" disabled={exportDisabled} onClick={() => exportFile("html")}>
              {exporting === "html" ? <Loader2 className="animate-spin motion-reduce:animate-none" /> : <Download />}
              Export HTML
            </Button>
          </div>
          <Tabs
            label="Snippet settings"
            value={rightTab}
            onChange={setRightTab}
            items={[
              { id: "code", label: "Code" },
              { id: "window", label: "Window" },
            ]}
          />
          <div className="border-border mt-4 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto border-t px-5 py-5">
            {rightTab === "code" ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">Language</span>
                  <Combobox label="Language" value={lang} options={langOptions} onChange={commitLang} />
                </div>
                <label className="flex min-h-0 flex-1 flex-col gap-1.5">
                  <span className="text-sm font-medium">Code</span>
                  <textarea
                    className={cn(input, "min-h-48 flex-1 resize-none rounded-xl py-3 font-mono text-xs leading-relaxed")}
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    wrap="off"
                  />
                  <span className="text-muted-foreground text-xs">About 18 lines and 70 columns keeps text large in 16:9.</span>
                </label>
              </>
            ) : (
              <>
                <label className="flex items-center gap-2.5 text-sm">
                  <input type="checkbox" checked={showBar} onChange={(e) => setShowBar(e.target.checked)} className="size-4" />
                  Show title bar
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">Label</span>
                  <input
                    className={input}
                    name="label"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={`${fontName} · ${displayTheme}`}
                    disabled={!showBar}
                  />
                </label>
              </>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

function IconChip({ children }: { children: React.ReactNode }) {
  return <span className="bg-muted text-muted-foreground inline-flex size-7 items-center justify-center rounded-full">{children}</span>;
}

function Tabs<T extends string>({
  label,
  value,
  onChange,
  items,
}: {
  label: string;
  value: T;
  onChange: (id: T) => void;
  items: { id: T; label: string }[];
}) {
  return (
    <div role="group" aria-label={label} className="bg-muted border-border mx-5 grid grid-flow-col auto-cols-fr gap-1 rounded-full border p-1">
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-pressed={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "h-9 rounded-full text-sm font-medium transition-colors motion-reduce:transition-none",
            value === t.id ? "bg-card text-foreground border-border border" : "text-muted-foreground hover:text-foreground border border-transparent",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Rendering({ label, className }: { label: string; className?: string }) {
  return (
    <div className={cn("bg-muted flex items-center justify-center", className)} role="status">
      <Loader2 className="text-muted-foreground size-5 animate-spin motion-reduce:animate-none" aria-hidden />
      <span className="sr-only">Rendering {label}</span>
    </div>
  );
}
