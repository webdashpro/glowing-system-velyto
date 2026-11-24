"use client";
import { useMemo, useState } from "react";
import { downloadBlob } from "@/lib/client";
import { CopyBtn, Drop, Field, Notice, Panel, Stat } from "./ui";
import { Icon } from "../Icon";

const TA = "input min-h-[12rem] font-mono text-sm";

/* ===================== JSON ===================== */
function sortKeys(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === "object") return Object.fromEntries(Object.keys(v as object).sort().map((k) => [k, sortKeys((v as Record<string, unknown>)[k])]));
  return v;
}

export function JsonFormatter() {
  const [src, setSrc] = useState('{"name":"Velyto","tools":34,"free":true,"tags":["browser","private"]}');
  const [indent, setIndent] = useState("2");
  const [sort, setSort] = useState(false);
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const run = (minify: boolean) => {
    try {
      let v = JSON.parse(src);
      if (sort) v = sortKeys(v);
      setOut(JSON.stringify(v, null, minify ? 0 : indent === "tab" ? "\t" : Number(indent)));
      setErr("");
    } catch (e) {
      setErr((e as Error).message);
      setOut("");
    }
  };
  return (
    <Panel className="grid gap-4">
      <Field label="Input JSON"><textarea className={TA} value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} /></Field>
      <div className="flex flex-wrap items-center gap-3">
        <select className="input w-auto" aria-label="Indentation" value={indent} onChange={(e) => setIndent(e.target.value)}><option value="2">2 spaces</option><option value="4">4 spaces</option><option value="tab">Tab</option></select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={sort} onChange={(e) => setSort(e.target.checked)} />Sort keys</label>
        <button className="btn btn-primary" onClick={() => run(false)}>Format</button>
        <button className="btn btn-secondary" onClick={() => run(true)}>Minify</button>
      </div>
      {err && <Notice kind="error">Invalid JSON: {err}</Notice>}
      {out && (<><div className="flex items-center justify-between"><span className="label !mb-0">Output ({out.length.toLocaleString()} chars)</span><CopyBtn text={out} /></div><pre className="max-h-[28rem] overflow-auto rounded-xl border border-line bg-soft p-3 font-mono text-sm">{out}</pre></>)}
    </Panel>
  );
}

/* ===================== Base64 ===================== */
function toB64(s: string, urlSafe: boolean) {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  let b = btoa(bin);
  if (urlSafe) b = b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return b;
}
export function b64ToText(s: string) {
  let t = s.trim().replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, "");
  while (t.length % 4) t += "=";
  const bin = atob(t);
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function Base64Tool() {
  const [mode, setMode] = useState<"enc" | "dec">("enc");
  const [urlSafe, setUrlSafe] = useState(false);
  const [src, setSrc] = useState("Hello, Velyto! नमस्ते 👋");
  const { out, err } = useMemo(() => {
    try {
      return { out: mode === "enc" ? toB64(src, urlSafe) : b64ToText(src), err: "" };
    } catch {
      return { out: "", err: "That is not valid Base64." };
    }
  }, [mode, src, urlSafe]);
  return (
    <Panel className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button className="chip" aria-pressed={mode === "enc"} onClick={() => setMode("enc")}>Encode</button>
        <button className="chip" aria-pressed={mode === "dec"} onClick={() => setMode("dec")}>Decode</button>
        <label className="ml-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={urlSafe} onChange={(e) => setUrlSafe(e.target.checked)} />URL-safe</label>
      </div>
      <Field label={mode === "enc" ? "Text" : "Base64"}><textarea className={TA} value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} /></Field>
      {err ? <Notice kind="error">{err}</Notice> : <><div className="flex items-center justify-between"><span className="label !mb-0">Result</span><CopyBtn text={out} /></div><pre className="max-h-72 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-line bg-soft p-3 font-mono text-sm">{out}</pre></>}
    </Panel>
  );
}

