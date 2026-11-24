"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { api, downloadBlob, useLocalState, useUser } from "@/lib/client";
import { CURRENCIES, money, pdfMoney } from "@/data/currencies";
import { docBySlug, type DocType } from "@/data/business";
import { pdfBlob } from "@/lib/image";
import { safe, wrap } from "@/lib/pdf";
import { Field, Notice, Panel, Stat } from "./tools/ui";
import { Icon } from "./Icon";

type Item = { id: string; desc: string; qty: number; rate: number; tax: number; cat: string; date: string };
type Doc = {
  id?: string; number: string; date: string; due: string; currency: string;
  fromName: string; fromAddress: string; fromTaxId: string;
  clientName: string; clientEmail: string; clientPhone: string; clientAddress: string;
  items: Item[]; discount: number; notes: string; method: string; reference: string; received: number;
};
type Saved = { id: string; type: string; number: string; clientName: string; currency: string; total: string; data: Doc; updatedAt: string };
type Client = { id: string; name: string; email: string; phone: string; address: string };

const PREFIX: Record<DocType, string> = { invoice: "INV", bill: "BILL", quotation: "QUO", receipt: "RCT", expense: "EXP" };
const iso = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const nid = () => Math.random().toString(36).slice(2, 9);
const blankItem = (): Item => ({ id: nid(), desc: "", qty: 1, rate: 0, tax: 0, cat: "General", date: iso() });

function blank(type: DocType): Doc {
  return { number: `${PREFIX[type]}-${new Date().getFullYear()}-001`, date: "", due: "", currency: "USD", fromName: "", fromAddress: "", fromTaxId: "", clientName: "", clientEmail: "", clientPhone: "", clientAddress: "", items: [{ ...blankItem(), date: "" }], discount: 0, notes: "", method: "Bank transfer", reference: "", received: 0 };
}
function sample(type: DocType): Doc {
  const today = iso();
  const d = blank(type);
  const base = { ...d, date: today, due: iso(new Date(Date.now() + 14 * 86400000)), currency: type === "expense" ? "USD" : "EUR", fromName: "Northwind Design Studio", fromAddress: "12 Harbour Street\nLisbon, Portugal", fromTaxId: "VAT PT123456789", clientName: "Orbit Labs GmbH", clientEmail: "accounts@orbitlabs.example", clientAddress: "Torstrasse 45\n10119 Berlin, Germany", notes: type === "quotation" ? "Valid for 14 days. 50% advance to begin work." : "Payment due within 14 days. Thank you for your business!" };
  if (type === "expense") return { ...base, items: [["Flights to client meeting", "Travel", 420], ["Hotel (2 nights)", "Travel", 310], ["Software subscription", "Software", 49], ["Team lunch", "Meals", 86.5]].map(([desc, cat, rate]) => ({ id: nid(), desc: desc as string, cat: cat as string, rate: rate as number, qty: 1, tax: 0, date: today })) };
  return { ...base, items: [{ id: nid(), desc: "Brand identity design", qty: 1, rate: 1800, tax: 19, cat: "", date: "" }, { id: nid(), desc: "Landing page design (5 sections)", qty: 1, rate: 900, tax: 19, cat: "", date: "" }, { id: nid(), desc: "Revision rounds", qty: 3, rate: 120, tax: 19, cat: "", date: "" }], discount: 5, received: type === "receipt" ? 1500 : 0, reference: type === "receipt" ? "INV-2026-001" : "" };
}

function totals(d: Doc, type: DocType) {
  const sub = d.items.reduce((s, i) => s + (type === "expense" ? 1 : i.qty || 0) * (i.rate || 0), 0);
  const tax = type === "expense" ? 0 : d.items.reduce((s, i) => s + (i.qty || 0) * (i.rate || 0) * ((i.tax || 0) / 100), 0);
  const disc = type === "expense" ? 0 : sub * ((d.discount || 0) / 100);
  return { sub, tax, disc, total: sub - disc + tax };
}

