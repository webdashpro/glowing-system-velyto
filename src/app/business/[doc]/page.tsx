import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BUSINESS_DOCS, docBySlug } from "@/data/business";
import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import { Breadcrumbs, FaqList, PageHeader, breadcrumbLd, faqLd } from "@/components/Common";
import DocGenerator from "@/components/DocGenerator";
import JsonLd from "@/components/JsonLd";

export const dynamicParams = false;
export function generateStaticParams() {
  return BUSINESS_DOCS.map((d) => ({ doc: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ doc: string }> }): Promise<Metadata> {
  const { doc } = await params;
  const d = docBySlug(doc);
  if (!d) return {};
  return buildMeta({ title: `Free ${d.name} — Multi-Currency PDF Download`, description: `${d.short} Supports USD, EUR, GBP, INR, AED and CAD. Free PDF, optional cloud save.`, path: `/business/${doc}`, ogSub: "Velyto Business · Free PDF" });
}

export default async function DocPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc } = await params;
  const d = docBySlug(doc);
  if (!d) notFound();
  const crumbs = [{ name: "Home", href: "/" }, { name: "Business", href: "/business" }, { name: d.name, href: `/business/${doc}` }];
  return (
    <>
      <PageHeader eyebrow="Velyto Business" icon={d.icon} title={`Free ${d.name}`} sub={d.intro} />
      <div className="container-x py-10">
        <Breadcrumbs items={crumbs} />
        <DocGenerator type={d.type} />
        <section className="mt-14 max-w-3xl"><h2 className="mb-4 text-2xl font-extrabold">{d.name} FAQs</h2><FaqList faqs={d.faqs} /></section>
        <section className="mt-10"><h2 className="mb-3 text-xl font-extrabold">More Velyto Business tools</h2><ul className="flex flex-wrap gap-2">{BUSINESS_DOCS.filter((x) => x.slug !== doc).map((x) => <li key={x.slug}><Link className="chip" href={`/business/${x.slug}`}>{x.name}</Link></li>)}<li><Link className="chip" href="/tools/gst-calculator">GST Calculator</Link></li></ul></section>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [{ "@type": "WebApplication", name: d.name, url: abs(`/business/${doc}`), applicationCategory: "BusinessApplication", operatingSystem: "Any (web browser)", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }, faqLd(d.faqs), breadcrumbLd(crumbs)] }} />
    </>
  );
}
