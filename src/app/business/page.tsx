import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import { BUSINESS_DOCS, COMPLIANCE_CHECKLIST } from "@/data/business";
import { Icon } from "@/components/Icon";
import { FaqList, PrivacyStrip, SectionTitle, breadcrumbLd, faqLd } from "@/components/Common";
import JsonLd from "@/components/JsonLd";

export const metadata = buildMeta({
  title: "Velyto Business — Free Invoice, Bill, Quotation & Receipt Generator (PDF)",
  description: "Create invoices, bills, quotations, payment receipts and expense reports in USD, EUR, GBP, INR, AED or CAD. Instant PDF, cloud save when signed in. Free.",
  path: "/business",
  absoluteTitle: true,
});

const FAQS: [string, string][] = [
  ["Is Velyto Business free?", "Yes. Every generator is free with no watermark, and PDFs download instantly in your browser."],
  ["Do I need to sign in?", "No. Sign in only if you want to save invoices, receipts and clients to the cloud and reopen them on any device."],
  ["Which currencies are supported?", "US dollar, euro, British pound, Indian rupee, UAE dirham and Canadian dollar."],
  ["Can I add GST or VAT?", "Yes. Set a tax percentage per line item. The PDF shows the tax total separately, and the checklist below explains what to include."],
];

function SampleInvoice() {
  return (
    <div className="mx-auto w-full max-w-md rotate-1 rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-pop" role="img" aria-label="Sample invoice preview">
      <div className="h-1.5 -mx-6 -mt-6 mb-5 rounded-t-2xl bg-blue-600" />
      <div className="flex items-start justify-between"><div><p className="font-display text-2xl font-extrabold text-blue-600">INVOICE</p><p className="text-xs text-slate-500">Date 12 May 2026 · Due 26 May 2026</p></div><p className="text-sm font-bold"># INV-2026-014</p></div>
      <div className="mt-5 grid grid-cols-2 gap-4 text-xs"><div><p className="font-bold text-slate-500">FROM</p><p className="font-semibold">Northwind Design Studio</p><p className="text-slate-500">12 Harbour St, Lisbon</p></div><div><p className="font-bold text-slate-500">BILL TO</p><p className="font-semibold">Orbit Labs GmbH</p><p className="text-slate-500">Torstrasse 45, Berlin</p></div></div>
      <table className="mt-5 w-full text-xs"><thead><tr className="bg-blue-600 text-white"><th className="p-2 text-left">Description</th><th className="p-2 text-right">Qty</th><th className="p-2 text-right">Amount</th></tr></thead><tbody>
        {[["Brand identity design", "1", "€1,800.00"], ["Landing page design", "1", "€900.00"], ["Revision rounds", "3", "€360.00"]].map(([a, b, c]) => <tr key={a} className="border-b border-slate-100"><td className="p-2">{a}</td><td className="p-2 text-right">{b}</td><td className="p-2 text-right">{c}</td></tr>)}</tbody></table>
      <div className="mt-4 ml-auto w-48 text-xs"><p className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>€3,060.00</span></p><p className="flex justify-between"><span className="text-slate-500">Discount 5%</span><span>− €153.00</span></p><p className="flex justify-between"><span className="text-slate-500">VAT 19%</span><span>€552.33</span></p><p className="mt-1 flex justify-between border-t border-blue-600 pt-1.5 font-display text-base font-extrabold text-blue-600"><span>Total</span><span>€3,459.33</span></p></div>
      <p className="mt-4 text-[10px] text-slate-400">Generated with Velyto Business</p>
    </div>
  );
}

export default function BusinessPage() {
  return (
    <>
      <section className="hero-bg border-b border-line">
        <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <span className="eyebrow"><Icon name="briefcase" className="h-4 w-4" />Velyto Business</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">Professional invoices in <span className="text-gradient">any currency.</span> Free PDFs in seconds.</h1>
            <p className="mt-4 max-w-xl text-lg text-muted">Invoices, bills, quotations, payment receipts and expense reports — with $, €, £, ₹, AED and CA$ support, instant PDF download and optional cloud save for clients and documents.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link href="/business/invoice-generator" className="btn btn-primary">Create an invoice<Icon name="arrow" className="h-4 w-4" /></Link><Link href="/business/receipt-generator" className="btn btn-secondary">Payment receipt</Link></div>
            <div className="mt-6"><PrivacyStrip /></div>
          </div>
          <SampleInvoice />
        </div>
      </section>

      <div className="container-x py-14">
        <SectionTitle eyebrow="Five generators" title="Everything a small business needs to get paid" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BUSINESS_DOCS.map((d) => (
            <Link key={d.slug} href={`/business/${d.slug}`} className="card card-hover flex gap-3 p-5"><span className="icon-tile"><Icon name={d.icon} /></span><span><span className="block font-display text-lg font-extrabold">{d.name}</span><span className="mt-1 block text-sm text-muted">{d.short}</span></span></Link>
          ))}
          <div className="card flex gap-3 p-5"><span className="icon-tile"><Icon name="globe" /></span><span><span className="block font-display text-lg font-extrabold">Cloud save (optional)</span><span className="mt-1 block text-sm text-muted">Sign in to store documents and clients in PostgreSQL and reopen them anywhere.</span></span></div>
        </div>

        <section className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.1fr]" aria-labelledby="checklist-h">
          <div><SectionTitle eyebrow="Stay compliant" title="GST & Invoice Compliance Checklist" sub="Every invoice should carry these details. Rules vary by country — confirm with a qualified accountant." /><p className="text-sm text-muted">Learn the formulas in our <Link href="/guides/gst-invoice-calculations-freelancers" className="font-semibold text-brand-link underline">GST &amp; invoice calculation guide</Link> and use the <Link href="/tools/gst-calculator" className="font-semibold text-brand-link underline">GST Calculator</Link>.</p></div>
          <ol id="checklist-h" className="grid gap-2.5">{COMPLIANCE_CHECKLIST.map(([t, d], i) => <li key={t} className="card flex gap-3 p-4"><span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-brand-soft text-sm font-bold text-brand-ink">{i + 1}</span><span><span className="block font-semibold">{t}</span><span className="text-sm text-muted">{d}</span></span></li>)}</ol>
        </section>

        <section className="mt-16" aria-labelledby="faq-h"><h2 id="faq-h" className="mb-4 text-2xl font-extrabold">Business FAQs</h2><div className="max-w-3xl"><FaqList faqs={FAQS} /></div></section>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [{ "@type": "WebApplication", name: "Velyto Business", url: abs("/business"), applicationCategory: "BusinessApplication", operatingSystem: "Any (web browser)", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }, faqLd(FAQS), breadcrumbLd([{ name: "Home", href: "/" }, { name: "Business", href: "/business" }])] }} />
    </>
  );
}
