import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOLS, toolBySlug, categoryLabel } from "@/data/tools";
import { getToolContent, CATEGORY_NOTES, CATEGORY_EXTRA, PRIVACY_NOTE } from "@/data/tool-content";
import { EXAMS } from "@/data/exams";
import { HI_SLUGS } from "@/data/hi-tools";
import { buildMeta } from "@/lib/seo";
import { abs, AUTHOR, LAST_UPDATED, LAST_UPDATED_LABEL } from "@/lib/site";
import { Breadcrumbs, FaqList, breadcrumbLd, faqLd } from "@/components/Common";
import { Icon } from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import ToolRunner from "@/components/ToolRunner";
import ToolCard from "@/components/ToolCard";

export const dynamicParams = false;
export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = toolBySlug(slug);
  if (!t) return {};
  const hi = HI_SLUGS.includes(slug);
  return buildMeta({
    title: `${t.name} — Free Online Tool`,
    description: `${t.short} Free, private and works in your browser — no upload, no sign-up.`,
    path: `/tools/${slug}`,
    ogSub: `Free · Browser-first · ${categoryLabel(t.category)}`,
    languages: hi ? { en: abs(`/tools/${slug}`), hi: abs(`/hi/tools/${slug}`), "x-default": abs(`/tools/${slug}`) } : undefined,
  });
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolBySlug(slug);
  const c = getToolContent(slug);
  if (!tool || !c) notFound();
  const note = CATEGORY_NOTES[tool.category];
  const extra = CATEGORY_EXTRA[tool.category];
  const baseWords = JSON.stringify(c).split(/\s+/).length;
  const long = baseWords > 400;
  const veryLong = baseWords > 480;
  const related = tool.related.map((s) => toolBySlug(s)).filter((t): t is NonNullable<typeof t> => Boolean(t));
  const url = abs(`/tools/${slug}`);
  const crumbs = [{ name: "Home", href: "/" }, { name: "Tools", href: "/tools" }, { name: tool.name, href: `/tools/${slug}` }];
  const isExam = slug === "exam-photo-resizer";

  return (
    <>
      <div className="hero-bg border-b border-line">
        <div className="container-x pb-8 pt-8">
          <Breadcrumbs items={crumbs} />
          <div className="flex items-start gap-4">
            <span className="icon-tile !h-14 !w-14 !rounded-2xl"><Icon name={tool.icon} className="h-7 w-7" /></span>
            <div>
              <h1 className="flex flex-wrap items-center gap-3 text-3xl font-extrabold sm:text-4xl">{tool.name}{tool.isNew && <span className="badge-new">New</span>}</h1>
              <p className="mt-2 max-w-2xl text-lg text-muted">{tool.short} Free, private and runs entirely in your browser.</p>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                <span>Last updated: <time dateTime={LAST_UPDATED}>{LAST_UPDATED_LABEL}</time></span>
                <span>By {AUTHOR}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-brand-ink"><Icon name="shield" className="h-4 w-4" />Zero uploads</span>
                {HI_SLUGS.includes(slug) && <Link href={`/hi/tools/${slug}`} hrefLang="hi" lang="hi" className="font-semibold text-brand-link underline">हिंदी में देखें</Link>}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x py-8">
        <ToolRunner slug={slug} />
      </div>

      <article className="container-x pb-6">
        <div className="prose-v mx-auto max-w-3xl">
          <h2>About the {tool.name}</h2>
          {c.intro.map((p, i) => <p key={i}>{p}</p>)}

          <h2>How to use it in 3 steps</h2>
          <ol id="how-to">{c.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>

          <h2>Worked examples</h2>
          <div className="table-wrap"><table><caption className="p-3 text-left text-sm font-semibold text-muted">{c.table.caption}</caption><thead><tr>{c.table.head.map((h) => <th key={h}>{h}</th>)}</tr></thead><tbody>{c.table.rows.map((r, i) => <tr key={i}>{r.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>

          <h2>Tips and edge cases</h2>
          <ul>{c.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
          <p>{note.edge}</p>

          {!veryLong && (<><h2>Common mistakes to avoid</h2>
          <ul>{(long ? extra.mistakes.slice(0, 2) : extra.mistakes).map((m, i) => <li key={i}>{m}</li>)}</ul></>)}

          {isExam && (
            <>
              <h2>Ready-made presets for 10 popular exams and forms</h2>
              <p>Each page below lists the exact pixel size, file-size range and DPI, with a checklist and an embedded resizer already set up for that exam.</p>
              <ul>{EXAMS.map((e) => <li key={e.slug}><Link href={`/tools/exam-photo-resizer/${e.slug}`}>{e.name} photo &amp; signature size</Link></li>)}</ul>
            </>
          )}

          <h2>How it works</h2>
          <p>{note.how}</p>
          <h2>Who uses it</h2>
          <p>{note.who}</p>
          {!long && (<><h2>Device and browser support</h2><p>{extra.support}</p></>)}
          <p><strong>{PRIVACY_NOTE}</strong></p>

          <h2>Frequently asked questions</h2>
        </div>
        <div className="mx-auto max-w-3xl"><FaqList faqs={c.faqs} /></div>

        <section className="mt-12" aria-labelledby="related">
          <h2 id="related" className="mb-4 text-2xl font-extrabold">Related tools</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{related.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
        </section>
      </article>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebApplication", name: tool.name, url, description: tool.short, applicationCategory: "UtilitiesApplication", operatingSystem: "Any (web browser)", isAccessibleForFree: true, inLanguage: HI_SLUGS.includes(slug) ? ["en", "hi"] : "en", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, dateModified: LAST_UPDATED, author: { "@type": "Organization", name: AUTHOR, url: abs("/about") }, publisher: { "@id": abs("/#org") } },
            faqLd(c.faqs),
            breadcrumbLd(crumbs),
            { "@type": "HowTo", name: `How to use the ${tool.name}`, description: tool.short, dateModified: LAST_UPDATED, totalTime: "PT2M", tool: [{ "@type": "HowToTool", name: "A modern web browser" }], step: c.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: `Step ${i + 1}`, text: s, url: `${url}#how-to` })) },
          ],
        }}
      />
    </>
  );
}
