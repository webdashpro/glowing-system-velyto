import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, guideBySlug } from "@/data/guides";
import { toolBySlug } from "@/data/tools";
import { buildMeta } from "@/lib/seo";
import { abs, AUTHOR } from "@/lib/site";
import { Breadcrumbs, breadcrumbLd } from "@/components/Common";
import JsonLd from "@/components/JsonLd";
import Rich from "@/components/Rich";
import ToolCard from "@/components/ToolCard";

export const dynamicParams = false;
export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) return {};
  return buildMeta({ title: g.title, description: g.description, path: `/guides/${slug}`, type: "article", ogSub: `Guide · ${g.readMins} min read` });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) notFound();
  const crumbs = [{ name: "Home", href: "/" }, { name: "Guides", href: "/guides" }, { name: g.title, href: `/guides/${slug}` }];
  const tools = g.tools.map((s) => toolBySlug(s)).filter((t): t is NonNullable<typeof t> => Boolean(t));
  const others = GUIDES.filter((x) => x.slug !== slug).slice(0, 3);
  return (
    <>
      <div className="hero-bg border-b border-line">
        <div className="container-x pb-10 pt-8">
          <Breadcrumbs items={crumbs} />
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">{g.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{g.description}</p>
          <p className="mt-4 text-sm text-muted">By {AUTHOR} · Last updated: <time dateTime={g.updated}>{g.updatedLabel}</time> · {g.readMins} min read</p>
        </div>
      </div>
      <article className="container-x py-10">
        <div className="prose-v mx-auto max-w-3xl">
          {g.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((p, i) => <p key={i}><Rich text={p} /></p>)}
            </section>
          ))}
        </div>
        <aside className="mx-auto mt-12 max-w-3xl" aria-labelledby="try">
          <h2 id="try" className="mb-3 text-xl font-extrabold">Free tools mentioned in this guide</h2>
          <div className="grid gap-3 sm:grid-cols-2">{tools.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
        </aside>
        <aside className="mx-auto mt-10 max-w-3xl" aria-labelledby="more">
          <h2 id="more" className="mb-3 text-xl font-extrabold">More guides</h2>
          <ul className="grid gap-2">{others.map((o) => <li key={o.slug}><Link className="font-semibold text-brand-link underline" href={`/guides/${o.slug}`}>{o.title}</Link></li>)}</ul>
        </aside>
      </article>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [
        { "@type": "Article", headline: g.title, description: g.description, datePublished: g.updated, dateModified: g.updated, mainEntityOfPage: abs(`/guides/${slug}`), image: abs(`/og?title=${encodeURIComponent(g.title)}`), author: { "@type": "Organization", name: AUTHOR, url: abs("/about") }, publisher: { "@id": abs("/#org") }, inLanguage: "en" },
        breadcrumbLd(crumbs),
      ] }} />
    </>
  );
}
