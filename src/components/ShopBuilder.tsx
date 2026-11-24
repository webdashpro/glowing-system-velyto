"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, downloadBlob, useLocalState, useUser } from "@/lib/client";
import { CURRENCIES } from "@/data/currencies";
import { DEMO_SHOP, SHOP_CATEGORIES, slugify, type ShopData } from "@/lib/shop";
import { catalogueHtml, posterHtml } from "@/lib/shop-html";
import { Field, Notice } from "./tools/ui";
import { Icon } from "./Icon";
import ShopCatalogue from "./ShopCatalogue";

const EMOJIS = ["🛍️", "🎂", "🍞", "🥐", "🍫", "👗", "👟", "💍", "🧴", "🕯️", "📚", "🎧", "📱", "🪴", "🧸", "☕", "🍯", "🎨", "🧵", "🥭"];
const EMPTY: ShopData = { name: "", tagline: "", city: "", category: "General", currency: "USD", whatsapp: "", products: [{ id: "p1", name: "", price: 0, description: "", emoji: "🛍️" }] };

export default function ShopBuilder() {
  const [shop, setShop, ready] = useLocalState<ShopData>("velyto.shop.draft", EMPTY);
  const user = useUser();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [mine, setMine] = useState<(ShopData & { id: string; slug: string; views: number; waClicks: number })[]>([]);
  const [origin, setOrigin] = useState("");

  useEffect(() => setOrigin(window.location.origin), []);
  useEffect(() => {
    if (!user) return;
    api<{ shops: typeof mine }>("/api/shops").then((r) => {
      if (!r.ok) return;
      setMine(r.data.shops);
      const edit = new URLSearchParams(window.location.search).get("edit");
      const s = r.data.shops.find((x) => x.id === edit);
      if (s) setShop({ id: s.id, slug: s.slug, name: s.name, tagline: s.tagline, city: s.city, category: s.category, currency: s.currency, whatsapp: s.whatsapp, products: s.products, published: s.published });
    });
  }, [user, setShop]);

  const set = <K extends keyof ShopData>(k: K, v: ShopData[K]) => setShop((s) => ({ ...s, [k]: v }));
  const setProduct = (i: number, patch: Partial<ShopData["products"][number]>) => setShop((s) => ({ ...s, products: s.products.map((p, j) => (j === i ? { ...p, ...patch } : p)) }));
  const url = shop.slug && origin ? `${origin}/s/${shop.slug}` : "";

  async function publish() {
    setBusy(true);
    setMsg(null);
    const r = await api<{ shop?: ShopData & { id: string; slug: string }; error?: string }>("/api/shops", "POST", { ...shop, published: shop.published !== false });
    if (r.ok && r.data.shop) {
      const s = r.data.shop;
      setShop((p) => ({ ...p, id: s.id, slug: s.slug }));
      setMsg({ kind: "ok", text: "Your shop is live! Share the link below." });
      api<{ shops: typeof mine }>("/api/shops").then((x) => x.ok && setMine(x.data.shops));
    } else setMsg({ kind: "error", text: r.data.error ?? "Could not publish." });
    setBusy(false);
  }

  async function poster() {
    const QR = (await import("qrcode")).default;
    const target = url || `https://wa.me/${shop.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${shop.name}! Please share your catalogue.`)}`;
    const qr = await QR.toDataURL(target, { width: 680, margin: 1, errorCorrectionLevel: "Q", color: { dark: "#0a1630", light: "#ffffff" } });
    const w = window.open("", "_blank");
    if (!w) return setMsg({ kind: "error", text: "Allow pop-ups to open the printable poster." });
    w.document.open();
    w.document.write(posterHtml(shop, qr, url || "Scan to chat on WhatsApp"));
    w.document.close();
  }

  const valid = shop.name.trim().length >= 2 && shop.whatsapp.replace(/\D/g, "").length >= 7 && shop.products.some((p) => p.name.trim());
  const previewShop: ShopData = { ...shop, products: shop.products.filter((p) => p.name.trim()).map((p) => ({ ...p })) };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="grid content-start gap-5">
        <div className="card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold">1 · Shop details</h2>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-secondary btn-sm" onClick={() => setShop({ ...DEMO_SHOP })}><Icon name="zap" className="h-4 w-4" />Load Demo Shop</button>
              <button className="btn btn-ghost btn-sm" onClick={() => { if (confirm("Clear this draft?")) setShop(EMPTY); }}>New shop</button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Shop name"><input className="input" value={shop.name} onChange={(e) => set("name", e.target.value)} maxLength={60} placeholder="Maya's Bakery" /></Field>
            <Field label="WhatsApp number (with country code)" hint="Digits only, e.g. 919876543210"><input className="input" inputMode="tel" value={shop.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} maxLength={20} placeholder="919876543210" /></Field>
            <Field label="Tagline" className="sm:col-span-2"><input className="input" value={shop.tagline} onChange={(e) => set("tagline", e.target.value)} maxLength={120} placeholder="Fresh-baked cakes & breads, made daily" /></Field>
            <Field label="City"><input className="input" value={shop.city} onChange={(e) => set("city", e.target.value)} maxLength={60} placeholder="Mumbai" /></Field>
            <Field label="Category"><select className="input" value={shop.category} onChange={(e) => set("category", e.target.value)}>{SHOP_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Currency"><select className="input" value={shop.currency} onChange={(e) => set("currency", e.target.value)}>{CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.label}</option>)}</select></Field>
          </div>
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-extrabold">2 · Products</h2><button className="btn btn-secondary btn-sm" onClick={() => setShop((s) => ({ ...s, products: [...s.products, { id: `p${Date.now().toString(36)}`, name: "", price: 0, description: "", emoji: "🛍️" }] }))}><Icon name="plus" className="h-4 w-4" />Add product</button></div>
          <ul className="grid gap-3">
            {shop.products.map((p, i) => (
              <li key={p.id} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-[4.5rem_1fr_8rem_auto]">
                <select className="input !px-2 text-xl" aria-label="Emoji" value={p.emoji} onChange={(e) => setProduct(i, { emoji: e.target.value })}>{EMOJIS.map((e) => <option key={e}>{e}</option>)}</select>
                <input className="input" aria-label="Product name" placeholder="Product name" value={p.name} onChange={(e) => setProduct(i, { name: e.target.value })} maxLength={80} />
                <input className="input" aria-label="Price" type="number" min={0} step="any" placeholder="Price" value={p.price || ""} onChange={(e) => setProduct(i, { price: Number(e.target.value) })} />
                <button className="btn btn-ghost btn-sm text-bad" aria-label="Remove product" onClick={() => setShop((s) => ({ ...s, products: s.products.filter((_, j) => j !== i) }))}><Icon name="trash" className="h-4 w-4" /></button>
                <input className="input sm:col-span-4" aria-label="Description" placeholder="Short description (optional)" value={p.description} onChange={(e) => setProduct(i, { description: e.target.value })} maxLength={240} />
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <h2 className="mb-1 text-xl font-extrabold">3 · Publish &amp; share</h2>
          <p className="mb-4 text-sm text-muted">Guests can download the HTML catalogue and print a QR poster right now. Sign in (free) to publish a live link with view and WhatsApp-click counters.</p>
          <div className="flex flex-wrap gap-2">
            {user ? <button className="btn btn-primary" disabled={!valid || busy} onClick={publish}><Icon name="globe" className="h-4 w-4" />{busy ? "Publishing…" : shop.slug ? "Update live shop" : "Publish live shop"}</button> : <Link className="btn btn-primary" href="/login?next=/shop">Log in to publish</Link>}
            <button className="btn btn-secondary" disabled={!valid} onClick={() => downloadBlob(new Blob([catalogueHtml(shop)], { type: "text/html" }), `${slugify(shop.name)}-catalogue.html`)}><Icon name="download" className="h-4 w-4" />Download HTML catalogue</button>
            <button className="btn btn-secondary" disabled={!valid} onClick={poster}><Icon name="print" className="h-4 w-4" />Shop QR poster</button>
          </div>
          {!valid && ready && <p className="mt-3 text-sm text-muted">Add a shop name, a WhatsApp number and at least one named product to enable these actions.</p>}
          {msg && <div className="mt-3"><Notice kind={msg.kind}>{msg.text}</Notice></div>}
          {url && (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-soft p-3 text-sm">
              <Icon name="link" className="h-4 w-4 text-brand-link" /><a className="min-w-0 flex-1 truncate font-semibold text-brand-link underline" href={url} target="_blank" rel="noopener noreferrer">{url}</a>
              <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(url)}>Copy link</button>
            </div>
          )}
        </div>

        {user && mine.length > 0 && (
          <div className="card p-5">
            <h2 className="mb-3 text-xl font-extrabold">Your published shops</h2>
            <ul className="grid gap-2">
              {mine.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line p-3 text-sm">
                  <span className="min-w-0 flex-1"><b>{s.name}</b> <span className="text-muted">/s/{s.slug} · {s.views} views · {s.waClicks} WhatsApp clicks</span></span>
                  <button className="btn btn-secondary btn-sm" onClick={() => setShop({ id: s.id, slug: s.slug, name: s.name, tagline: s.tagline, city: s.city, category: s.category, currency: s.currency, whatsapp: s.whatsapp, products: s.products, published: s.published })}>Edit</button>
                  <Link className="btn btn-ghost btn-sm" href={`/s/${s.slug}`}>View</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Live preview">
        <p className="mb-2 text-sm font-bold text-muted">Live mobile preview</p>
        <div className="mx-auto max-w-[22rem] rounded-[2rem] border-[10px] border-slate-900 bg-slate-900 shadow-pop">
          <div className="max-h-[38rem] overflow-y-auto rounded-[1.4rem]"><ShopCatalogue shop={previewShop} /></div>
        </div>
      </aside>
    </div>
  );
}
