"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { downloadBlob } from "@/lib/client";
import { baseName, canvasBlob, drawScaled, encodeToTarget, extFor, fmtBytes, loadImage, makeCanvas, pdfBlob, setJpegDpi } from "@/lib/image";
import { EXAMS, type ExamTarget } from "@/data/exams";
import { Drop, Field, Notice, Num, Panel, Range, Reorder, Stat, newId } from "./ui";
import { Icon } from "../Icon";

/* ===================== Image Compressor ===================== */
type CompOut = { name: string; before: number; after: number; w: number; h: number; blob?: Blob; ext: string; note: string; err?: string };

export function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [kb, setKb] = useState(100);
  const [fmt, setFmt] = useState<"image/jpeg" | "image/webp">("image/jpeg");
  const [maxDim, setMaxDim] = useState(0);
  const [outs, setOuts] = useState<CompOut[]>([]);
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    const res: CompOut[] = [];
    for (const f of files) {
      try {
        const img = await loadImage(f);
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (maxDim > 0 && Math.max(w, h) > maxDim) {
          const s = maxDim / Math.max(w, h);
          w = Math.round(w * s);
          h = Math.round(h * s);
        }
        const c = drawScaled(img, img.naturalWidth, img.naturalHeight, w, h, "#ffffff");
        const r = await encodeToTarget(c, fmt, Math.max(1, kb) * 1024);
        const fw = Math.round(c.width * r.scale);
        const fh = Math.round(c.height * r.scale);
        const ok = r.blob.size <= kb * 1024;
        res.push({ name: `${baseName(f.name)}-compressed.${extFor(fmt)}`, before: f.size, after: r.blob.size, w: fw, h: fh, blob: r.blob, ext: extFor(fmt), note: `${ok ? "Fits target" : "Could not reach target"} · quality ${Math.round(r.quality * 100)}%${r.scale < 1 ? ` · scaled to ${Math.round(r.scale * 100)}%` : ""}` });
      } catch (e) {
        res.push({ name: f.name, before: f.size, after: 0, w: 0, h: 0, ext: "", note: "", err: (e as Error).message });
      }
    }
    setOuts(res);
    setBusy(false);
  }

  return (
    <Panel className="grid gap-4">
      <Drop accept="image/*" multiple onFiles={(f) => { setFiles(f); setOuts([]); }} label={files.length ? `${files.length} image${files.length > 1 ? "s" : ""} selected` : "Choose images to compress"} hint="JPG, PNG, WebP — processed in your browser" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Num label="Target size" suffix="KB" value={kb} onChange={setKb} min={5} step={5} />
        <Field label="Output format">
          <select className="input" value={fmt} onChange={(e) => setFmt(e.target.value as typeof fmt)}>
            <option value="image/jpeg">JPG (most compatible)</option>
            <option value="image/webp">WebP (smallest)</option>
          </select>
        </Field>
        <Num label="Max dimension (0 = keep)" suffix="px" value={maxDim} onChange={(n) => setMaxDim(Number.isFinite(n) ? n : 0)} min={0} step={100} />
      </div>
      <div className="flex flex-wrap gap-2">
        {[20, 50, 100, 200, 500].map((v) => (
          <button key={v} type="button" className="chip" aria-pressed={kb === v} onClick={() => setKb(v)}>{v} KB</button>
        ))}
      </div>
      <button className="btn btn-primary w-full sm:w-auto" disabled={!files.length || busy} onClick={run}>
        <Icon name="compress" className="h-4 w-4" />{busy ? "Compressing…" : "Compress"}
      </button>
      {outs.length > 0 && (
        <ul className="grid gap-2">
          {outs.map((o, i) => (
            <li key={i} className="flex flex-wrap items-center gap-3 rounded-xl border border-line p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{o.name}</p>
                {o.err ? <p className="text-sm text-bad">{o.err}</p> : <p className="text-xs text-muted">{fmtBytes(o.before)} → <b className="text-fg">{fmtBytes(o.after)}</b> ({Math.max(0, Math.round((1 - o.after / o.before) * 100))}% smaller) · {o.w}×{o.h} · {o.note}</p>}
              </div>
              {o.blob && <button className="btn btn-secondary btn-sm" onClick={() => downloadBlob(o.blob!, o.name)}><Icon name="download" className="h-4 w-4" />Download</button>}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ===================== Exam Photo & Signature Resizer ===================== */
const GENERIC: ExamTarget[] = [
  { label: "Photograph", w: 200, h: 230, minKB: 20, maxKB: 50, dpi: 200 },
  { label: "Signature", w: 140, h: 60, minKB: 10, maxKB: 20, dpi: 200 },
];

type ResizeResult = { blob: Blob; w: number; h: number; ok: boolean; sizeOk: boolean; padded: boolean; quality: number };

function TargetCard({ target }: { target: ExamTarget }) {
  const [file, setFile] = useState<File | null>(null);
  const [w, setW] = useState(target.w);
  const [h, setH] = useState(target.h);
  const [minKB, setMin] = useState(target.minKB);
  const [maxKB, setMax] = useState(target.maxKB);
  const [dpi, setDpi] = useState(target.dpi);
  const [fit, setFit] = useState<"cover" | "contain" | "stretch">("cover");
  const [pad, setPad] = useState(true);
  const [res, setRes] = useState<ResizeResult | null>(null);
  const [err, setErr] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!file || !(w > 0) || !(h > 0) || !(maxKB > 0)) return;
    let dead = false;
    (async () => {
      try {
        setErr("");
        const img = await loadImage(file);
        const c = makeCanvas(w, h);
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.imageSmoothingQuality = "high";
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        if (fit === "stretch") ctx.drawImage(img, 0, 0, c.width, c.height);
        else {
          const s = fit === "cover" ? Math.max(c.width / iw, c.height / ih) : Math.min(c.width / iw, c.height / ih);
          const dw = iw * s;
          const dh = ih * s;
          ctx.drawImage(img, (c.width - dw) / 2, (c.height - dh) / 2, dw, dh);
        }
        const max = maxKB * 1024;
        const min = minKB * 1024;
        // highest quality <= max
        let lo = 0.05;
        let hi = 0.98;
        let best = await canvasBlob(c, "image/jpeg", lo);
        let bq = lo;
        if (best.size <= max) {
          const top = await canvasBlob(c, "image/jpeg", hi);
          if (top.size <= max) {
            best = top;
            bq = hi;
          } else {
            for (let i = 0; i < 8; i++) {
              const mid = (lo + hi) / 2;
              const b = await canvasBlob(c, "image/jpeg", mid);
              if (b.size <= max) {
                best = b;
                bq = mid;
                lo = mid;
              } else hi = mid;
            }
          }
        }
        let out = await setJpegDpi(best, dpi);
        let padded = false;
        if (out.size < min && pad) {
          out = new Blob([out, new Uint8Array(min - out.size + 64)], { type: "image/jpeg" });
          padded = true;
        }
        if (dead) return;
        const sizeOk = out.size <= max && out.size >= min;
        setRes({ blob: out, w: c.width, h: c.height, ok: sizeOk, sizeOk, padded, quality: bq });
      } catch (e) {
        if (!dead) setErr((e as Error).message);
      }
    })();
    return () => {
      dead = true;
    };
  }, [file, w, h, minKB, maxKB, dpi, fit, pad]);

  useEffect(() => {
    if (!res) return setUrl("");
    const u = URL.createObjectURL(res.blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [res]);

  return (
    <div className="card grid gap-3 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-display text-lg font-bold">{target.label}</h3>
        <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand-ink">{w}×{h}px · {minKB}–{maxKB} KB · {dpi} DPI</span>
      </div>
      {target.note && <p className="text-xs text-muted">{target.note}</p>}
      <Drop accept="image/*" onFiles={(f) => setFile(f[0])} label={file ? file.name : `Choose ${target.label.toLowerCase()} image`} hint={file ? "Click to replace" : undefined} />
      <details className="rounded-xl border border-line p-3">
        <summary className="cursor-pointer text-sm font-semibold">Adjust size, KB range &amp; DPI</summary>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Num label="Width" suffix="px" value={w} onChange={setW} min={20} />
          <Num label="Height" suffix="px" value={h} onChange={setH} min={20} />
          <Num label="DPI" value={dpi} onChange={setDpi} min={72} />
          <Num label="Min size" suffix="KB" value={minKB} onChange={setMin} min={0} />
          <Num label="Max size" suffix="KB" value={maxKB} onChange={setMax} min={1} />
          <Field label="Fit">
            <select className="input" value={fit} onChange={(e) => setFit(e.target.value as typeof fit)}>
              <option value="cover">Cover (crop to fill)</option>
              <option value="contain">Contain (white margins)</option>
              <option value="stretch">Stretch</option>
            </select>
          </Field>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={pad} onChange={(e) => setPad(e.target.checked)} />Pad file up to the minimum size if it ends up smaller</label>
      </details>
      {err && <Notice kind="error">{err}</Notice>}
      {res && (
        <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {url && <img src={url} alt={`${target.label} preview`} className="max-h-40 rounded-lg border border-line bg-white object-contain" />}
          <div className="grid content-start gap-2 text-sm">
            <p className={res.w === w && res.h === h ? "text-good" : "text-bad"}>{res.w === w ? "✔" : "✖"} Dimensions {res.w} × {res.h} px</p>
            <p className={res.sizeOk ? "text-good" : "text-bad"}>{res.sizeOk ? "✔" : "✖"} File size {fmtBytes(res.blob.size)} (allowed {minKB}–{maxKB} KB){res.padded ? " · padded to minimum" : ""}</p>
            {!res.sizeOk && res.blob.size > maxKB * 1024 && <Notice kind="warn">Even at the lowest quality this size is too large for the pixel dimensions. Try a simpler background or smaller dimensions.</Notice>}
            <button className="btn btn-primary btn-sm w-fit" onClick={() => downloadBlob(res.blob, `${baseName(file?.name ?? "photo")}-${target.label.toLowerCase().replace(/\W+/g, "-")}.jpg`)}><Icon name="download" className="h-4 w-4" />Download JPEG</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ExamResizer({ targets, examName }: { targets?: ExamTarget[]; examName?: string }) {
  const [preset, setPreset] = useState("");
  const active = useMemo(() => {
    if (targets && !preset) return targets;
    const ex = EXAMS.find((e) => e.slug === preset);
    return ex ? ex.targets : targets ?? GENERIC;
  }, [targets, preset]);
  const key = (preset || "default") + active.map((t) => t.label).join();
  return (
    <div className="grid gap-4">
      <Panel className="flex flex-wrap items-end gap-3">
        <Field label="Preset" className="min-w-[14rem] flex-1" hint={examName && !preset ? `Loaded for ${examName}` : "Pick an exam or use the defaults, then adjust any number."}>
          <select className="input" value={preset} onChange={(e) => setPreset(e.target.value)}>
            <option value="">{examName ? `${examName} (this page)` : "Default (photo 200×230, signature 140×60)"}</option>
            {EXAMS.map((e) => <option key={e.slug} value={e.slug}>{e.name}</option>)}
          </select>
        </Field>
        <p className="max-w-sm text-xs text-muted">Always confirm numbers in the official notification — boards revise limits between cycles.</p>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2" key={key}>
        {active.map((t) => <TargetCard key={t.label} target={t} />)}
      </div>
    </div>
  );
}

/* ===================== Image Cropper & Rotator ===================== */
const RATIOS: [string, number][] = [["Free", 0], ["1:1", 1], ["4:3", 4 / 3], ["3:4", 3 / 4], ["16:9", 16 / 9], ["9:16", 9 / 16], ["4:5", 4 / 5], ["3:2", 3 / 2]];

export function ImageCropper() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("image");
  const [rot, setRot] = useState(0);
  const [fh, setFh] = useState(false);
  const [fv, setFv] = useState(false);
  const [ratio, setRatio] = useState(1);
  const [cw, setCw] = useState(80);
  const [ch, setCh] = useState(80);
  const [cx, setCx] = useState(50);
  const [cy, setCy] = useState(50);
  const [fmt, setFmt] = useState("image/png");
  const view = useRef<HTMLCanvasElement>(null);

  const src = useMemo(() => {
    if (!img) return null;
    const swap = rot % 2 === 1;
    const c = makeCanvas(swap ? img.naturalHeight : img.naturalWidth, swap ? img.naturalWidth : img.naturalHeight);
    const ctx = c.getContext("2d")!;
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate((rot * Math.PI) / 2);
    ctx.scale(fh ? -1 : 1, fv ? -1 : 1);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    return c;
  }, [img, rot, fh, fv]);

  const rect = useMemo(() => {
    if (!src) return null;
    let w = (src.width * cw) / 100;
    let h = ratio ? w / ratio : (src.height * ch) / 100;
    if (h > src.height) {
      h = src.height;
      if (ratio) w = h * ratio;
    }
    return { x: (src.width - w) * (cx / 100), y: (src.height - h) * (cy / 100), w, h };
  }, [src, cw, ch, cx, cy, ratio]);

  useEffect(() => {
    const v = view.current;
    if (!v || !src || !rect) return;
    const s = Math.min(1, 640 / src.width);
    v.width = Math.round(src.width * s);
    v.height = Math.round(src.height * s);
    const ctx = v.getContext("2d")!;
    ctx.drawImage(src, 0, 0, v.width, v.height);
    ctx.fillStyle = "rgba(5,10,30,0.55)";
    ctx.fillRect(0, 0, v.width, v.height);
    ctx.drawImage(src, rect.x, rect.y, rect.w, rect.h, rect.x * s, rect.y * s, rect.w * s, rect.h * s);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.x * s, rect.y * s, rect.w * s, rect.h * s);
  }, [src, rect]);

  async function save() {
    if (!src || !rect) return;
    const c = drawScaled(src, src.width, src.height, src.width, src.height);
    const out = makeCanvas(rect.w, rect.h);
    const ctx = out.getContext("2d")!;
    if (fmt === "image/jpeg") {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, out.width, out.height);
    }
    ctx.drawImage(c, rect.x, rect.y, rect.w, rect.h, 0, 0, out.width, out.height);
    downloadBlob(await canvasBlob(out, fmt, 0.92), `${name}-cropped.${extFor(fmt)}`);
  }

  return (
    <Panel className="grid gap-4">
      <Drop accept="image/*" onFiles={async (f) => { setImg(await loadImage(f[0])); setName(baseName(f[0].name)); setRot(0); setFh(false); setFv(false); }} label={img ? `${name} loaded — choose another` : "Choose an image"} />
      {src && rect && (
        <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
          <div className="overflow-hidden rounded-xl border border-line bg-soft p-2"><canvas ref={view} className="mx-auto h-auto max-w-full" aria-label="Crop preview" /></div>
          <div className="grid content-start gap-3">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Aspect ratio">
              {RATIOS.map(([l, v]) => <button key={l} className="chip" aria-pressed={ratio === v} onClick={() => setRatio(v)}>{l}</button>)}
            </div>
            <Range label="Crop width" value={cw} onChange={setCw} min={10} max={100} unit="%" />
            {!ratio && <Range label="Crop height" value={ch} onChange={setCh} min={10} max={100} unit="%" />}
            <Range label="Horizontal position" value={cx} onChange={setCx} min={0} max={100} unit="%" />
            <Range label="Vertical position" value={cy} onChange={setCy} min={0} max={100} unit="%" />
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-secondary btn-sm" onClick={() => setRot((r) => (r + 3) % 4)}>⟲ Rotate left</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setRot((r) => (r + 1) % 4)}>⟳ Rotate right</button>
              <button className="btn btn-secondary btn-sm" aria-pressed={fh} onClick={() => setFh((v) => !v)}>Flip H</button>
              <button className="btn btn-secondary btn-sm" aria-pressed={fv} onClick={() => setFv((v) => !v)}>Flip V</button>
            </div>
            <Field label="Format"><select className="input" value={fmt} onChange={(e) => setFmt(e.target.value)}><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select></Field>
            <p className="text-xs text-muted">Output: {Math.round(rect.w)} × {Math.round(rect.h)} px</p>
            <button className="btn btn-primary" onClick={save}><Icon name="download" className="h-4 w-4" />Download cropped image</button>
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ===================== Watermark ===================== */
export function ImageWatermark() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("image");
  const [text, setText] = useState("© Velyto");
  const [size, setSize] = useState(6);
  const [opacity, setOpacity] = useState(55);
  const [angle, setAngle] = useState(0);
  const [color, setColor] = useState("#ffffff");
  const [mode, setMode] = useState<"single" | "tile">("single");
  const [pos, setPos] = useState("br");
  const [fmt, setFmt] = useState("image/png");
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = cv.current;
    if (!c || !img) return;
    const maxSide = 2400;
    const s = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    c.width = Math.round(img.naturalWidth * s);
    c.height = Math.round(img.naturalHeight * s);
    const ctx = c.getContext("2d")!;
    ctx.drawImage(img, 0, 0, c.width, c.height);
    const fs = Math.max(10, (Math.min(c.width, c.height) * size) / 100);
    ctx.font = `700 ${fs}px ui-sans-serif, system-ui, sans-serif`;
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity / 100;
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = fs / 8;
    const rad = (angle * Math.PI) / 180;
    if (mode === "tile") {
      const tw = ctx.measureText(text).width + fs * 2;
      const th = fs * 3;
      ctx.save();
      ctx.translate(c.width / 2, c.height / 2);
      ctx.rotate(rad || -Math.PI / 6);
      const span = Math.hypot(c.width, c.height);
      ctx.textAlign = "center";
      for (let y = -span; y < span; y += th) for (let x = -span; x < span; x += tw) ctx.fillText(text, x, y);
      ctx.restore();
    } else {
      const tw = ctx.measureText(text).width;
      const m = fs * 0.8;
      const px = pos.includes("l") ? m + tw / 2 : pos.includes("r") ? c.width - m - tw / 2 : c.width / 2;
      const py = pos.includes("t") ? m + fs / 2 : pos.includes("b") ? c.height - m - fs / 2 : c.height / 2;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rad);
      ctx.textAlign = "center";
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
  }, [img, text, size, opacity, angle, color, mode, pos]);

  return (
    <Panel className="grid gap-4">
      <Drop accept="image/*" onFiles={async (f) => { setImg(await loadImage(f[0])); setName(baseName(f[0].name)); }} label={img ? "Choose another image" : "Choose an image to watermark"} />
      {img && (
        <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
          <div className="overflow-hidden rounded-xl border border-line bg-soft p-2"><canvas ref={cv} className="mx-auto h-auto max-h-[28rem] max-w-full" aria-label="Watermark preview" /></div>
          <div className="grid content-start gap-3">
            <Field label="Watermark text"><input className="input" value={text} onChange={(e) => setText(e.target.value)} maxLength={80} /></Field>
            <div className="flex gap-2"><button className="chip" aria-pressed={mode === "single"} onClick={() => setMode("single")}>Single</button><button className="chip" aria-pressed={mode === "tile"} onClick={() => setMode("tile")}>Tiled</button></div>
            {mode === "single" && (
              <div className="grid w-32 grid-cols-3 gap-1" role="group" aria-label="Position">
                {["tl", "t", "tr", "l", "c", "r", "bl", "b", "br"].map((p) => <button key={p} aria-label={`Position ${p}`} aria-pressed={pos === p} onClick={() => setPos(p)} className={`h-8 rounded-md border ${pos === p ? "border-brand bg-brand" : "border-line bg-soft"}`} />)}
              </div>
            )}
            <Range label="Size" value={size} onChange={setSize} min={2} max={20} unit="%" />
            <Range label="Opacity" value={opacity} onChange={setOpacity} min={10} max={100} unit="%" />
            <Range label="Angle" value={angle} onChange={setAngle} min={-90} max={90} unit="°" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Colour"><input type="color" className="input h-10 p-1" value={color} onChange={(e) => setColor(e.target.value)} /></Field>
              <Field label="Format"><select className="input" value={fmt} onChange={(e) => setFmt(e.target.value)}><option value="image/png">PNG</option><option value="image/jpeg">JPG</option></select></Field>
            </div>
            <button className="btn btn-primary" onClick={async () => cv.current && downloadBlob(await canvasBlob(cv.current, fmt, 0.93), `${name}-watermarked.${extFor(fmt)}`)}><Icon name="download" className="h-4 w-4" />Download</button>
          </div>
        </div>
      )}
    </Panel>
  );
}

/* ===================== Image to PDF ===================== */
type FItem = { id: string; file: File };

export function ImageToPdf() {
  const [items, setItems] = useState<FItem[]>([]);
  const [size, setSize] = useState("a4");
  const [margin, setMargin] = useState(20);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function build() {
    setBusy(true);
    setMsg("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      for (const it of items) {
        const img = await loadImage(it.file);
        const c = drawScaled(img, img.naturalWidth, img.naturalHeight, img.naturalWidth, img.naturalHeight, it.file.type === "image/png" ? undefined : "#ffffff");
        const isPng = it.file.type === "image/png";
        const bytes = new Uint8Array(await (await canvasBlob(c, isPng ? "image/png" : "image/jpeg", 0.92)).arrayBuffer());
        const emb = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        let pw: number;
        let ph: number;
        if (size === "fit") {
          pw = emb.width * 0.75 + margin * 2;
          ph = emb.height * 0.75 + margin * 2;
        } else {
          [pw, ph] = size === "letter" ? [612, 792] : [595.28, 841.89];
          if (emb.width > emb.height) [pw, ph] = [ph, pw];
        }
        const page = doc.addPage([pw, ph]);
        const s = Math.min((pw - margin * 2) / emb.width, (ph - margin * 2) / emb.height);
        const dw = emb.width * s;
        const dh = emb.height * s;
        page.drawImage(emb, { x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh });
      }
      downloadBlob(pdfBlob(await doc.save()), "images.pdf");
      setMsg(`Created a ${items.length}-page PDF.`);
    } catch (e) {
      setMsg(`Could not create the PDF: ${(e as Error).message}`);
    }
    setBusy(false);
  }

  return (
    <Panel className="grid gap-4">
      <Drop accept="image/*" multiple onFiles={(f) => setItems((p) => [...p, ...f.map((file) => ({ id: newId(), file }))])} label="Add images" hint="JPG, PNG, WebP — order them below" />
      {items.length > 0 && <Reorder items={items} setItems={setItems} render={(t) => <p className="truncate text-sm font-medium">{t.file.name} <span className="text-xs text-muted">{fmtBytes(t.file.size)}</span></p>} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Page size"><select className="input" value={size} onChange={(e) => setSize(e.target.value)}><option value="a4">A4</option><option value="letter">US Letter</option><option value="fit">Fit to each image</option></select></Field>
        <Num label="Margin" suffix="pt" value={margin} onChange={(n) => setMargin(Number.isFinite(n) ? n : 0)} min={0} max={100} />
      </div>
      <button className="btn btn-primary w-full sm:w-auto" disabled={!items.length || busy} onClick={build}><Icon name="filepdf" className="h-4 w-4" />{busy ? "Creating PDF…" : "Create PDF"}</button>
      {msg && <Notice kind={msg.startsWith("Could") ? "error" : "ok"}>{msg}</Notice>}
    </Panel>
  );
}

/* ===================== Merge PDF ===================== */
type PItem = { id: string; file: File; pages?: number };

export function MergePdf() {
  const [items, setItems] = useState<PItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function add(files: File[]) {
    const { PDFDocument } = await import("pdf-lib");
    const next: PItem[] = [];
    for (const file of files) {
      let pages: number | undefined;
      try {
        pages = (await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true })).getPageCount();
      } catch {
        pages = undefined;
      }
      next.push({ id: newId(), file, pages });
    }
    setItems((p) => [...p, ...next]);
  }

  async function merge() {
    setBusy(true);
    setMsg("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const out = await PDFDocument.create();
      for (const it of items) {
        const src = await PDFDocument.load(await it.file.arrayBuffer());
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      downloadBlob(pdfBlob(await out.save()), "merged.pdf");
      setMsg(`Merged ${items.length} files into ${out.getPageCount()} pages.`);
    } catch (e) {
      setMsg(`Could not merge. One of the files may be encrypted or damaged (${(e as Error).message}).`);
    }
    setBusy(false);
  }

  return (
    <Panel className="grid gap-4">
      <Drop accept="application/pdf" multiple onFiles={add} label="Add PDF files" hint="Select two or more PDFs" />
      {items.length > 0 && <Reorder items={items} setItems={setItems} render={(t) => <p className="truncate text-sm font-medium">{t.file.name} <span className="text-xs text-muted">{fmtBytes(t.file.size)}{t.pages ? ` · ${t.pages} pages` : " · unreadable"}</span></p>} />}
      <button className="btn btn-primary w-full sm:w-auto" disabled={items.length < 2 || busy} onClick={merge}><Icon name="merge" className="h-4 w-4" />{busy ? "Merging…" : `Merge ${items.length || ""} PDFs`}</button>
      {msg && <Notice kind={msg.startsWith("Could") ? "error" : "ok"}>{msg}</Notice>}
    </Panel>
  );
}

/* ===================== Split PDF ===================== */
export function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [count, setCount] = useState(0);
  const [ranges, setRanges] = useState("1-2");
  const [outs, setOuts] = useState<{ name: string; blob: Blob; label: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function pick(f: File) {
    setFile(f);
    setOuts([]);
    setMsg("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const d = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      setCount(d.getPageCount());
      setRanges(`1-${Math.min(2, d.getPageCount())}`);
    } catch {
      setCount(0);
      setMsg("Could not read this PDF. It may be encrypted or damaged.");
    }
  }

  async function run(groups: number[][], labels: string[]) {
    if (!file) return;
    setBusy(true);
    setMsg("");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await file.arrayBuffer());
      const res: { name: string; blob: Blob; label: string }[] = [];
      for (let g = 0; g < groups.length; g++) {
        const d = await PDFDocument.create();
        (await d.copyPages(src, groups[g])).forEach((p) => d.addPage(p));
        res.push({ name: `${baseName(file.name)}-${labels[g]}.pdf`, blob: pdfBlob(await d.save()), label: labels[g] });
      }
      setOuts(res);
    } catch (e) {
      setMsg(`Split failed: ${(e as Error).message}`);
    }
    setBusy(false);
  }

  function parse() {
    const groups: number[][] = [];
    const labels: string[] = [];
    for (const raw of ranges.split(",")) {
      const t = raw.trim();
      if (!t) continue;
      const m = t.match(/^(\d*)\s*-\s*(\d*)$/);
      let a: number;
      let b: number;
      if (m) {
        a = m[1] ? parseInt(m[1], 10) : 1;
        b = m[2] ? parseInt(m[2], 10) : count;
      } else if (/^\d+$/.test(t)) a = b = parseInt(t, 10);
      else {
        setMsg(`“${t}” is not a valid range. Use formats like 1-3, 5, 8-`);
        return;
      }
      a = Math.max(1, a);
      b = Math.min(count, b);
      if (a > b) {
        setMsg(`Range “${t}” is outside this PDF (1–${count}).`);
        return;
      }
      groups.push(Array.from({ length: b - a + 1 }, (_, i) => a - 1 + i));
      labels.push(a === b ? `page-${a}` : `pages-${a}-${b}`);
    }
    if (!groups.length) return setMsg("Enter at least one page range.");
    run(groups, labels);
  }

  return (
    <Panel className="grid gap-4">
      <Drop accept="application/pdf" onFiles={(f) => pick(f[0])} label={file ? `${file.name}${count ? ` · ${count} pages` : ""}` : "Choose a PDF"} />
      {count > 0 && (
        <>
          <Field label="Page ranges (comma separated)" hint="Example: 1-3, 5, 8-  → three separate PDFs"><input className="input" value={ranges} onChange={(e) => setRanges(e.target.value)} /></Field>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary" disabled={busy} onClick={parse}><Icon name="split" className="h-4 w-4" />Split by ranges</button>
            <button className="btn btn-secondary" disabled={busy} onClick={() => run(Array.from({ length: count }, (_, i) => [i]), Array.from({ length: count }, (_, i) => `page-${i + 1}`))}>Every page → own PDF</button>
          </div>
        </>
      )}
      {msg && <Notice kind="error">{msg}</Notice>}
      {outs.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {outs.map((o) => (
            <li key={o.name} className="flex items-center justify-between gap-2 rounded-xl border border-line p-3 text-sm">
              <span className="min-w-0 truncate"><b>{o.label}</b> <span className="text-muted">{fmtBytes(o.blob.size)}</span></span>
              <button className="btn btn-secondary btn-sm" onClick={() => downloadBlob(o.blob, o.name)}><Icon name="download" className="h-4 w-4" />Save</button>
            </li>
          ))}
        </ul>
      )}
      {!file && <Stat label="Tip" value="Ranges become separate files" sub="Use Merge PDF afterwards to rebuild a custom order." />}
    </Panel>
  );
}
