import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import { Icon } from "@/components/Icon";
import { PillarMock } from "@/components/Mockups";
import { Breadcrumbs, FaqList, PageHeader, SectionTitle, breadcrumbLd, faqLd } from "@/components/Common";
import ShopBuilder from "@/components/ShopBuilder";
import JsonLd from "@/components/JsonLd";

export const metadata = buildMeta({
  title: "Velyto Shop — Free WhatsApp Catalogue, QR Poster & Order Links",
  description: "Build a mobile product catalogue in USD, EUR, GBP, INR, AED or CAD. One-tap pre-filled WhatsApp orders, printable QR poster, public shop link. Free.",
  path: "/shop",
  absoluteTitle: true,
});

const FAQS: [string, string][] = [
  ["Is Velyto Shop free?", "Yes. Building a catalogue, downloading the HTML file and printing the QR poster are free for everyone. Publishing a live link only needs a free account."],
  ["Do customers need an app?", "No. Customers open your link in any browser, add items and tap Order on WhatsApp. The chat opens with the order already written."],
  ["Which currencies are supported?", "US dollar, euro, British pound, Indian rupee, UAE dirham and Canadian dollar."],
  ["Can I list my shop publicly?", "Published shops appear in the Shop Directory where visitors can filter by city and category."],
  ["Was this called Dukaan before?", "Yes — Velyto Dukaan is now Velyto Shop. The old /dukaan address redirects here permanently."],
];

function ChatMock() {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-line shadow-pop" role="img" aria-label="Mock WhatsApp order chat">
      <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white"><span className="grid h-9 w-9 place-items-center rounded-full bg-white/20 font-bold">M</span><div><p className="text-sm font-bold">Maya&apos;s Bakery</p><p className="text-[11px] text-emerald-100">online</p></div></div>
      <div className="space-y-2 bg-[#e5ddd5] p-3 text-[13px] text-slate-900">
        <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-[#dcf8c6] p-2.5 shadow-sm"><p className="whitespace-pre-line">{"Hi Maya's Bakery! I'd like to order:\n• 1 × Berry cake (1 kg) — ₹1,450\n• 2 × Sourdough loaf — ₹640\nTotal: ₹2,090\n(Sent from your Velyto catalogue)"}</p><p className="mt-1 text-right text-[10px] text-slate-500">10:42 ✓✓</p></div>
        <div className="max-w-[80%] rounded-xl rounded-tl-sm bg-white p-2.5 shadow-sm"><p>Thank you! Your order is confirmed. Ready for pickup by 5 pm 🎂</p><p className="mt-1 text-right text-[10px] text-slate-500">10:43</p></div>
        <div className="ml-auto max-w-[70%] rounded-xl rounded-tr-sm bg-[#dcf8c6] p-2.5 shadow-sm"><p>Perfect, see you at 5!</p><p className="mt-1 text-right text-[10px] text-slate-500">10:43 ✓✓</p></div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const crumbs = [{ name: "Home", href: "/" }, { name: "Shop", href: "/shop" }];
  return (
    <>
      <PageHeader eyebrow="Velyto Shop" icon="store" title="Your WhatsApp shop catalogue, live in minutes." sub="Add products, share one link, and let customers order with a single tap — pre-filled on WhatsApp. No website, no app, no fees.">
        <div className="mt-6 flex flex-wrap gap-3"><a href="#builder" className="btn btn-primary">Build your catalogue<Icon name="arrow" className="h-4 w-4" /></a><Link href="/shops" className="btn btn-secondary">Browse the Shop Directory</Link></div>
      </PageHeader>

      <div className="container-x py-12">
        <Breadcrumbs items={crumbs} />
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="grid gap-4"><PillarMock kind="shop" /><p className="text-center text-sm text-muted">Visual mobile catalogue + order chat</p></div>
          <ChatMock />
        </div>

        <section className="mt-16" aria-labelledby="how">
          <SectionTitle eyebrow="How it works" title="From product list to first order in 3 steps" />
          <ol id="how" className="grid gap-4 md:grid-cols-3">
            {[["Add your products", "Name, price, emoji and a short description. Pick one of six currencies. Press “Load Demo Shop” to see an example."], ["Publish & share", "Create a free account to get a live /s/your-shop link. Share it on WhatsApp, Instagram or print the QR poster."], ["Get pre-filled orders", "Customers tap Order on WhatsApp and you receive a ready-written message. Track views and WhatsApp clicks from your dashboard."]].map(([t, d], i) => (
              <li key={t} className="card p-5"><span className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-bold text-white">{i + 1}</span><h3 className="mt-3 text-lg font-extrabold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></li>
            ))}
          </ol>
        </section>

        <section id="builder" className="mt-16 scroll-mt-24" aria-labelledby="builder-h">
          <SectionTitle eyebrow="Catalogue builder" title="Build and preview your shop" sub="Your draft is saved in this browser automatically. Guests can download and print; signed-in users can publish." />
          <ShopBuilder />
        </section>

        <section className="mt-16" aria-labelledby="faq-h">
          <h2 id="faq-h" className="mb-4 text-2xl font-extrabold">Shop FAQs</h2>
          <div className="max-w-3xl"><FaqList faqs={FAQS} /></div>
        </section>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [{ "@type": "WebApplication", name: "Velyto Shop", url: abs("/shop"), applicationCategory: "BusinessApplication", operatingSystem: "Any (web browser)", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }, faqLd(FAQS), breadcrumbLd(crumbs)] }} />
    </>
  );
}