/* ===================== JWT ===================== */
export function JwtDecoder() {
  const [tok, setTok] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlZlbHl0byBEZW1vIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.signature");
  const res = useMemo(() => {
    const parts = tok.trim().split(".");
    if (parts.length < 2) return { err: "A JWT has three dot-separated parts." } as const;
    try {
      const header = JSON.parse(b64ToText(parts[0]));
      const payload = JSON.parse(b64ToText(parts[1]));
      return { header, payload } as const;
    } catch {
      return { err: "Could not decode — check that the token is complete." } as const;
    }
  }, [tok]);
  const ts = (k: string) => {
    if (!("payload" in res)) return null;
    const v = (res.payload as Record<string, unknown>)[k];
    return typeof v === "number" ? new Date(v * 1000) : null;
  };
  const exp = ts("exp");
  return (
    <Panel className="grid gap-4">
      <Field label="JWT"><textarea className={`${TA} !min-h-[7rem]`} value={tok} onChange={(e) => setTok(e.target.value)} spellCheck={false} /></Field>
      {"err" in res ? <Notice kind="error">{res.err}</Notice> : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Expiry" value={exp ? (exp.getTime() < Date.now() ? "Expired" : "Valid (not expired)") : "No exp claim"} sub={exp?.toLocaleString()} />
            <Stat label="Issued at" value={ts("iat")?.toLocaleDateString() ?? "—"} sub={ts("iat")?.toLocaleTimeString()} />
            <Stat label="Algorithm" value={String((res.header as Record<string, unknown>).alg ?? "—")} />
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <div><span className="label">Header</span><pre className="overflow-auto rounded-xl border border-line bg-soft p-3 font-mono text-sm">{JSON.stringify(res.header, null, 2)}</pre></div>
            <div><span className="label">Payload</span><pre className="overflow-auto rounded-xl border border-line bg-soft p-3 font-mono text-sm">{JSON.stringify(res.payload, null, 2)}</pre></div>
          </div>
          <Notice kind="warn">Signature is NOT verified. Decoding does not prove a token is authentic.</Notice>
        </>
      )}
    </Panel>
  );
}

