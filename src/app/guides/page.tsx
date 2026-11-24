import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import { GUIDES } from "@/data/guides";
import { PageHeader, breadcrumbLd } from "@/components/Common";
import JsonLd from "@/components/JsonLd";
import { Icon } from "@/components/Icon";

export const metadata = buildMeta({
  title: "Guides — Exam Photos, Image Compression, WhatsApp Shops, GST & Study",
  description: "Practical, step-by-step guides on exam photo sizes, compressing images under 50KB, WhatsApp shop catalogues, GST invoices and study techniques.",
  path: "/guides",
  absoluteTitle: true,
});

export default function GuidesPage() {
  return (
    <>
      <PageHeader eyebrow="Guides" icon="book" title="Practical guides that save you time" sub="Plain-language how-tos with exact numbers, worked examples and links straight to the right free tool." />
      <div className="container-x grid gap-5 py-12 md:grid-cols-2">
        {GUIDES.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="card card-hover flex flex-col p-6">
            <p className="text-xs font-bold text-brand-link">{g.readMins} min read · Updated {g.updatedLabel}</p>
            <h2 className="mt-2 text-xl font-extrabold leading-snug">{g.title}</h2>
            <p className="mt-2 flex-1 text-muted">{g.description}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-link">Read guide <Icon name="arrow" className="h-4 w-4" /></span>
          </Link>
        ))}
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [breadcrumbLd([{ name: "Home", href: "/" }, { name: "Guides", href: "/guides" }]), { "@type": "CollectionPage", name: "Velyto Guides", url: abs("/guides") }] }} />
    </>
  );
}
