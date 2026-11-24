import { money } from "@/data/currencies";
import { waLink, type ShopData } from "./shop";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Standalone, dependency-free catalogue page the shop owner can host anywhere. */
export function catalogueHtml(shop: ShopData): string {
  const items = shop.products
    .map((p) => {
      const msg = `Hi ${shop.name}! I'd like to order: 1 × ${p.name} — ${money(p.price, shop.currency)}`;
      return `<article class="p"><div class="e">${esc(p.emoji)}</div><div class="b"><h2>${esc(p.name)}</h2><p>${esc(p.description)}</p><div class="r"><strong>${esc(money(p.price, shop.currency))}</strong><a href="${esc(waLink(shop.whatsapp, msg))}">Order on WhatsApp</a></div></div></article>`;
    })
    .join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(shop.name)} — Catalogue</title><style>
*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#f5f8ff;color:#0a1630}
header{background:linear-gradient(135deg,#2563eb,#1e3a8a);color:#fff;padding:28px 18px}header h1{margin:0;font-size:1.6rem}header p{margin:6px 0 0;opacity:.9}
main{max-width:640px;margin:0 auto;padding:16px;display:grid;gap:12px}.p{display:flex;gap:14px;background:#fff;border:1px solid #e1e8f5;border-radius:16px;padding:14px}
.e{font-size:2.2rem;width:64px;height:64px;display:grid;place-items:center;background:#eaf1ff;border-radius:14px;flex:none}.b{flex:1;min-width:0}.b h2{margin:0;font-size:1.05rem}.b p{margin:4px 0 8px;color:#475673;font-size:.9rem}
.r{display:flex;align-items:center;justify-content:space-between;gap:8px}.r a{background:#16a34a;color:#fff;text-decoration:none;padding:9px 14px;border-radius:10px;font-weight:700;font-size:.85rem}
footer{text-align:center;color:#475673;font-size:.8rem;padding:20px}</style></head><body><header><h1>${esc(shop.name)}</h1><p>${esc(shop.tagline)}${shop.city ? ` · ${esc(shop.city)}` : ""}</p></header><main>${items}</main><footer>Catalogue made with Velyto Shop — velyto.netlify.app/shop</footer></body></html>`;
}

export function posterHtml(shop: ShopData, qrDataUrl: string, url: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(shop.name)} — QR Poster</title><style>
@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#0a1630}
.s{width:210mm;height:297mm;padding:22mm 18mm;display:flex;flex-direction:column;align-items:center;text-align:center;background:linear-gradient(180deg,#eaf1ff,#fff 45%)}
.badge{background:#2563eb;color:#fff;font-weight:800;letter-spacing:.08em;padding:8px 18px;border-radius:999px;font-size:14px}
h1{font-size:46px;margin:22px 0 6px;line-height:1.05}p.t{font-size:20px;color:#475673;margin:0 0 20px}
.q{background:#fff;border:3px solid #2563eb;border-radius:28px;padding:22px;margin:10px 0}.q img{width:340px;height:340px;display:block}
h2{font-size:30px;margin:22px 0 4px}.u{font-size:16px;color:#475673;word-break:break-all}.f{margin-top:auto;font-size:13px;color:#475673}
</style></head><body><div class="s"><span class="badge">SCAN TO ORDER</span><h1>${esc(shop.name)}</h1><p class="t">${esc(shop.tagline)}${shop.city ? ` · ${esc(shop.city)}` : ""}</p><div class="q"><img src="${qrDataUrl}" alt="QR code"></div><h2>Browse &amp; order on WhatsApp</h2><div class="u">${esc(url)}</div><div class="f">Made with Velyto Shop · velyto.netlify.app/shop</div></div><script>window.onload=function(){setTimeout(function(){window.print()},300)}</script></body></html>`;
}
