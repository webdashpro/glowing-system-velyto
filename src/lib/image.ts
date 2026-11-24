export function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(n < 10240 ? 1 : 0)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

export function baseName(name: string): string {
  return name.replace(/\.[^.]+$/, "") || "file";
}

export function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This image could not be opened by your browser."));
    };
    img.src = url;
  });
}

export function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

export function drawScaled(img: CanvasImageSource, sw: number, sh: number, w: number, h: number, bg?: string): HTMLCanvasElement {
  const c = makeCanvas(w, h);
  const ctx = c.getContext("2d")!;
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, c.width, c.height);
  }
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, sw, sh, 0, 0, c.width, c.height);
  return c;
}

export function canvasBlob(c: HTMLCanvasElement, type: string, q?: number): Promise<Blob> {
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("Encoding failed"))), type, q));
}

export function extFor(type: string): string {
  return type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
}

/** Finds the highest quality that fits maxBytes; scales dimensions down if quality alone is not enough. */
export async function encodeToTarget(
  src: HTMLCanvasElement,
  type: "image/jpeg" | "image/webp",
  maxBytes: number,
): Promise<{ blob: Blob; quality: number; scale: number }> {
  let c = src;
  let scale = 1;
  let last: Blob | null = null;
  for (let attempt = 0; attempt < 12; attempt++) {
    const top = await canvasBlob(c, type, 0.92);
    if (top.size <= maxBytes) return { blob: top, quality: 0.92, scale };
    const floor = await canvasBlob(c, type, 0.3);
    last = floor;
    if (floor.size <= maxBytes) {
      let lo = 0.3;
      let hi = 0.92;
      let best = floor;
      let bestQ = 0.3;
      for (let i = 0; i < 7; i++) {
        const mid = (lo + hi) / 2;
        const b = await canvasBlob(c, type, mid);
        if (b.size <= maxBytes) {
          best = b;
          bestQ = mid;
          lo = mid;
        } else hi = mid;
      }
      return { blob: best, quality: bestQ, scale };
    }
    scale *= 0.85;
    c = drawScaled(src, src.width, src.height, src.width * scale, src.height * scale);
  }
  return { blob: last!, quality: 0.3, scale };
}

/** Writes DPI into the JFIF header (inserting one when missing). */
export async function setJpegDpi(blob: Blob, dpi: number): Promise<Blob> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  const hi = (dpi >> 8) & 255;
  const lo = dpi & 255;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff && buf[3] === 0xe0 && buf[6] === 0x4a && buf[7] === 0x46) {
    buf[13] = 1;
    buf[14] = hi;
    buf[15] = lo;
    buf[16] = hi;
    buf[17] = lo;
    return new Blob([buf], { type: "image/jpeg" });
  }
  const seg = new Uint8Array([0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, hi, lo, hi, lo, 0, 0]);
  return new Blob([buf.slice(0, 2), seg, buf.slice(2)], { type: "image/jpeg" });
}

export function pdfBlob(bytes: Uint8Array): Blob {
  return new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
}
