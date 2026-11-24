import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import { PageHeader, breadcrumbLd } from "@/components/Common";
import JsonLd from "@/components/JsonLd";

export const metadata = buildMeta({
  title: "Changelog — Velyto v1 to v3",
  description: "What changed in each major Velyto release, from the first image tools to the five-product v3.0 platform.",
  path: "/changelog",
  absoluteTitle: true,
});

const RELEASES: { v: string; when: string; title: string; items: string[] }[] = [
  { v: "3.0", when: "May 2026", title: "One platform, five products", items: ["New design system: refined blue & white identity, display typography, dark mode, custom SVG icons and product mockups", "Velyto Media: video to image, images to video (.webm), batch image converter and audio recorder", "Velyto Shop (renamed from Dukaan): six currencies, live public catalogues with view and WhatsApp-click counters, QR poster, directory", "Velyto Study: marketing hero, sample chapter, weekly planner and resume builder", "Velyto Business: receipt generator, expense calculator, cloud save and a GST compliance checklist", "One real account (PostgreSQL, scrypt, HTTP-only sessions) across all products", "Programmatic exam photo pages for 10 exams, five guides, Hindi pilot, request board", "PWA with offline support, command palette (Ctrl+K), security headers, dynamic sitemap and OG images"] },
  { v: "2.0", when: "Early 2026", title: "Beyond tools", items: ["Added Dukaan catalogue builder, Study notes and flashcards and Business invoices", "Expanded to 25+ tools with a searchable directory", "Added favourites and recently used tools", "First FAQ and how-to content on every tool page"] },
  { v: "1.0", when: "2025", title: "The first release", items: ["Launched with a handful of browser-based image and calculator tools", "Exam photo and signature resizer", "Image compressor and image to PDF", "Zero uploads from day one"] },
];

export default function ChangelogPage() {
  return (
    <>
      <PageHeader eyebrow="Changelog" icon="clock" title="What's new in Velyto" sub="Major releases from v1 to v3. We keep the notes honest and short." />
      <div className="container-x py-12">
        <ol className="mx-auto grid max-w-3xl gap-6 border-l-2 border-line pl-6">
          {RELEASES.map((r) => (
            <li key={r.v} className="relative">
              <span className="absolute -left-[2.15rem] top-1 grid h-6 w-6 place-items-center rounded-full bg-brand text-[10px] font-bold text-white" aria-hidden="true">{r.v.split(".")[0]}</span>
              <div className="card p-5"><p className="text-xs font-bold text-brand-link">v{r.v} · {r.when}</p><h2 className="mt-1 text-xl font-extrabold">{r.title}</h2><ul className="mt-3 grid list-disc gap-1.5 pl-5 text-sm text-muted">{r.items.map((x) => <li key={x}>{x}</li>)}</ul></div>
            </li>
          ))}
        </ol>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [breadcrumbLd([{ name: "Home", href: "/" }, { name: "Changelog", href: "/changelog" }]), { "@type": "WebPage", name: "Velyto Changelog", url: abs("/changelog") }] }} />
    </>
  );
}
