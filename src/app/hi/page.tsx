import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import { HI_HOME, HI_TOOLS } from "@/data/hi-tools";
import { toolBySlug } from "@/data/tools";
import { Icon } from "@/components/Icon";

export const metadata = buildMeta({
  title: HI_HOME.title,
  description: HI_HOME.description,
  path: "/hi",
  absoluteTitle: true,
  languages: { en: abs("/"), hi: abs("/hi"), "x-default": abs("/") },
});

export default function HiHome() {
  return (
    <div lang="hi">
      <section className="hero-bg border-b border-line">
        <div className="container-x py-14 sm:py-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold shadow-sm"><Icon name="shield" className="h-4 w-4 text-brand-link" />{HI_HOME.privacy}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">{HI_HOME.h1}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">{HI_HOME.sub}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/hi/tools/exam-photo-resizer" className="btn btn-primary">फ़ोटो रिसाइज़ करें<Icon name="arrow" className="h-4 w-4" /></Link>
            <Link href="/" hrefLang="en" lang="en" className="btn btn-secondary">View in English</Link>
          </div>
        </div>
      </section>
      <section className="container-x py-14">
        <h2 className="text-3xl font-extrabold">{HI_HOME.topTools}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(HI_TOOLS).map((h) => {
            const t = toolBySlug(h.slug)!;
            return (
              <Link key={h.slug} href={`/hi/tools/${h.slug}`} className="card card-hover flex gap-3 p-5">
                <span className="icon-tile"><Icon name={t.icon} /></span>
                <span><span className="block font-display font-bold">{h.name}</span><span className="mt-1 block text-sm text-muted">{h.description}</span></span>
              </Link>
            );
          })}
        </div>
        <p className="mt-6"><Link href="/tools" hrefLang="en" lang="en" className="font-semibold text-brand-link underline">{HI_HOME.allTools} (English)</Link></p>
      </section>
      <section className="container-x pb-6">
        <div className="grid gap-4 md:grid-cols-3">
          {HI_HOME.why.map(([t, d]) => <div key={t} className="card p-5"><h3 className="text-lg font-extrabold">{t}</h3><p className="mt-2 text-muted">{d}</p></div>)}
        </div>
      </section>
    </div>
  );
}
