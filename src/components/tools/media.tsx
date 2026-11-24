"use client";
import { useEffect, useRef, useState } from "react";
import { downloadBlob } from "@/lib/client";
import { baseName, canvasBlob, drawScaled, extFor, fmtBytes, loadImage, makeCanvas } from "@/lib/image";
import { Drop, Field, Notice, Num, Panel, Range, Reorder, Stat, newId } from "./ui";
import { Icon } from "../Icon";

/* ===================== Video → Image ===================== */
type Frame = { id: string; blob: Blob; url: string; t: number };

export function VideoToImage() {
  const [src, setSrc] = useState("");
  const [name, setName] = useState("video");
  const [dur, setDur] = useState(0);
  const [t, setT] = useState(0);
  const [fmt, setFmt] = useState<"image/png" | "image/jpeg">("image/png");
  const [interval, setInterval_] = useState(2);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const video = useRef<HTMLVideoElement>(null);
  const framesRef = useRef<Frame[]>([]);
  useEffect(() => {
    framesRef.current = frames;
  }, [frames]);
  useEffect(() => () => framesRef.current.forEach((f) => URL.revokeObjectURL(f.url)), []);
  useEffect(() => () => { if (src) URL.revokeObjectURL(src); }, [src]);

  const seek = (time: number) =>
    new Promise<void>((res) => {
      const v = video.current!;
      const done = () => { v.removeEventListener("seeked", done); res(); };
      v.addEventListener("seeked", done);
      v.currentTime = Math.min(Math.max(0, time), v.duration || time);
    });

  const grab = async (time: number): Promise<Frame | null> => {
    const v = video.current;
    if (!v || !v.videoWidth) return null;
    const c = makeCanvas(v.videoWidth, v.videoHeight);
    const ctx = c.getContext("2d")!;
    if (fmt === "image/jpeg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.drawImage(v, 0, 0);
    const blob = await canvasBlob(c, fmt, 0.95);
    return { id: newId(), blob, url: URL.createObjectURL(blob), t: time };
  };

  const capture = async () => {
    const f = await grab(video.current?.currentTime ?? 0);
    if (f) setFrames((p) => [...p, f]);
  };

  const extractAll = async () => {
    const v = video.current;
    if (!v) return;
    setBusy(true);
    v.pause();
    const out: Frame[] = [];
    for (let time = 0; time <= dur && out.length < 120; time += interval) {
      await seek(time);
      const f = await grab(time);
      if (f) out.push(f);
    }
    setFrames((p) => [...p, ...out]);
    setBusy(false);
  };

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, "0")}`;

  return (
    <Panel className="grid gap-4">
      <Drop accept="video/mp4,video/webm,video/*" onFiles={(f) => { frames.forEach((x) => URL.revokeObjectURL(x.url)); setFrames([]); setErr(""); setName(baseName(f[0].name)); setSrc(URL.createObjectURL(f[0])); }} label={src ? `${name} loaded — choose another` : "Choose a video (MP4 / WebM)"} />
      {err && <Notice kind="error">{err}</Notice>}
      {src && (
        <>
          <video ref={video} src={src} className="max-h-[22rem] w-full rounded-xl bg-black" controls playsInline preload="auto" onLoadedMetadata={(e) => setDur(e.currentTarget.duration)} onTimeUpdate={(e) => setT(e.currentTarget.currentTime)} onError={() => setErr("Your browser could not play this video. Try MP4 (H.264) or WebM.")} />
          <label className="block"><span className="label flex justify-between"><span>Scrub timeline</span><span className="text-fg">{fmtTime(t)} / {fmtTime(dur)}</span></span><input type="range" className="w-full accent-[var(--brand)]" min={0} max={dur || 1} step={0.01} value={t} onChange={(e) => { const v = Number(e.target.value); setT(v); if (video.current) video.current.currentTime = v; }} /></label>
          <div className="flex flex-wrap items-end gap-3">
            <button className="btn btn-secondary btn-sm" onClick={() => video.current && (video.current.currentTime -= 0.1)}>−0.1 s</button>
            <button className="btn btn-secondary btn-sm" onClick={() => video.current && (video.current.currentTime += 0.1)}>+0.1 s</button>
            <Field label="Format"><select className="input" value={fmt} onChange={(e) => setFmt(e.target.value as typeof fmt)}><option value="image/png">PNG (lossless)</option><option value="image/jpeg">JPG (smaller)</option></select></Field>
            <button className="btn btn-primary" onClick={capture}><Icon name="camera" className="h-4 w-4" />Capture this frame</button>
          </div>
          <div className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-soft p-3">
            <Field label="Extract a frame every"><select className="input" value={interval} onChange={(e) => setInterval_(Number(e.target.value))}><option value={1}>1 second</option><option value={2}>2 seconds</option><option value={5}>5 seconds</option></select></Field>
            <button className="btn btn-primary" disabled={busy || !dur} onClick={extractAll}>{busy ? "Extracting…" : "Extract all frames"}</button>
            <span className="text-xs text-muted">Up to 120 frames per run · native resolution</span>
          </div>
        </>
      )}
      {frames.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between"><h3 className="font-display font-bold">{frames.length} frame{frames.length > 1 ? "s" : ""}</h3><button className="btn btn-ghost btn-sm" onClick={() => { frames.forEach((f) => URL.revokeObjectURL(f.url)); setFrames([]); }}>Clear</button></div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {frames.map((f) => (
              <li key={f.id} className="overflow-hidden rounded-xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt={`Frame at ${f.t.toFixed(2)} seconds`} className="aspect-video w-full object-cover" />
                <div className="flex items-center justify-between gap-1 p-2 text-xs"><span>{f.t.toFixed(1)}s · {fmtBytes(f.blob.size)}</span><button className="btn btn-ghost btn-sm" aria-label="Download frame" onClick={() => downloadBlob(f.blob, `${name}-${f.t.toFixed(2)}s.${extFor(fmt)}`)}><Icon name="download" className="h-4 w-4" /></button></div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Panel>
  );
}

/* ===================== Images → Video ===================== */
type VItem = { id: string; file: File; img: HTMLImageElement };
const RATIOS: Record<string, [number, number]> = { "16:9": [1280, 720], "9:16": [720, 1280], "1:1": [1080, 1080] };

export function ImageToVideo() {
  const [items, setItems] = useState<VItem[]>([]);
  const [ratio, setRatio] = useState("16:9");
  const [secs, setSecs] = useState(3);
  const [fade, setFade] = useState(true);
  const [fit, setFit] = useState<"contain" | "cover">("contain");
  const [bg, setBg] = useState("#0a1630");
  const [prog, setProg] = useState(0);
  const [busy, setBusy] = useState(false);
  const [video, setVideo] = useState<{ url: string; blob: Blob } | null>(null);
  const [msg, setMsg] = useState("");
  const [supported, setSupported] = useState(true);
  useEffect(() => setSupported(typeof MediaRecorder !== "undefined" && typeof HTMLCanvasElement.prototype.captureStream === "function"), []);
  useEffect(() => () => { if (video) URL.revokeObjectURL(video.url); }, [video]);

  async function add(files: File[]) {
    const next: VItem[] = [];
    for (const file of files) {
      try { next.push({ id: newId(), file, img: await loadImage(file) }); } catch { /* skip */ }
    }
    setItems((p) => [...p, ...next]);
  }

  async function render() {
    setMsg("");
    const mime = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm"].find((m) => MediaRecorder.isTypeSupported(m));
    if (!mime) return setMsg("Your browser cannot record WebM video. Try the latest Chrome, Edge, Firefox or Safari.");
    setBusy(true);
    setVideo(null);
    const [W, H] = RATIOS[ratio];
    const c = makeCanvas(W, H);
    const ctx = c.getContext("2d")!;
    const draw = (img: HTMLImageElement, alpha: number) => {
      ctx.globalAlpha = alpha;
      const s = fit === "cover" ? Math.max(W / img.naturalWidth, H / img.naturalHeight) : Math.min(W / img.naturalWidth, H / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    };
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    draw(items[0].img, 1);
    const stream = c.captureStream(30);
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5_000_000 });
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    const finished = new Promise<void>((res) => (rec.onstop = () => res()));
    rec.start(250);
    const total = items.length * secs;
    const fadeDur = Math.min(0.6, secs / 2);
    const t0 = performance.now();
    await new Promise<void>((res) => {
      const tick = () => {
        const t = (performance.now() - t0) / 1000;
        if (t >= total) return res();
        const idx = Math.min(items.length - 1, Math.floor(t / secs));
        const local = t - idx * secs;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);
        draw(items[idx].img, 1);
        if (fade && idx < items.length - 1 && local > secs - fadeDur) draw(items[idx + 1].img, (local - (secs - fadeDur)) / fadeDur);
        setProg(Math.round((t / total) * 100));
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    draw(items[items.length - 1].img, 1);
    await new Promise((r) => setTimeout(r, 250));
    rec.stop();
    await finished;
    stream.getTracks().forEach((tr) => tr.stop());
    const blob = new Blob(chunks, { type: "video/webm" });
    setVideo({ url: URL.createObjectURL(blob), blob });
    setProg(100);
    setBusy(false);
  }

  return (
    <Panel className="grid gap-4">
      {!supported && <Notice kind="warn">Your browser does not support canvas video recording (MediaRecorder). Please use a recent Chrome, Edge, Firefox or Safari.</Notice>}
      <Drop accept="image/*" multiple onFiles={add} label="Add images for your video" hint="JPG, PNG, WebP — reorder them below" />
      {items.length > 0 && <Reorder items={items} setItems={setItems} render={(t) => <p className="truncate text-sm font-medium">{t.file.name} <span className="text-xs text-muted">{t.img.naturalWidth}×{t.img.naturalHeight}</span></p>} />}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Aspect ratio"><div className="flex gap-1.5">{Object.keys(RATIOS).map((r) => <button key={r} className="chip" aria-pressed={ratio === r} onClick={() => setRatio(r)}>{r}</button>)}</div></Field>
        <Range label="Seconds per slide" value={secs} onChange={setSecs} min={1} max={10} unit="s" />
        <Field label="Image fit"><select className="input" value={fit} onChange={(e) => setFit(e.target.value as typeof fit)}><option value="contain">Contain (show all)</option><option value="cover">Cover (fill frame)</option></select></Field>
        <Field label="Background"><input type="color" className="input h-10 p-1" value={bg} onChange={(e) => setBg(e.target.value)} /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={fade} onChange={(e) => setFade(e.target.checked)} />Fade transition between slides</label>
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-primary" disabled={!items.length || busy || !supported} onClick={render}><Icon name="film" className="h-4 w-4" />{busy ? `Rendering… ${prog}%` : "Render video"}</button>
        <span className="text-xs text-muted">{items.length ? `≈ ${items.length * secs}s video, rendered in real time — keep this tab visible.` : "Add at least one image."}</span>
      </div>
      {msg && <Notice kind="error">{msg}</Notice>}
      {busy && <div className="h-2 overflow-hidden rounded-full bg-brand-soft"><div className="h-full bg-brand transition-[width]" style={{ width: `${prog}%` }} /></div>}
      {video && (
        <div className="grid gap-3">
          <video src={video.url} controls playsInline className="max-h-[26rem] w-full rounded-xl bg-black" />
          <div className="flex items-center gap-3"><button className="btn btn-primary" onClick={() => downloadBlob(video.blob, "velyto-slideshow.webm")}><Icon name="download" className="h-4 w-4" />Download .webm</button><span className="text-sm text-muted">{fmtBytes(video.blob.size)}</span></div>
        </div>
      )}
    </Panel>
  );
}

/* ===================== Image Converter ===================== */
type ConvOut = { name: string; before: number; blob?: Blob; err?: string };

export function ImageConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [fmt, setFmt] = useState("image/webp");
  const [q, setQ] = useState(85);
  const [outs, setOuts] = useState<ConvOut[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  async function run() {
    setBusy(true);
    setNote("");
    const res: ConvOut[] = [];
    for (const f of files) {
      try {
        const img = await loadImage(f);
        const c = drawScaled(img, img.naturalWidth, img.naturalHeight, img.naturalWidth, img.naturalHeight, fmt === "image/jpeg" ? "#ffffff" : undefined);
        const blob = await canvasBlob(c, fmt, q / 100);
        if (blob.type !== fmt) setNote(`Your browser could not encode ${extFor(fmt).toUpperCase()}; it produced ${blob.type.replace("image/", "").toUpperCase()} instead.`);
        res.push({ name: `${baseName(f.name)}.${extFor(blob.type)}`, before: f.size, blob });
      } catch (e) {
        res.push({ name: f.name, before: f.size, err: (e as Error).message });
      }
    }
    setOuts(res);
    setBusy(false);
  }

  return (
    <Panel className="grid gap-4">
      <Drop accept="image/*" multiple onFiles={(f) => { setFiles(f); setOuts([]); }} label={files.length ? `${files.length} image${files.length > 1 ? "s" : ""} selected` : "Choose images to convert"} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Convert to"><select className="input" value={fmt} onChange={(e) => setFmt(e.target.value)}><option value="image/webp">WebP</option><option value="image/jpeg">JPG</option><option value="image/png">PNG (lossless)</option></select></Field>
        <Range label="Quality (JPG / WebP)" value={q} onChange={setQ} min={30} max={100} unit="%" />
      </div>
      <button className="btn btn-primary w-full sm:w-auto" disabled={!files.length || busy} onClick={run}><Icon name="convert" className="h-4 w-4" />{busy ? "Converting…" : "Convert"}</button>
      {note && <Notice kind="warn">{note}</Notice>}
      {outs.length > 0 && (
        <ul className="grid gap-2">
          {outs.map((o, i) => (
            <li key={i} className="flex flex-wrap items-center gap-3 rounded-xl border border-line p-3">
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{o.name}</p>{o.err ? <p className="text-sm text-bad">{o.err}</p> : <p className="text-xs text-muted">{fmtBytes(o.before)} → <b className="text-fg">{fmtBytes(o.blob!.size)}</b></p>}</div>
              {o.blob && <button className="btn btn-secondary btn-sm" onClick={() => downloadBlob(o.blob!, o.name)}><Icon name="download" className="h-4 w-4" />Download</button>}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ===================== Audio Recorder ===================== */
type Rec = { id: string; url: string; blob: Blob; ext: string; secs: number };

export function AudioRecorder() {
  const [recs, setRecs] = useState<Rec[]>([]);
  const [state, setState] = useState<"idle" | "rec">("idle");
  const [secs, setSecs] = useState(0);
  const [level, setLevel] = useState(0);
  const [err, setErr] = useState("");
  const [opts, setOpts] = useState({ echoCancellation: true, noiseSuppression: true, autoGainControl: true });
  const [ok, setOk] = useState(true);
  const refs = useRef<{ rec?: MediaRecorder; stream?: MediaStream; ctx?: AudioContext; raf?: number; timer?: ReturnType<typeof setInterval> }>({});
  const recsRef = useRef<Rec[]>([]);
  useEffect(() => { recsRef.current = recs; }, [recs]);
  useEffect(() => setOk(typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices?.getUserMedia), []);
  const cleanup = () => {
    const r = refs.current;
    if (r.raf) cancelAnimationFrame(r.raf);
    if (r.timer) clearInterval(r.timer);
    r.stream?.getTracks().forEach((t) => t.stop());
    r.ctx?.close().catch(() => {});
    setLevel(0);
  };
  useEffect(() => () => { cleanup(); recsRef.current.forEach((r) => URL.revokeObjectURL(r.url)); }, []);

  async function start() {
    setErr("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: opts });
      const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"].find((m) => MediaRecorder.isTypeSupported(m));
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      const began = Date.now();
      rec.onstop = () => {
        const type = rec.mimeType || mime || "audio/webm";
        const blob = new Blob(chunks, { type });
        const ext = type.includes("mp4") ? "m4a" : type.includes("ogg") ? "ogg" : "webm";
        setRecs((p) => [{ id: newId(), url: URL.createObjectURL(blob), blob, ext, secs: Math.round((Date.now() - began) / 1000) }, ...p]);
        cleanup();
        setState("idle");
      };
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(an);
      const data = new Uint8Array(an.fftSize);
      const loop = () => {
        an.getByteTimeDomainData(data);
        let peak = 0;
        for (const v of data) peak = Math.max(peak, Math.abs(v - 128));
        setLevel(Math.min(100, Math.round((peak / 128) * 140)));
        refs.current.raf = requestAnimationFrame(loop);
      };
      refs.current = { rec, stream, ctx, raf: requestAnimationFrame(loop), timer: setInterval(() => setSecs(Math.round((Date.now() - began) / 1000)), 250) };
      setSecs(0);
      rec.start();
      setState("rec");
    } catch (e) {
      const n = (e as DOMException).name;
      setErr(n === "NotAllowedError" ? "Microphone permission was denied. Allow it in your browser's address bar and try again." : n === "NotFoundError" ? "No microphone was found on this device." : `Could not start recording: ${(e as Error).message}`);
    }
  }

  if (!ok) return <Panel><Notice kind="warn">Your browser does not support audio recording (MediaRecorder / getUserMedia).</Notice></Panel>;
  const mm = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  return (
    <Panel className="grid gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <button className={`btn ${state === "rec" ? "btn-danger" : "btn-primary"}`} onClick={() => (state === "rec" ? refs.current.rec?.stop() : start())}>
          <Icon name="mic" className="h-4 w-4" />{state === "rec" ? "Stop recording" : "Start recording"}
        </button>
        <output className="font-display text-3xl font-extrabold tabular-nums">{mm}</output>
        <div className="h-3 min-w-[8rem] flex-1 overflow-hidden rounded-full bg-brand-soft" role="meter" aria-label="Input level" aria-valuenow={level} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-brand transition-[width] duration-75" style={{ width: `${level}%` }} /></div>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        {(["echoCancellation", "noiseSuppression", "autoGainControl"] as const).map((k) => (
          <label key={k} className="flex items-center gap-2"><input type="checkbox" disabled={state === "rec"} checked={opts[k]} onChange={(e) => setOpts({ ...opts, [k]: e.target.checked })} />{k === "echoCancellation" ? "Echo cancellation" : k === "noiseSuppression" ? "Noise suppression" : "Auto gain"}</label>
        ))}
      </div>
      {err && <Notice kind="error">{err}</Notice>}
      {recs.length > 0 && (
        <ul className="grid gap-3">
          {recs.map((r, i) => (
            <li key={r.id} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div><p className="mb-1 text-sm font-semibold">Recording {recs.length - i} · {r.secs}s · {fmtBytes(r.blob.size)}</p><audio src={r.url} controls className="w-full" /></div>
              <button className="btn btn-secondary btn-sm" onClick={() => downloadBlob(r.blob, `voice-note-${recs.length - i}.${r.ext}`)}><Icon name="download" className="h-4 w-4" />Download .{r.ext}</button>
            </li>
          ))}
        </ul>
      )}
      <Stat label="Privacy" value="Stays on your device" sub="Recordings are never uploaded. Download before leaving the page." />
    </Panel>
  );
}
