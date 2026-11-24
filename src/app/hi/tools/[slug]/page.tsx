import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HI_SLUGS, HI_TOOLS } from "@/data/hi-tools";
import { toolBySlug } from "@/data/tools";
import { buildMeta } from "@/lib/seo";
import { abs, LAST_UPDATED } from "@/lib/site";
import { Breadcrumbs, FaqList, breadcrumbLd, faqLd } from "@/components/Common";
import JsonLd from "@/components/JsonLd";
import ToolRunner from "@/components/ToolRunner";
import { Icon } from "@/components/Icon";

export const dynamicParams = false;
export function generateStaticParams() {
  return HI_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const h = HI_TOOLS[slug];
  if (!h) return {};
  return buildMeta({
    title: `${h.name} — मुफ़्त ऑनलाइन टूल`,
    description: h.description,
    path: `/hi/tools/${slug}`,
    ogSub: "मुफ़्त · ब्राउज़र-फ़र्स्ट · ज़ीरो अपलोड",
    languages: { en: abs(`/tools/${slug}`), hi: abs(`/hi/tools/${slug}`), "x-default": abs(`/tools/${slug}`) },
  });
}

export default async function HiToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const h = HI_TOOLS[slug];
  const t = toolBySlug(slug);
  if (!h || !t) notFound();
  const crumbs = [{ name: "होम", href: "/hi" }, { name: h.name, href: `/hi/tools/${slug}` }];
  return (
    <div lang="hi">
      <div className="hero-bg border-b border-line">
        <div className="container-x pb-8 pt-8">
          <Breadcrumbs items={crumbs} />
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl">{h.h1}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">{h.description}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 text-sm text-muted"><span className="inline-flex items-center gap-1 font-semibold text-brand-ink"><Icon name="shield" className="h-4 w-4" />ज़ीरो अपलोड</span><Link href={`/tools/${slug}`} hrefLang="en" lang="en" className="font-semibold text-brand-link underline">Read in English</Link></p>
        </div>
      </div>
      <div className="container-x py-8"><ToolRunner slug={slug} /></div>
      <article className="container-x pb-6">
        <div className="prose-v mx-auto max-w-3xl">
          <h2>{h.name} के बारे में</h2>
          <p>{h.intro}</p>
          <h2>इस्तेमाल करने के 3 आसान चरण</h2>
          <ol id="how-to">{h.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
          <h2>उपयोगी सुझाव</h2>
          <ul>{h.tips.map((s, i) => <li key={i}>{s}</li>)}</ul>
          <h2>अक्सर पूछे जाने वाले प्रश्न</h2>
        </div>
        <div className="mx-auto max-w-3xl"><FaqList faqs={h.faqs} /></div>
      </article>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [
        { "@type": "WebApplication", name: h.name, url: abs(`/hi/tools/${slug}`), description: h.description, inLanguage: "hi", applicationCategory: "UtilitiesApplication", operatingSystem: "Any (web browser)", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, dateModified: LAST_UPDATED },
        faqLd(h.faqs), breadcrumbLd(crumbs),
        { "@type": "HowTo", name: h.h1, inLanguage: "hi", dateModified: LAST_UPDATED, step: h.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: s })) },
      ] }} />
    </div>
  );
}
