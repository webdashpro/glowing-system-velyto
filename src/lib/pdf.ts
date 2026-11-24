import type { PDFFont } from "pdf-lib";

/** Replace characters the standard PDF fonts can't encode. */
export function safe(s: string): string {
  return (s ?? "").replace(/₹/g, "Rs.").replace(/[^\x20-\x7E\u00A0-\u00FF•–—‘’“”€]/g, "?").replace(/[\r\t]/g, " ");
}

export function wrap(font: PDFFont, text: string, size: number, maxW: number): string[] {
  const out: string[] = [];
  for (const para of safe(text).split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const t = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(t, size) <= maxW) line = t;
      else {
        if (line) out.push(line);
        line = word;
      }
    }
    out.push(line);
  }
  return out;
}
