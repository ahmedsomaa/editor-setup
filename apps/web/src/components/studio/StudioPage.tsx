import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "cn";
import { Route } from "@/routes/studio";
import { Combobox } from "@/components/common/Combobox";
import { PageHero } from "@/components/layout/PagePattern";
import { THEMES, highlight, type Highlighted } from "@/lib/theme/highlight";
import { DEFAULTS, type FontFace } from "@/lib/studio/schemas";
import type { EditorId } from "@/lib/registry/pairs";
import { zedToVscodeTheme, zedVariants } from "@/lib/theme/zed-theme";
import { sampleFor } from "@/lib/studio/samples";
import { buildSnapshotHtml } from "@/lib/theme/snapshot-html";
import { download, renderPngs } from "@/lib/studio/export";
import { Field } from "./Field";
import { FontField } from "./FontField";
import { PreviewPanel, type StudioTab } from "./PreviewPanel";
import { ThemeField } from "./ThemeField";
import { EDITOR_OPTIONS, LANG_OPTIONS } from "./options";
import type { CustomFont, SetParam } from "./types";

const NO_FACES: FontFace[] = [];

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Snapshot Studio: make the Snapshot for a Pair from an Open or Free Font and Theme. */
export function StudioPage() {
  const search = Route.useSearch();
  const { font: fontResult, theme: themeResult } = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });

  const fontName = search.font?.trim() || DEFAULTS.font;
  const themeId = search.theme ?? DEFAULTS.theme;
  const lang = search.lang ?? DEFAULTS.lang;
  const themeUrl = search.themeUrl?.trim() ?? "";
  const editor: EditorId = search.editor ?? "vscode";

  const [fontDraft, setFontDraft] = useState(fontName);
  const [custom, setCustom] = useState<CustomFont | null>(null);
  const [themeOther, setThemeOther] = useState(Boolean(themeUrl));
  const [urlDraft, setUrlDraft] = useState(themeUrl);
  const [code, setCode] = useState(() => sampleFor(lang));

  const [srcDoc, setSrcDoc] = useState("");
  const [status, setStatus] = useState<"idle" | "busy" | "error">("busy");
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<Pick<Highlighted, "themeName">>({
    themeName: themeId,
  });
  const [tab, setTab] = useState<StudioTab>("preview");
  const [exporting, setExporting] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastSample = useRef(sampleFor(lang));

  const setParam: SetParam = (patch) =>
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
        setSrcDoc(buildSnapshotHtml({ ...h, faces, label, lang }));
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

  async function savePng() {
    setExporting(true);
    try {
      const frame = iframeRef.current;
      if (!frame)
        throw new Error(
          "The preview is not ready yet. Wait a moment and try again.",
        );
      const { png } = await renderPngs(frame);
      download(png, `${slug(displayFont)}--${slug(displayTheme)}.png`);
      setError("");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Export failed. Try again.");
    } finally {
      setExporting(false);
    }
  }

  // A pause in typing is still ahead of the colors: wait for them before the PNG is made.
  const busy = !srcDoc || status !== "idle" || code !== hCode;
  const errors = [loaderError, status === "error" ? error : ""].filter(Boolean);

  return (
    <main id="main">
      <PageHero variant="studio" className="pt-8 pb-8 sm:pt-8 sm:pb-10">
        <header>
          <h1>Snapshot Studio</h1>
          <p className="text-muted-foreground mt-3 max-w-[60ch] text-lg">
            See your own code in any open or free font and theme.
          </p>
        </header>
      </PageHero>
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:pb-24">
        <div className="grid gap-4 xl:grid-cols-[22rem_minmax(0,1fr)] xl:items-start">
          {/* Left: every setting */}
          <form
            className={cn(
              "bg-card border-border rounded-xl border",
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
              <Field legend="Editor">
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
              </Field>
              <FontField
                fontName={fontName}
                fontDraft={fontDraft}
                custom={custom}
                onCustomChange={setCustom}
                onPick={(font) => {
                  setFontDraft(font);
                  setParam({ font });
                }}
              />
              <ThemeField
                editor={editor}
                themeId={themeId}
                themeUrl={themeUrl}
                themeName={meta.themeName}
                other={themeOther}
                onOtherChange={setThemeOther}
                urlDraft={urlDraft}
                onUrlDraftChange={setUrlDraft}
                variants={variants}
                variant={variant}
                setParam={setParam}
              />
              <Field legend="Code language">
                <div className="flex flex-col gap-1.5">
                  <Combobox
                    label="Language"
                    value={lang}
                    options={LANG_OPTIONS}
                    onChange={commitLang}
                  />
                </div>
              </Field>
            </div>
            <p className="text-muted-foreground border-border m-0 border-t px-4 py-3 text-xs">
              Use an Open or Free Font and Theme. Snapshots go in a public
              Registry, so a license that asks for payment, or does not allow
              public images, can&rsquo;t be used.
            </p>
            <button type="submit" className="sr-only">
              Apply
            </button>
          </form>

          {/* Right: the live window */}
          <PreviewPanel
            tab={tab}
            onTabChange={setTab}
            srcDoc={srcDoc}
            iframeRef={iframeRef}
            code={code}
            onCodeChange={setCode}
            errors={errors}
            exporting={exporting}
            exportDisabled={busy || exporting}
            onSavePng={savePng}
          />
        </div>
      </div>
    </main>
  );
}