/* ===================== Regex ===================== */
export function RegexTester() {
  const [pat, setPat] = useState("\\b[\\w.+-]+@[\\w-]+\\.[\\w.-]+\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Write to hello@velyto.app or support@example.com for help.");
  const res = useMemo(() => {
    try {
      const re = new RegExp(pat, flags);
      const ms: RegExpMatchArray[] = [];
      if (flags.includes("g")) for (const m of text.matchAll(re)) { ms.push(m); if (ms.length >= 500) break; }
      else { const m = text.match(re); if (m) ms.push(m); }
      return { ms, err: "" };
    } catch (e) {
      return { ms: [] as RegExpMatchArray[], err: (e as Error).message };
    }
  }, [pat, flags, text]);
  const parts = useMemo(() => {
    const out: { t: string; m: boolean }[] = [];
    let last = 0;
    for (const m of res.ms) {
      const i = m.index ?? 0;
      if (m[0].length === 0) continue;
      out.push({ t: text.slice(last, i), m: false }, { t: m[0], m: true });
      last = i + m[0].length;
    }
    out.push({ t: text.slice(last), m: false });
    return out;
  }, [res, text]);
  const toggle = (f: string) => setFlags((s) => (s.includes(f) ? s.replace(f, "") : s + f));
  return (
    <Panel className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <Field label="Pattern"><input className="input font-mono" value={pat} onChange={(e) => setPat(e.target.value)} spellCheck={false} /></Field>
        <div><span className="label">Flags</span><div className="flex gap-1.5">{["g", "i", "m", "s", "u"].map((f) => <button key={f} className="chip font-mono" aria-pressed={flags.includes(f)} onClick={() => toggle(f)}>{f}</button>)}</div></div>
      </div>
      <Field label="Test string"><textarea className={`${TA} !min-h-[8rem]`} value={text} onChange={(e) => setText(e.target.value)} /></Field>
      {res.err ? <Notice kind="error">{res.err}</Notice> : (
        <>
          <p className="text-sm font-semibold">{res.ms.length} match{res.ms.length === 1 ? "" : "es"}</p>
          <div className="whitespace-pre-wrap break-words rounded-xl border border-line bg-soft p-3 font-mono text-sm">{parts.map((p, i) => (p.m ? <mark key={i} className="rounded bg-brand/30 px-0.5 text-fg">{p.t}</mark> : <span key={i}>{p.t}</span>))}</div>
          {res.ms.length > 0 && <ul className="grid gap-1 text-sm">{res.ms.slice(0, 20).map((m, i) => <li key={i} className="rounded-lg border border-line p-2 font-mono"><b>#{i + 1}</b> “{m[0]}” @ {m.index}{m.length > 1 && <span className="text-muted"> · groups: {m.slice(1).map((g) => JSON.stringify(g ?? null)).join(", ")}</span>}{m.groups && <span className="text-muted"> · named: {JSON.stringify(m.groups)}</span>}</li>)}</ul>}
        </>
      )}
    </Panel>
  );
}

/* ===================== Markdown ===================== */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function inline(raw: string) {
  let s = esc(raw);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return s;
}
export function mdToHtml(md: string): string {
  const lines = md.replace(/\r/g, "").split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (/^```/.test(l)) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`);
    } else if (/^#{1,6}\s/.test(l)) {
      const n = l.match(/^#+/)![0].length;
      out.push(`<h${n}>${inline(l.replace(/^#+\s+/, ""))}</h${n}>`);
      i++;
    } else if (/^(-{3,}|\*{3,})\s*$/.test(l)) {
      out.push("<hr/>");
      i++;
    } else if (/^>\s?/.test(l)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote>${inline(buf.join(" "))}</blockquote>`);
    } else if (/^\s*([-*+]|\d+\.)\s+/.test(l)) {
      const ordered = /^\s*\d+\./.test(l);
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*+]|\d+\.)\s+/.test(lines[i])) items.push(`<li>${inline(lines[i++].replace(/^\s*([-*+]|\d+\.)\s+/, ""))}</li>`);
      out.push(`<${ordered ? "ol" : "ul"}>${items.join("")}</${ordered ? "ol" : "ul"}>`);
    } else if (l.includes("|") && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1] ?? "")) {
      const cells = (r: string) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(l);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) rows.push(cells(lines[i++]));
      out.push(`<table><thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
    } else if (l.trim() === "") i++;
    else {
      const buf: string[] = [];
      while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,6}\s|```|>|\s*([-*+]|\d+\.)\s)/.test(lines[i])) buf.push(lines[i++]);
      out.push(`<p>${inline(buf.join(" "))}</p>`);
    }
  }
  return out.join("\n");
}

export function MarkdownPreview() {
  const [md, setMd] = useState("# Hello Velyto\n\nWrite **Markdown** on the left. It supports *italic*, `code`, [links](https://velyto.netlify.app) and:\n\n- bullet lists\n- numbered lists\n\n> Blockquotes too.\n\n| Tool | Free |\n| --- | --- |\n| Markdown | Yes |\n");
  const html = useMemo(() => mdToHtml(md), [md]);
  return (
    <Panel className="grid gap-4 lg:grid-cols-2">
      <Field label="Markdown"><textarea className={`${TA} !min-h-[22rem]`} value={md} onChange={(e) => setMd(e.target.value)} spellCheck={false} /></Field>
      <div>
        <div className="mb-1 flex items-center justify-between"><span className="label !mb-0">Preview</span><CopyBtn text={html} label="Copy HTML" /></div>
        <div className="md-preview min-h-[22rem] overflow-auto rounded-xl border border-line bg-surface p-4" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </Panel>
  );
}

/* ===================== Diff ===================== */
export function DiffChecker() {
  const [a, setA] = useState("Free tools\nNo uploads\nWorks offline\nBlue and white");
  const [b, setB] = useState("Free tools\nZero uploads\nWorks offline\nBlue and white\nDark mode included");
  const [ws, setWs] = useState(false);
  const [run, setRun] = useState(true);
  const diff = useMemo(() => {
    if (!run) return null;
    const A = a.split("\n").slice(0, 2000);
    const B = b.split("\n").slice(0, 2000);
    const n = (s: string) => (ws ? s.replace(/\s+/g, " ").trim() : s);
    const na = A.map(n);
    const nb = B.map(n);
    const w = B.length + 1;
    const dp = new Uint16Array((A.length + 1) * w);
    for (let i = A.length - 1; i >= 0; i--) for (let j = B.length - 1; j >= 0; j--) dp[i * w + j] = na[i] === nb[j] ? dp[(i + 1) * w + j + 1] + 1 : Math.max(dp[(i + 1) * w + j], dp[i * w + j + 1]);
    const ops: { t: " " | "+" | "-"; s: string }[] = [];
    let i = 0;
    let j = 0;
    while (i < A.length && j < B.length) {
      if (na[i] === nb[j]) { ops.push({ t: " ", s: B[j] }); i++; j++; }
      else if (dp[(i + 1) * w + j] >= dp[i * w + j + 1]) ops.push({ t: "-", s: A[i++] });
      else ops.push({ t: "+", s: B[j++] });
    }
    while (i < A.length) ops.push({ t: "-", s: A[i++] });
    while (j < B.length) ops.push({ t: "+", s: B[j++] });
    return ops;
  }, [a, b, ws, run]);
  return (
    <Panel className="grid gap-4">
      <div className="grid gap-3 lg:grid-cols-2">
        <Field label="Original"><textarea className={TA} value={a} onChange={(e) => { setA(e.target.value); setRun(true); }} spellCheck={false} /></Field>
        <Field label="Changed"><textarea className={TA} value={b} onChange={(e) => { setB(e.target.value); setRun(true); }} spellCheck={false} /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={ws} onChange={(e) => setWs(e.target.checked)} />Ignore whitespace</label>
      {diff && (
        <>
          <div className="grid gap-3 sm:grid-cols-3"><Stat label="Added" value={`+${diff.filter((d) => d.t === "+").length}`} /><Stat label="Removed" value={`−${diff.filter((d) => d.t === "-").length}`} /><Stat label="Unchanged" value={diff.filter((d) => d.t === " ").length} /></div>
          <pre className="max-h-[26rem] overflow-auto rounded-xl border border-line bg-soft p-2 font-mono text-sm">{diff.map((d, k) => <div key={k} className={d.t === "+" ? "diff-add" : d.t === "-" ? "diff-del" : ""}>{d.t === " " ? "  " : `${d.t} `}{d.s || " "}</div>)}</pre>
        </>
      )}
    </Panel>
  );
}

/* ===================== Minifier ===================== */
function minCss(s: string) {
  return s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([{};:,>])\s*/g, "$1").replace(/;}/g, "}").trim();
}
function minHtml(s: string) {
  const keep: string[] = [];
  let t = s.replace(/<(pre|textarea|script|style)\b[\s\S]*?<\/\1>/gi, (m) => `\u0000${keep.push(m) - 1}\u0000`);
  t = t.replace(/<!--(?!\[if)[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").replace(/\n/g, " ").trim();
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => keep[Number(i)]);
}
export function Minifier() {
  const [mode, setMode] = useState<"css" | "html">("css");
  const [src, setSrc] = useState("/* Brand button */\n.btn {\n  color: #fff;\n  background: #2563eb;\n  padding: 12px 18px;\n}\n");
  const out = mode === "css" ? minCss(src) : minHtml(src);
  const saved = src.length ? Math.round((1 - out.length / src.length) * 100) : 0;
  return (
    <Panel className="grid gap-4">
      <div className="flex gap-2"><button className="chip" aria-pressed={mode === "css"} onClick={() => setMode("css")}>CSS</button><button className="chip" aria-pressed={mode === "html"} onClick={() => setMode("html")}>HTML</button></div>
      <Field label={`${mode.toUpperCase()} input`}><textarea className={TA} value={src} onChange={(e) => setSrc(e.target.value)} spellCheck={false} /></Field>
      <div className="grid gap-3 sm:grid-cols-3"><Stat label="Before" value={`${src.length} B`} /><Stat label="After" value={`${out.length} B`} /><Stat label="Saved" value={`${saved}%`} /></div>
      <div className="flex items-center justify-between"><span className="label !mb-0">Minified output</span><CopyBtn text={out} /></div>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-line bg-soft p-3 font-mono text-sm">{out}</pre>
    </Panel>
  );
}

/* ===================== CSV ===================== */
function parseCsv(text: string, delim: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === delim) { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; }
    else cur += c;
  }
  if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((c) => c !== ""));
}

export function CsvViewer() {
  const [text, setText] = useState("name,city,score\nAsha,Mumbai,92\nBen,London,88\nChen,Singapore,95\n\"Diaz, Maria\",Madrid,79");
  const [header, setHeader] = useState(true);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ c: number; dir: 1 | -1 } | null>(null);
  const { rows, delim } = useMemo(() => {
    const first = text.split("\n")[0] ?? "";
    const d = [",", ";", "\t", "|"].map((x) => [x, first.split(x).length] as const).sort((a, b) => b[1] - a[1])[0][0];
    return { rows: parseCsv(text, d), delim: d };
  }, [text]);
  const head = header ? rows[0] ?? [] : (rows[0] ?? []).map((_, i) => `Column ${i + 1}`);
  let body = header ? rows.slice(1) : rows;
  if (q) body = body.filter((r) => r.some((c) => c.toLowerCase().includes(q.toLowerCase())));
  if (sort) body = body.slice().sort((a, b) => { const x = a[sort.c] ?? ""; const y = b[sort.c] ?? ""; const nx = parseFloat(x); const ny = parseFloat(y); return (!isNaN(nx) && !isNaN(ny) ? nx - ny : x.localeCompare(y)) * sort.dir; });
  const toJson = () => downloadBlob(new Blob([JSON.stringify(body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""]))), null, 2)], { type: "application/json" }), "data.json");
  return (
    <Panel className="grid gap-4">
      <Drop accept=".csv,.tsv,.txt,text/csv" onFiles={async (f) => setText(await f[0].text())} label="Open a CSV file" hint="or paste CSV below" />
      <textarea className={`${TA} !min-h-[6rem]`} value={text} onChange={(e) => setText(e.target.value)} aria-label="CSV text" spellCheck={false} />
      <div className="flex flex-wrap items-center gap-3">
        <input className="input max-w-xs" placeholder="Filter rows…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter rows" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={header} onChange={(e) => setHeader(e.target.checked)} />First row is header</label>
        <span className="text-xs text-muted">Delimiter: {delim === "\t" ? "tab" : delim} · {body.length} rows</span>
        <button className="btn btn-secondary btn-sm ml-auto" onClick={toJson}><Icon name="download" className="h-4 w-4" />JSON</button>
      </div>
      <div className="table-wrap max-h-[28rem] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-soft text-left"><tr>{head.map((h, i) => <th key={i} className="whitespace-nowrap p-2"><button className="font-bold hover:text-brand-link" onClick={() => setSort(sort?.c === i ? { c: i, dir: (sort.dir * -1) as 1 | -1 } : { c: i, dir: 1 })}>{h}{sort?.c === i ? (sort.dir === 1 ? " ▲" : " ▼") : ""}</button></th>)}</tr></thead>
          <tbody>{body.slice(0, 500).map((r, i) => <tr key={i} className="border-t border-line">{head.map((_, c) => <td key={c} className="p-2">{r[c]}</td>)}</tr>)}</tbody>
        </table>
      </div>
      {body.length > 500 && <p className="text-xs text-muted">Showing the first 500 of {body.length} rows.</p>}
    </Panel>
  );
}

/* ===================== Text analyzer ===================== */
const STOP = new Set("a an the and or but if of to in on at for with as by is are was were be been it this that these those from not no so we you i he she they them his her our your their my me do does did have has had will would can could should may might than then there here what which who whom how when where why also into about over under more most some any each other such only own same too very just".split(" "));

export function TextAnalyzer() {
  const [t, setT] = useState("Velyto brings free browser tools together. Resize photos, compress images, build invoices and study smarter — everything runs on your device.\n\nNothing is uploaded. Nothing is sold.");
  const s = useMemo(() => {
    const words = t.match(/[\p{L}\p{N}'’-]+/gu) ?? [];
    const sentences = (t.match(/[^.!?।]+[.!?।]+|[^.!?।]+$/g) ?? []).filter((x) => x.trim()).length;
    const paragraphs = t.split(/\n\s*\n/).filter((x) => x.trim()).length;
    const freq = new Map<string, number>();
    for (const w of words) { const k = w.toLowerCase(); if (k.length > 2 && !STOP.has(k)) freq.set(k, (freq.get(k) ?? 0) + 1); }
    const top = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
    return { words: words.length, chars: [...t].length, noSpace: [...t.replace(/\s/g, "")].length, sentences, paragraphs, top, longest, avg: words.length ? (words.join("").length / words.length).toFixed(1) : "0", read: Math.max(words.length ? 1 : 0, Math.ceil(words.length / 238)), speak: Math.max(words.length ? 1 : 0, Math.ceil(words.length / 150)) };
  }, [t]);
  return (
    <Panel className="grid gap-4">
      <Field label="Your text"><textarea className={`${TA} !min-h-[12rem]`} value={t} onChange={(e) => setT(e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><Stat label="Words" value={s.words} /><Stat label="Characters" value={s.chars} sub={`${s.noSpace} without spaces`} /><Stat label="Sentences" value={s.sentences} /><Stat label="Paragraphs" value={s.paragraphs} /><Stat label="Reading time" value={`${s.read} min`} /><Stat label="Speaking time" value={`${s.speak} min`} /><Stat label="Avg word length" value={s.avg} /><Stat label="Longest word" value={s.longest || "—"} /></div>
      {s.top.length > 0 && <div><span className="label">Top keywords</span><div className="flex flex-wrap gap-2">{s.top.map(([w, n]) => <span key={w} className="chip cursor-default">{w} <b className="text-brand-link">{n}</b></span>)}</div></div>}
    </Panel>
  );
}

/* ===================== Case converter ===================== */
const SMALL = new Set(["a", "an", "the", "and", "or", "but", "of", "in", "on", "at", "to", "for", "with", "by", "as", "nor"]);
const words = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1 $2").split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const CASES: [string, (s: string) => string][] = [
  ["UPPERCASE", (s) => s.toUpperCase()],
  ["lowercase", (s) => s.toLowerCase()],
  ["Title Case", (s) => s.toLowerCase().replace(/\p{L}[\p{L}\p{N}'’]*/gu, (w, i) => (i > 0 && SMALL.has(w) ? w : w[0].toUpperCase() + w.slice(1)))],
  ["Sentence case", (s) => s.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_, a, b) => a + b.toUpperCase())],
  ["camelCase", (s) => words(s).map((w, i) => (i ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase())).join("")],
  ["PascalCase", (s) => words(s).map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join("")],
  ["snake_case", (s) => words(s).map((w) => w.toLowerCase()).join("_")],
  ["kebab-case", (s) => words(s).map((w) => w.toLowerCase()).join("-")],
  ["CONSTANT_CASE", (s) => words(s).map((w) => w.toUpperCase()).join("_")],
  ["aLtErNaTiNg", (s) => [...s].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join("")],
];
export function CaseConverter() {
  const [t, setT] = useState("free tools for everyone: no uploads, no sign-up");
  return (
    <Panel className="grid gap-4">
      <Field label="Text"><textarea className={`${TA} !min-h-[9rem]`} value={t} onChange={(e) => setT(e.target.value)} /></Field>
      <div className="flex flex-wrap gap-2">{CASES.map(([l, f]) => <button key={l} className="chip" onClick={() => setT(f(t))}>{l}</button>)}</div>
      <div><CopyBtn text={t} label="Copy text" /></div>
    </Panel>
  );
}

/* ===================== Color ===================== */
type RGB = [number, number, number];
const clamp = (n: number, a = 0, b = 255) => Math.min(b, Math.max(a, n));
const toHex = ([r, g, b]: RGB) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
function rgbToHsl([r, g, b]: RGB): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  const l = (mx + mn) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [Math.round(((h * 60 + 360) % 360)), Math.round(s * 100), Math.round(l * 100)];
}
function hslToRgb(h: number, s: number, l: number): RGB {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}
const lum = ([r, g, b]: RGB) => { const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a: RGB, b: RGB) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

export function ColorConverter() {
  const [rgb, setRgb] = useState<RGB>([37, 99, 235]);
  const [draft, setDraft] = useState<{ hex?: string; rgb?: string; hsl?: string }>({});
  const hex = toHex(rgb);
  const hsl = rgbToHsl(rgb);
  const vals = { hex, rgb: `rgb(${rgb.join(", ")})`, hsl: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` };
  const set = (k: "hex" | "rgb" | "hsl", v: string) => {
    setDraft({ [k]: v });
    let next: RGB | null = null;
    if (k === "hex") {
      let h = v.trim().replace(/^#/, "");
      if (/^[0-9a-f]{3}$/i.test(h)) h = h.split("").map((c) => c + c).join("");
      if (/^[0-9a-f]{6}$/i.test(h)) next = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    } else {
      const n = (v.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
      if (n.length >= 3) next = k === "rgb" ? [clamp(n[0]), clamp(n[1]), clamp(n[2])] : hslToRgb(clamp(n[0], 0, 360), clamp(n[1], 0, 100), clamp(n[2], 0, 100));
    }
    if (next) { setRgb(next); setDraft({ [k]: v }); }
  };
  const cw = ratio(rgb, [255, 255, 255]);
  const cb = ratio(rgb, [0, 0, 0]);
  const grade = (r: number) => (r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA Large only" : "Fail");
  return (
    <Panel className="grid gap-4 lg:grid-cols-[14rem_1fr]">
      <div className="grid content-start gap-3">
        <div className="h-32 rounded-xl border border-line" style={{ background: hex }} aria-label={`Colour ${hex}`} />
        <input type="color" className="input h-11 p-1" value={hex.toLowerCase()} onChange={(e) => { setDraft({}); set("hex", e.target.value); setDraft({}); }} aria-label="Colour picker" />
      </div>
      <div className="grid gap-3">
        {(["hex", "rgb", "hsl"] as const).map((k) => (
          <div key={k} className="flex items-end gap-2"><Field label={k.toUpperCase()} className="flex-1"><input className="input font-mono" value={draft[k] ?? vals[k]} onChange={(e) => set(k, e.target.value)} onBlur={() => setDraft({})} /></Field><CopyBtn text={vals[k]} /></div>
        ))}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl p-3 text-sm font-semibold" style={{ background: hex, color: "#fff" }}>White text · {cw.toFixed(2)}:1 · {grade(cw)}</div>
          <div className="rounded-xl p-3 text-sm font-semibold" style={{ background: hex, color: "#000" }}>Black text · {cb.toFixed(2)}:1 · {grade(cb)}</div>
        </div>
      </div>
    </Panel>
  );
}