export default function DocGenerator({ type }: { type: DocType }) {
  const meta = docBySlug(type === "invoice" ? "invoice-generator" : type === "bill" ? "bill-generator" : type === "quotation" ? "quotation-generator" : type === "receipt" ? "receipt-generator" : "expense-calculator")!;
  const [d, setD, ready] = useLocalState<Doc>(`velyto.biz.${type}`, blank(type));
  const user = useUser();
  const [saved, setSaved] = useState<Saved[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && !d.date) setD((p) => ({ ...p, date: iso(), items: p.items.map((i) => ({ ...i, date: i.date || iso() })) }));
  }, [ready, d.date, setD]);
  const refresh = () => api<{ docs: Saved[]; clients: Client[] }>(`/api/business/docs?type=${type}`).then((r) => { if (r.ok) { setSaved(r.data.docs); setClients(r.data.clients); } });
  useEffect(() => { if (user) refresh(); }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof Doc>(k: K, v: Doc[K]) => setD((p) => ({ ...p, [k]: v }));
  const setItem = (id: string, patch: Partial<Item>) => setD((p) => ({ ...p, items: p.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));
  const t = useMemo(() => totals(d, type), [d, type]);
  const cur = d.currency;
  const balance = t.total - (d.received || 0);
  const catTotals = useMemo(() => { const m = new Map<string, number>(); d.items.forEach((i) => m.set(i.cat || "General", (m.get(i.cat || "General") ?? 0) + (i.rate || 0))); return [...m.entries()].sort((a, b) => b[1] - a[1]); }, [d.items]);

  async function pdf() {
    const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
    const doc = await PDFDocument.create();
    const reg = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const W = 595.28, H = 841.89, M = 44;
    const blue = rgb(0.145, 0.388, 0.922), ink = rgb(0.04, 0.09, 0.19), grey = rgb(0.38, 0.43, 0.52), line = rgb(0.88, 0.91, 0.96);
    let page = doc.addPage([W, H]);
    let y = H - M;
    const newPage = () => { page = doc.addPage([W, H]); y = H - M; };
    const need = (n: number) => { if (y - n < M + 20) newPage(); };
    const draw = (txt: string, x: number, size = 10, font = reg, color = ink, align: "l" | "r" = "l", maxW?: number) => {
      const s = safe(txt);
      const w = font.widthOfTextAtSize(s, size);
      page.drawText(s, { x: align === "r" ? x - w : x, y: y - size, size, font, color, maxWidth: maxW });
    };
    page.drawRectangle({ x: 0, y: H - 10, width: W, height: 10, color: blue });
    y -= 6;
    draw(meta.pdfTitle, M, 24, bold, blue);
    draw(`# ${d.number}`, W - M, 11, bold, ink, "r");
    y -= 30;
    draw(`Date: ${d.date}`, W - M, 9, reg, grey, "r");
    if (type !== "expense" && type !== "receipt" && d.due) { y -= 13; draw(`${type === "quotation" ? "Valid until" : "Due"}: ${d.due}`, W - M, 9, reg, grey, "r"); }
    y += type !== "expense" && type !== "receipt" && d.due ? 13 : 0;
    // From / To
    const block = (title: string, lines: string[], x: number, w: number) => {
      let yy = y;
      page.drawText(title, { x, y: yy - 9, size: 8.5, font: bold, color: grey });
      yy -= 14;
      for (const l of lines.filter(Boolean).flatMap((s) => wrap(reg, s, 10, w))) { page.drawText(l, { x, y: yy - 10, size: 10, font: reg, color: ink }); yy -= 13; }
      return yy;
    };
    const left = block(type === "expense" ? "SUBMITTED BY" : "FROM", [d.fromName, d.fromAddress, d.fromTaxId], M, 230);
    const right = type === "expense" ? y : block(type === "receipt" ? "RECEIVED FROM" : type === "quotation" ? "PREPARED FOR" : "BILL TO", [d.clientName, d.clientAddress, d.clientEmail, d.clientPhone], 320, 230);
    y = Math.min(left, right) - 14;
    if (type === "receipt") {
      page.drawRectangle({ x: M, y: y - 56, width: W - M * 2, height: 56, color: rgb(0.92, 0.95, 1) });
      page.drawText("AMOUNT RECEIVED", { x: M + 14, y: y - 20, size: 9, font: bold, color: grey });
      page.drawText(safe(pdfMoney(d.received || 0, cur)), { x: M + 14, y: y - 44, size: 22, font: bold, color: blue });
      page.drawText(safe(`Method: ${d.method}${d.reference ? `  |  Ref: ${d.reference}` : ""}`), { x: 300, y: y - 30, size: 10, font: reg, color: ink });
      y -= 74;
    }
    // table
    const cols = type === "expense" ? { desc: M + 6, mid: 330, rate: W - M - 6 } : { desc: M + 6, qty: 330, rate: 395, tax: 455, amt: W - M - 6 };
    const head = () => {
      page.drawRectangle({ x: M, y: y - 22, width: W - M * 2, height: 22, color: blue });
      const h = (s: string, x: number, a: "l" | "r" = "l") => { const w = bold.widthOfTextAtSize(s, 9); page.drawText(s, { x: a === "r" ? x - w : x, y: y - 15, size: 9, font: bold, color: rgb(1, 1, 1) }); };
      if (type === "expense") { h("DESCRIPTION", cols.desc); h("DATE / CATEGORY", 330); h("AMOUNT", W - M - 6, "r"); }
      else { h(type === "receipt" ? "PAYMENT FOR" : "DESCRIPTION", cols.desc); h("QTY", 345, "r"); h("RATE", 430, "r"); h("TAX", 480, "r"); h("AMOUNT", W - M - 6, "r"); }
      y -= 26;
    };
    head();
    for (const it of d.items.filter((i) => i.desc || i.rate)) {
      const lines = wrap(reg, it.desc || "—", 10, type === "expense" ? 260 : 270);
      const h = Math.max(1, lines.length) * 13 + 8;
      if (y - h < M + 40) { newPage(); head(); }
      lines.forEach((l, k) => page.drawText(l, { x: M + 6, y: y - 11 - k * 13, size: 10, font: reg, color: ink }));
      const r = (s: string, x: number) => { const t2 = safe(s); page.drawText(t2, { x: x - reg.widthOfTextAtSize(t2, 10), y: y - 11, size: 10, font: reg, color: ink }); };
      if (type === "expense") { page.drawText(safe(`${it.date} · ${it.cat}`), { x: 330, y: y - 11, size: 9, font: reg, color: grey }); r(pdfMoney(it.rate || 0, cur), W - M - 6); }
      else { r(String(it.qty), 345); r(pdfMoney(it.rate || 0, cur), 430); r(`${it.tax || 0}%`, 480); r(pdfMoney((it.qty || 0) * (it.rate || 0), cur), W - M - 6); }
      y -= h;
      page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: line });
    }
    y -= 12;
    need(110);
    const tr = (label: string, val: string, b = false, color = ink) => { page.drawText(safe(label), { x: 350, y: y - 10, size: b ? 12 : 10, font: b ? bold : reg, color: b ? ink : grey }); const s = safe(val); page.drawText(s, { x: W - M - 6 - (b ? bold : reg).widthOfTextAtSize(s, b ? 13 : 10), y: y - (b ? 11 : 10), size: b ? 13 : 10, font: b ? bold : reg, color }); y -= b ? 22 : 16; };
    if (type !== "expense") { tr("Subtotal", pdfMoney(t.sub, cur)); if (t.disc) tr(`Discount (${d.discount}%)`, `- ${pdfMoney(t.disc, cur)}`); if (t.tax) tr("Tax", pdfMoney(t.tax, cur)); }
    page.drawLine({ start: { x: 350, y: y + 4 }, end: { x: W - M, y: y + 4 }, thickness: 1, color: blue });
    y -= 4;
    tr(type === "expense" ? "TOTAL EXPENSES" : type === "receipt" ? "Invoice total" : "TOTAL", pdfMoney(t.total, cur), true, blue);
    if (type === "receipt") tr(balance > 0.005 ? "Balance due" : "Paid in full", balance > 0.005 ? pdfMoney(balance, cur) : "✓".replace("✓", "-"), false, balance > 0.005 ? rgb(0.73, 0.11, 0.11) : rgb(0.02, 0.47, 0.34));
    if (type === "expense" && catTotals.length) {
      y -= 6; need(30 + catTotals.length * 14);
      page.drawText("BY CATEGORY", { x: M, y: y - 9, size: 9, font: bold, color: grey }); y -= 18;
      for (const [c, v] of catTotals) { page.drawText(safe(c), { x: M + 6, y: y - 10, size: 10, font: reg, color: ink }); const s = safe(pdfMoney(v, cur)); page.drawText(s, { x: 250 - reg.widthOfTextAtSize(s, 10), y: y - 10, size: 10, font: reg, color: ink }); y -= 14; }
    }
    if (d.notes.trim()) { y -= 14; need(50); page.drawText("NOTES", { x: M, y: y - 9, size: 8.5, font: bold, color: grey }); y -= 14; for (const l of wrap(reg, d.notes, 10, W - M * 2)) { need(14); page.drawText(l, { x: M, y: y - 10, size: 10, font: reg, color: ink }); y -= 13; } }
    for (const p of doc.getPages()) p.drawText("Generated with Velyto Business — velyto.netlify.app/business", { x: M, y: 22, size: 8, font: reg, color: grey });
    downloadBlob(pdfBlob(await doc.save()), `${meta.slug.split("-")[0]}-${d.number.replace(/\W+/g, "-")}.pdf`);
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    const r = await api<{ doc?: Saved; error?: string }>("/api/business/docs", "POST", { id: d.id, type, number: d.number, clientName: d.clientName || d.fromName, currency: cur, total: type === "receipt" ? d.received : t.total, data: d, client: { name: d.clientName, email: d.clientEmail, phone: d.clientPhone, address: d.clientAddress } });
    if (r.ok && r.data.doc) { setD((p) => ({ ...p, id: r.data.doc!.id })); setMsg({ kind: "ok", text: "Saved to your account." }); refresh(); }
    else setMsg({ kind: "error", text: r.data.error ?? "Could not save." });
    setBusy(false);
  }

  const expense = type === "expense";
  const receipt = type === "receipt";
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
      <div className="grid content-start gap-4">
        <Panel className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label={`${meta.name.replace(" Generator", "").replace(" Calculator", "")} number`}><input className="input" value={d.number} onChange={(e) => set("number", e.target.value)} /></Field>
          <Field label="Date"><input type="date" className="input" value={d.date} onChange={(e) => set("date", e.target.value)} /></Field>
          {!expense && !receipt && <Field label={type === "quotation" ? "Valid until" : "Due date"}><input type="date" className="input" value={d.due} onChange={(e) => set("due", e.target.value)} /></Field>}
          <Field label="Currency"><select className="input" value={cur} onChange={(e) => set("currency", e.target.value)}>{CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>)}</select></Field>
        </Panel>
        <div className="grid gap-4 md:grid-cols-2">
          <Panel className="grid gap-2"><h3 className="font-display font-bold">{expense ? "Submitted by" : "Your business"}</h3>
            <input className="input" placeholder="Business / your name" aria-label="Your name" value={d.fromName} onChange={(e) => set("fromName", e.target.value)} />
            <textarea className="input" rows={2} placeholder="Address" aria-label="Your address" value={d.fromAddress} onChange={(e) => set("fromAddress", e.target.value)} />
            <input className="input" placeholder="Tax ID (GSTIN / VAT / EIN)" aria-label="Tax ID" value={d.fromTaxId} onChange={(e) => set("fromTaxId", e.target.value)} />
          </Panel>
          {!expense && (
            <Panel className="grid gap-2"><div className="flex items-center justify-between gap-2"><h3 className="font-display font-bold">{receipt ? "Received from" : "Client"}</h3>
              {clients.length > 0 && <select className="input !w-auto !py-1 text-xs" aria-label="Pick saved client" value="" onChange={(e) => { const c = clients.find((x) => x.id === e.target.value); if (c) setD((p) => ({ ...p, clientName: c.name, clientEmail: c.email, clientPhone: c.phone, clientAddress: c.address })); }}><option value="">Saved clients…</option>{clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>}
            </div>
              <input className="input" placeholder="Client name" aria-label="Client name" value={d.clientName} onChange={(e) => set("clientName", e.target.value)} />
              <textarea className="input" rows={2} placeholder="Address" aria-label="Client address" value={d.clientAddress} onChange={(e) => set("clientAddress", e.target.value)} />
              <div className="grid grid-cols-2 gap-2"><input className="input" placeholder="Email" aria-label="Client email" value={d.clientEmail} onChange={(e) => set("clientEmail", e.target.value)} /><input className="input" placeholder="Phone" aria-label="Client phone" value={d.clientPhone} onChange={(e) => set("clientPhone", e.target.value)} /></div>
            </Panel>
          )}
        </div>
        <Panel className="grid gap-3">
          <div className="flex items-center justify-between"><h3 className="font-display font-bold">{expense ? "Expenses" : receipt ? "Payment for" : "Line items"}</h3><button className="btn btn-secondary btn-sm" onClick={() => set("items", [...d.items, blankItem()])}><Icon name="plus" className="h-4 w-4" />Add {expense ? "expense" : "item"}</button></div>
          <ul className="grid gap-2">
            {d.items.map((i) => (
              <li key={i.id} className={`grid gap-2 rounded-xl border border-line p-2.5 ${expense ? "sm:grid-cols-[8rem_9rem_1fr_7rem_auto]" : "sm:grid-cols-[1fr_5rem_7rem_5rem_auto]"}`}>
                {expense && <input type="date" className="input" aria-label="Date" value={i.date} onChange={(e) => setItem(i.id, { date: e.target.value })} />}
                {expense && <input className="input" aria-label="Category" placeholder="Category" list="cats" value={i.cat} onChange={(e) => setItem(i.id, { cat: e.target.value })} />}
                <input className="input" aria-label="Description" placeholder="Description" value={i.desc} onChange={(e) => setItem(i.id, { desc: e.target.value })} />
                {!expense && <input className="input" type="number" min={0} step="any" aria-label="Quantity" placeholder="Qty" value={i.qty || ""} onChange={(e) => setItem(i.id, { qty: Number(e.target.value) })} />}
                <input className="input" type="number" min={0} step="any" aria-label={expense ? "Amount" : "Rate"} placeholder={expense ? "Amount" : "Rate"} value={i.rate || ""} onChange={(e) => setItem(i.id, { rate: Number(e.target.value) })} />
                {!expense && <input className="input" type="number" min={0} max={100} step="any" aria-label="Tax percent" placeholder="Tax %" value={i.tax || ""} onChange={(e) => setItem(i.id, { tax: Number(e.target.value) })} />}
                <button className="btn btn-ghost btn-sm text-bad" aria-label="Remove line" disabled={d.items.length === 1} onClick={() => set("items", d.items.filter((x) => x.id !== i.id))}><Icon name="trash" className="h-4 w-4" /></button>
              </li>
            ))}
          </ul>
          <datalist id="cats">{["Travel", "Meals", "Software", "Office", "Marketing", "Utilities", "General"].map((c) => <option key={c} value={c} />)}</datalist>
          {!expense && <div className="grid gap-3 sm:grid-cols-3"><Field label="Discount (%)"><input className="input" type="number" min={0} max={100} step="any" value={d.discount || ""} onChange={(e) => set("discount", Number(e.target.value))} /></Field>
            {receipt && <><Field label="Payment method"><select className="input" value={d.method} onChange={(e) => set("method", e.target.value)}>{["Cash", "Bank transfer", "UPI", "Card", "Cheque", "PayPal / online"].map((m) => <option key={m}>{m}</option>)}</select></Field><Field label="Reference / invoice no."><input className="input" value={d.reference} onChange={(e) => set("reference", e.target.value)} /></Field><Field label="Amount received"><input className="input" type="number" min={0} step="any" value={d.received || ""} onChange={(e) => set("received", Number(e.target.value))} /></Field></>}
          </div>}
          <Field label="Notes / terms"><textarea className="input" rows={2} value={d.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Payment instructions, thank-you note, terms…" /></Field>
        </Panel>
      </div>

      <aside className="grid content-start gap-3 lg:sticky lg:top-24 lg:self-start">
        <Panel className="grid gap-3">
          <h3 className="font-display font-bold">Summary</h3>
          {!expense && <><Row k="Subtotal" v={money(t.sub, cur)} />{t.disc > 0 && <Row k={`Discount (${d.discount}%)`} v={`− ${money(t.disc, cur)}`} />}{t.tax > 0 && <Row k="Tax" v={money(t.tax, cur)} />}</>}
          <Stat label={expense ? "Total expenses" : "Total"} value={money(t.total, cur)} />
          {receipt && <Stat label="Balance due" value={money(Math.max(0, balance), cur)} sub={balance <= 0.005 ? "Paid in full" : undefined} />}
          {expense && catTotals.length > 0 && <ul className="grid gap-1 text-sm">{catTotals.map(([c, v]) => <li key={c} className="flex justify-between"><span className="text-muted">{c}</span><b>{money(v, cur)}</b></li>)}</ul>}
          <button className="btn btn-primary" onClick={pdf}><Icon name="download" className="h-4 w-4" />Download PDF</button>
          {user ? <button className="btn btn-secondary" disabled={busy} onClick={save}><Icon name="globe" className="h-4 w-4" />{busy ? "Saving…" : d.id ? "Update in cloud" : "Save to cloud"}</button> : <p className="rounded-xl bg-brand-soft p-3 text-xs text-brand-ink"><Link href="/login?next=/business" className="font-bold underline">Log in</Link> or <Link href="/signup?next=/business" className="font-bold underline">sign up free</Link> to save documents and clients to the cloud. PDFs work without an account.</p>}
          {msg && <Notice kind={msg.kind}>{msg.text}</Notice>}
          <div className="flex gap-2"><button className="btn btn-ghost btn-sm" onClick={() => setD(sample(type))}>Load sample</button><button className="btn btn-ghost btn-sm" onClick={() => { const b = blank(type); setD({ ...b, date: iso(), currency: d.currency, fromName: d.fromName, fromAddress: d.fromAddress, fromTaxId: d.fromTaxId, number: bump(d.number) }); }}>New (keep my details)</button></div>
        </Panel>
        {user && saved.length > 0 && (
          <Panel><h3 className="mb-2 font-display font-bold">Saved in your account</h3>
            <ul className="grid max-h-72 gap-1.5 overflow-y-auto text-sm">{saved.map((s) => <li key={s.id} className="flex items-center gap-2 rounded-lg border border-line p-2"><button className="min-w-0 flex-1 text-left" onClick={() => setD({ ...s.data, id: s.id })}><b className="block truncate">{s.number}</b><span className="block truncate text-xs text-muted">{s.clientName || "—"} · {money(Number(s.total), s.currency)}</span></button><button className="btn btn-ghost btn-sm text-bad" aria-label="Delete saved document" onClick={async () => { await api(`/api/business/docs?id=${s.id}`, "DELETE"); refresh(); }}><Icon name="trash" className="h-4 w-4" /></button></li>)}</ul>
          </Panel>
        )}
      </aside>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between text-sm"><span className="text-muted">{k}</span><b>{v}</b></div>;
}
function bump(n: string) {
  return n.replace(/(\d+)(?!.*\d)/, (m) => String(Number(m) + 1).padStart(m.length, "0"));
}
