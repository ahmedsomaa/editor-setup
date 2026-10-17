import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/studio";
import { THEMES, highlight, type Highlighted } from "@/lib/theme/highlight";
import { DEFAULTS, type FontFace } from "@/lib/studio/schemas";
import type { EditorId } from "@/lib/registry/pairs";
import { zedToVscodeTheme, zedVariants } from "@/lib/theme/zed-theme";
import { sampleFor } from "@/lib/studio/samples";
import { buildSnapshotHtml } from "@/lib/theme/snapshot-html";
import { download, renderPngs } from "@/lib/studio/export";
import type { StudioTab } from "./PreviewPanel";
import type { CustomFont, SetParam } from "./types";

const NO_FACES: FontFace[] = [];

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Everything Snapshot Studio knows: the choices in the URL, the drafts being typed, and the preview
 * built from them. The page and its controls only read this and call back.
 */
export function useSnapshotStudio() {
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

  return {
    editor,
    fontName,
    fontDraft,
    setFontDraft,
    custom,
    setCustom,
    themeId,
    themeUrl,
    themeName: meta.themeName,
    themeOther,
    setThemeOther,
    urlDraft,
    setUrlDraft,
    variants,
    variant,
    lang,
    commitLang,
    setParam,
    tab,
    setTab,
    srcDoc,
    iframeRef,
    code,
    setCode,
    errors,
    exporting,
    exportDisabled: busy || exporting,
    savePng,
  };
}
