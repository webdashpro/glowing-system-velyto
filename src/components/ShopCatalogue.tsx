"use client";
import { useEffect, useMemo, useState } from "react";
import { money } from "@/data/currencies";
import { waLink, type ShopData } from "@/lib/shop";
import { Icon } from "./Icon";

export function trackShop(slug: string | undefined, kind: "view" | "wa") {
  if (!slug) return;
  try {
    const body = new Blob([JSON.stringify({ slug, kind })], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/shops/track", body)) fetch("/api/shops/track", { method: "POST", body: JSON.stringify({ slug, kind }), headers: { "Content-Type": "application/json" }, keepalive: true }).catch(() => {});
  } catch {
    /* ignore */
  }
}

export default function ShopCatalogue({ shop, track = false }: { shop: ShopData; track?: boolean }) {
  const [qty, setQty] = useState<Record<string, number>>({});
  useEffect(() => {
    if (!track || !shop.slug) return;
    const k = `velyto-view-${shop.slug}`;
    try {
      if (sessionStorage.getItem(k)) return;
      sessionStorage.setItem(k, "1");
    } catch {
      /* ignore */
    }
    trackShop(shop.slug, "view");
  }, [track, shop.slug]);

  const cart = useMemo(() => shop.products.filter((p) => (qty[p.id] ?? 0) > 0).map((p) => ({ p, n: qty[p.id] })), [qty, shop.products]);
  const total = cart.reduce((s, c) => s + c.p.price * c.n, 0);
  const count = cart.reduce((s, c) => s + c.n, 0);
  const cur = shop.currency;
  const msg = (lines: { p: ShopData["products"][number]; n: number }[]) =>
    `Hi ${shop.name}! I'd like to order:\n${lines.map((l) => `• ${l.n} × ${l.p.name} — ${money(l.p.price * l.n, cur)}`).join("\n")}\nTotal: ${money(lines.reduce((s, l) => s + l.p.price * l.n, 0), cur)}\n(Sent from your Velyto catalogue)`;
  const hasWa = shop.whatsapp.replace(/\D/g, "").length >= 7;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-bg">
      <div className="bg-gradient-to-br from-blue-600 to-blue-900 p-5 text-white">
        <h2 className="font-display text-2xl font-extrabold !text-white">{shop.name || "Your shop name"}</h2>
        <p className="mt-1 text-sm text-blue-100">{shop.tagline || "Your tagline appears here"}</p>
        <p className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
          {shop.city && <span className="rounded-full bg-white/15 px-2.5 py-1">📍 {shop.city}</span>}
          <span className="rounded-full bg-white/15 px-2.5 py-1">{shop.category}</span>
          <span className="rounded-full bg-white/15 px-2.5 py-1">{cur}</span>
        </p>
      </div>
      <ul className="grid gap-3 p-3 pb-4">
        {shop.products.length === 0 && <li className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">Add products to see them here.</li>}
        {shop.products.map((p) => {
          const n = qty[p.id] ?? 0;
          return (
            <li key={p.id} className="flex gap-3 rounded-xl border border-line bg-surface p-3">
              <span className="grid h-16 w-16 flex-none place-items-center rounded-xl bg-brand-soft text-3xl" aria-hidden="true">{p.emoji}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-[0.98rem] font-bold leading-snug">{p.name || "Product name"}</h3>
                {p.description && <p className="mt-0.5 text-xs text-muted">{p.description}</p>}
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-brand-link">{money(p.price, cur)}</strong>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center rounded-lg border border-line" role="group" aria-label={`Quantity of ${p.name}`}>
                      <button type="button" className="px-2 py-1 text-lg leading-none" aria-label="Decrease" onClick={() => setQty((q) => ({ ...q, [p.id]: Math.max(0, n - 1) }))}>−</button>
                      <span className="min-w-[1.5rem] text-center text-sm font-bold" aria-live="polite">{n}</span>
                      <button type="button" className="px-2 py-1 text-lg leading-none" aria-label="Increase" onClick={() => setQty((q) => ({ ...q, [p.id]: n + 1 }))}>+</button>
                    </div>
                    {hasWa && (
                      <a href={waLink(shop.whatsapp, msg([{ p, n: Math.max(1, n) }]))} target="_blank" rel="noopener noreferrer" onClick={() => track && trackShop(shop.slug, "wa")} className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-green-700">
                        <Icon name="chat" className="h-3.5 w-3.5" />Order
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {count > 0 && hasWa && (
        <div className="sticky bottom-0 border-t border-line bg-surface/95 p-3 backdrop-blur">
          <a href={waLink(shop.whatsapp, msg(cart))} target="_blank" rel="noopener noreferrer" onClick={() => track && trackShop(shop.slug, "wa")} className="btn w-full bg-green-600 text-white hover:bg-green-700">
            <Icon name="chat" className="h-4 w-4" />Order on WhatsApp · {count} item{count > 1 ? "s" : ""} · {money(total, cur)}
          </a>
        </div>
      )}
    </div>
  );
}
