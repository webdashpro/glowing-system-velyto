import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EXAMS, examBySlug } from "@/data/exams";
import { buildMeta } from "@/lib/seo";
import { abs, AUTHOR, LAST_UPDATED, LAST_UPDATED_LABEL } from "@/lib/site";
import { Breadcrumbs, FaqList, breadcrumbLd, faqLd } from "@/components/Common";
import { Icon } from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import ToolRunner from "@/components/ToolRunner";

export const dynamicParams = false;
export function generateStaticParams() {
  return EXAMS.map((e) => ({ exam: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ exam: string }> }): Promise<Metadata> {
  const { exam } = await params;
  const e = examBySlug(exam);
  if (!e) return {};
  const p = e.targets[0];
  return buildMeta({
    title: `${e.name} Photo & Signature Size ${p.w}×${p.h}px, ${p.minKB}–${p.maxKB}KB — Free Resizer`,
    description: `Exact ${e.name} photo and signature specs (px, KB, DPI) with a checklist and a free online resizer. Browser-only — your photo is never uploaded.`,
    path: `/tools/exam-photo-resizer/${exam}`,
    ogSub: `${p.w}×${p.h}px · ${p.minKB}–${p.maxKB} KB · ${p.dpi} DPI`,
  });
}

export default async function ExamPage({ params }: { params: Promise<{ exam: string }> }) {
  const { exam } = await params;
  const e = examBySlug(exam);
  if (!e) notFound();
  const url = abs(`/tools/exam-photo-resizer/${exam}`);
  const crumbs = [{ name: "Home", href: "/" }, { name: "Tools", href: "/tools" }, { name: "Exam Photo Resizer", href: "/tools/exam-photo-resizer" }, { name: e.name, href: `/tools/exam-photo-resizer/${exam}` }];
  const steps: [string, string, string] = [
    `Open the resizer below — it is already loaded with the ${e.name} sizes (${e.targets.map((t) => `${t.label.toLowerCase()} ${t.w}×${t.h}px`).join(", ")}).`,
    "Choose your photo or signature file. Use “Cover” to crop to the exact ratio, or “Contain” to add white margins.",
    `Check the green ticks for dimensions and file size (${e.targets.map((t) => `${t.minKB}–${t.maxKB} KB`).join(" / ")}), then download the ${e.format} file.`,
  ];
  const others = EXAMS.filter((x) => x.slug !== exam);

  return (
    <>
      <div className="hero-bg border-b border-line">
        <div className="container-x pb-8 pt-8">
          <Breadcrumbs items={crumbs} />
          <h1 className="max-w-3xl text-3xl font-extrabold sm:text-4xl">{e.name} Photo &amp; Signature Size (2026) — Resize Online Free</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">Exact pixel, KB and DPI specifications for {e.full}, issued by {e.body}. Resize in your browser — nothing is uploaded.</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted"><span>Last updated: <time dateTime={LAST_UPDATED}>{LAST_UPDATED_LABEL}</time></span><span>By {AUTHOR}</span><span className="inline-flex items-center gap-1 font-semibold text-brand-ink"><Icon name="shield" className="h-4 w-4" />Zero uploads</span></p>
        </div>
      </div>

      <div className="container-x py-8"><ToolRunner slug="exam-photo-resizer" targets={e.targets} examName={e.name} /></div>

      <article className="container-x pb-6">
        <div className="prose-v mx-auto max-w-3xl">
          <h2>{e.name} upload specifications</h2>
          <div className="table-wrap"><table><thead><tr><th>Document</th><th>Size (px)</th><th>File size</th><th>DPI</th><th>Notes</th></tr></thead><tbody>{e.targets.map((t) => <tr key={t.label}><td><strong>{t.label}</strong></td><td>{t.w} × {t.h}</td><td>{t.minKB}–{t.maxKB} KB</td><td>{t.dpi}</td><td>{t.note ?? "—"}</td></tr>)}</tbody></table></div>
          <p>Format: <strong>{e.format}</strong>. Background: {e.background}. These are the commonly published values for recent notifications — boards change limits between cycles, so <strong>always confirm with the latest official notification</strong> before you submit. If your portal shows different numbers, expand “Adjust size, KB range &amp; DPI” inside the tool and type them in.</p>

          <h2>How to resize your {e.name} photo and signature in 3 steps</h2>
          <ol id="how-to">{steps.map((s, i) => <li key={i}>{s}</li>)}</ol>

          <h2>{e.name} photo checklist</h2>
          <ul>{e.checklist.map((c) => <li key={c}>{c}</li>)}</ul>
          <p><strong>Pro tip:</strong> {e.tip}</p>

          <h2>Why uploads get rejected — and how this tool prevents it</h2>
          <p>The most common reasons are a file just above the maximum size, a width or height that is a few pixels off, a minimum-size violation, the wrong format (PNG or HEIC instead of JPEG), and a mismatched DPI. The Velyto resizer sets pixel dimensions exactly, searches for the best JPEG quality inside your KB window, writes the DPI value into the file header and tells you immediately — with a tick or a cross — whether each requirement is met.</p>
          <p>Because processing happens locally in your browser, your face and signature are never transmitted to a server. That matters for documents like the {e.name} application, where identity images are sensitive.</p>

          <h2>{e.name} photo size FAQs</h2>
        </div>
        <div className="mx-auto max-w-3xl"><FaqList faqs={e.faqs} /></div>

        <section className="mx-auto mt-12 max-w-3xl" aria-labelledby="other-exams">
          <h2 id="other-exams" className="mb-3 text-xl font-extrabold">Other exam and form presets</h2>
          <ul className="flex flex-wrap gap-2">
            {others.map((x) => <li key={x.slug}><Link href={`/tools/exam-photo-resizer/${x.slug}`} className="chip">{x.name}</Link></li>)}
            <li><Link href="/tools/exam-photo-resizer" className="chip">← All presets</Link></li>
            <li><Link href="/tools/image-compressor" className="chip">Image Compressor</Link></li>
            <li><Link href="/guides/ssc-cgl-upsc-photo-signature-size-guide" className="chip">Photo size guide</Link></li>
          </ul>
        </section>
      </article>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebApplication", name: `${e.name} Photo & Signature Resizer`, url, applicationCategory: "UtilitiesApplication", operatingSystem: "Any (web browser)", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, dateModified: LAST_UPDATED },
            faqLd(e.faqs),
            breadcrumbLd(crumbs),
            { "@type": "HowTo", name: `How to resize your ${e.name} photo and signature`, dateModified: LAST_UPDATED, totalTime: "PT2M", step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: `Step ${i + 1}`, text: s })) },
          ],
        }}
      />
    </>
  );
}
