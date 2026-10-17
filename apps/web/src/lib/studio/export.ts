import { STAGE_H, STAGE_W } from "@/lib/theme/snapshot-html";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const escXml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

async function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("PNG export failed"))), "image/png"),
  );
}

/**
 * Rasterise the fitted stage inside the preview iframe at 1600x900. The page is self-contained (inline CSS, base64 font), so it can ride
 * in an SVG foreignObject without any dependency.
 */
export async function renderPngs(iframe: HTMLIFrameElement): Promise<{ png: Blob }> {
  const doc = iframe.contentDocument;
  const win = iframe.contentWindow as (Window & { __ready?: boolean }) | null;
  if (!doc || !win) throw new Error("Preview is not ready yet.");
  for (let i = 0; i < 50 && !win.__ready; i++) await sleep(100);
  if (!win.__ready) throw new Error("Preview did not finish rendering.");

  const stage = doc.getElementById("stage")!.cloneNode(true) as HTMLElement;
  stage.style.cssText += `;position:relative;left:0;top:0;transform:none;width:${STAGE_W}px;height:${STAGE_H}px`;
  const css = escXml(doc.querySelector("style")!.textContent ?? "");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${STAGE_W}" height="${STAGE_H}" viewBox="0 0 ${STAGE_W} ${STAGE_H}">` +
    `<foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><style>${css}</style>` +
    new XMLSerializer().serializeToString(stage) +
    `</div></foreignObject></svg>`;

  // A data: URL keeps the canvas untainted; a blob: URL with foreignObject does not.
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  {
    const img = new Image();
    img.src = url;
    await img.decode();

    const make = async (w: number, h: number) => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingQuality = "high";
      // Embedded fonts inside an SVG image can decode a beat late: warm up, then draw for real.
      ctx.drawImage(img, 0, 0, w, h);
      await sleep(250);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      return canvasBlob(canvas);
    };
    return { png: await make(STAGE_W, STAGE_H) };
  }
}
