import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import { Icon, type IconName } from "@/components/Icon";
import { FaqList, PageHeader, breadcrumbLd, faqLd } from "@/components/Common";
import WaitlistForm from "@/components/WaitlistForm";
import JsonLd from "@/components/JsonLd";

export const metadata = buildMeta({
  title: "Pricing — Everything on Velyto is 100% Free Right Now",
  description: "All five Velyto products — Tools, Media, Shop, Study and Business — are 100% free today. Join the Pro waitlist for future custom domains and team features.",
  path: "/pricing",
  absoluteTitle: true,
});

const PRODUCTS: [IconName, string, string, string][] = [
  ["layers", "Velyto Tools", "/tools", "34 browser-first tools. No limits, no watermark."],
  ["film", "Velyto Media", "/media", "Video, image and audio tools on Canvas & MediaRecorder."],
  ["store", "Velyto Shop", "/shop", "Catalogue, live link, WhatsApp orders, QR poster, directory."],
  ["book", "Velyto Study", "/study", "Notes, flashcards, quizzes, timer, planner, resume."],
  ["briefcase", "Velyto Business", "/business", "Invoices, bills, quotes, receipts, expenses — six currencies."],
];

const FAQS: [string, string][] = [
  ["Is Velyto really free?", "Yes. Every product and every tool is free today, with no ads, no watermarks and no daily limits."],
  ["How is it free?", "Tools run on your own device, so serving them costs very little. Cloud features use a small shared database. We may add optional paid Pro features later; today's features will remain free."],
  ["What will Pro include?", "We're exploring custom domains for shop catalogues, team workspaces for Business, branded invoice templates and higher cloud limits. Nothing is charged today and the waitlist is the only commitment."],
  ["Do I need an account?", "No. All tools, Media, Study, Business PDFs and the Shop builder work as a guest. A free account adds cloud sync and publishing."],
];

export default function PricingPage() {
  return (
    <>
      <PageHeader eyebrow="Pricing" icon="free" title="100% free right now." sub="All five Velyto products are free today. No trials, no credit card, no catch.">
        <div className="mt-6 flex flex-wrap gap-3"><Link href="/tools" className="btn btn-primary">Start using Velyto</Link><a href="#waitlist" className="btn btn-secondary">Join the Pro waitlist</a></div>
      </PageHeader>
      <div className="container-x py-12">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map(([i, n, h, d]) => (
            <Link key={n} href={h} className="card card-hover flex flex-col p-5">
              <div className="flex items-center justify-between"><span className="icon-tile"><Icon name={i} /></span><span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-extrabold text-good">Free</span></div>
              <h2 className="mt-4 text-xl font-extrabold">{n}</h2><p className="mt-1 flex-1 text-sm text-muted">{d}</p>
              <p className="mt-4 font-display text-3xl font-extrabold">$0<span className="text-sm font-semibold text-muted"> / forever*</span></p>
            </Link>
          ))}
          <div className="card flex flex-col justify-center bg-gradient-to-br from-blue-600 to-blue-900 p-6 text-white"><Icon name="zap" className="h-8 w-8" /><h2 className="mt-3 text-xl font-extrabold !text-white">Velyto Pro — coming later</h2><p className="mt-1 text-sm text-blue-100">Custom domains &amp; team features. Join the waitlist to be told first.</p></div>
        </div>
        <p className="mt-3 text-xs text-muted">* Everything available today stays free. Any future Pro plan will be optional.</p>

        <section id="waitlist" className="mt-16 grid scroll-mt-24 items-start gap-8 lg:grid-cols-2" aria-labelledby="wl-h">
          <div>
            <h2 id="wl-h" className="text-3xl font-extrabold">Velyto Pro Waitlist</h2>
            <p className="mt-3 text-muted">Tell us what would make Velyto more useful for your work. We&apos;ll email you once when Pro features open.</p>
            <ul className="mt-5 grid gap-2 text-sm">{["Custom domains for shop catalogues", "Team workspaces for invoices & clients", "Branded invoice and receipt templates", "Higher cloud storage limits"].map((x) => <li key={x} className="flex gap-2"><Icon name="checkcircle" className="mt-0.5 h-4 w-4 flex-none text-brand-link" />{x}</li>)}</ul>
          </div>
          <div className="card p-6"><WaitlistForm /></div>
        </section>

        <section className="mt-16 max-w-3xl" aria-labelledby="faq-h"><h2 id="faq-h" className="mb-4 text-2xl font-extrabold">Pricing FAQs</h2><FaqList faqs={FAQS} /></section>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [faqLd(FAQS), breadcrumbLd([{ name: "Home", href: "/" }, { name: "Pricing", href: "/pricing" }]), { "@type": "WebPage", name: "Velyto Pricing", url: abs("/pricing") }] }} />
    </>
  );
}
