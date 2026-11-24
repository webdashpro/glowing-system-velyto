import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import { TOOLS } from "@/data/tools";
import { EXAMS } from "@/data/exams";
import { PageHeader, PrivacyStrip, breadcrumbLd } from "@/components/Common";
import ToolsDirectory from "@/components/ToolsDirectory";
import JsonLd from "@/components/JsonLd";

export const metadata = buildMeta({
  title: "34 Free Online Tools — Image, PDF, Calculators, Developer & Media",
  description: "Free browser-based tools: image compressor, exam photo resizer, image to PDF, GST & EMI calculators, JSON formatter, video to image and more. Zero uploads.",
  path: "/tools",
  absoluteTitle: true,
});

export default function ToolsPage() {
  return (
    <>
      <PageHeader eyebrow="Velyto Tools" icon="layers" title="34 free tools. Zero uploads." sub="Everything runs inside your browser, so your photos, PDFs and text never leave your device. Pick a category or search.">
        <div className="mt-6"><PrivacyStrip /></div>
      </PageHeader>
      <div className="container-x py-10">
        <ToolsDirectory />
        <section className="mt-6 card p-6">
          <h2 className="text-xl font-extrabold">Exam photo &amp; signature presets</h2>
          <p className="mt-1 text-muted">Exact pixel, KB and DPI specs for popular forms — each with a checklist and a pre-configured resizer.</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {EXAMS.map((e) => <li key={e.slug}><Link className="chip" href={`/tools/exam-photo-resizer/${e.slug}`}>{e.name}</Link></li>)}
          </ul>
        </section>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [
        { "@type": "CollectionPage", name: "Velyto Tools", url: abs("/tools") },
        { "@type": "ItemList", itemListElement: TOOLS.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/tools/${t.slug}`), name: t.name })) },
        breadcrumbLd([{ name: "Home", href: "/" }, { name: "Tools", href: "/tools" }]),
      ] }} />
    </>
  );
}
