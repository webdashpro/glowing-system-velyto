import Link from "next/link";
import type { ReactNode } from "react";
import { abs } from "@/lib/site";
import { Icon, type IconName } from "./Icon";

export type Crumb = { name: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {i === items.length - 1 ? <span aria-current="page" className="font-semibold text-fg">{c.name}</span> : <Link href={c.href} className="hover:text-brand-link hover:underline">{c.name}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export const breadcrumbLd = (items: Crumb[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.href) })),
});

export const faqLd = (faqs: [string, string][]) => ({
  "@type": "FAQPage",
  mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

export function FaqList({ faqs }: { faqs: [string, string][] }) {
  return (
    <div className="grid gap-2">
      {faqs.map(([q, a]) => (
        <details key={q} className="group card px-4 py-3" open>
          <summary className="cursor-pointer list-none font-display font-bold [&::-webkit-details-marker]:hidden"><span className="mr-2 text-brand-link">Q.</span>{q}</summary>
          <p className="mt-2 text-muted">{a}</p>
        </details>
      ))}
    </div>
  );
}

export function PageHeader({ eyebrow, icon, title, sub, children }: { eyebrow?: string; icon?: IconName; title: ReactNode; sub?: ReactNode; children?: ReactNode }) {
  return (
    <section className="hero-bg border-b border-line">
      <div className="container-x py-12 sm:py-16">
        {eyebrow && <span className="eyebrow">{icon && <Icon name={icon} className="h-4 w-4" />}{eyebrow}</span>}
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold sm:text-5xl">{title}</h1>
        {sub && <p className="mt-4 max-w-2xl text-lg text-muted">{sub}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionTitle({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <div className="mb-8 max-w-2xl">
      {eyebrow && <p className="mb-2 text-sm font-bold uppercase tracking-wider text-brand-link">{eyebrow}</p>}
      <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-lg text-muted">{sub}</p>}
    </div>
  );
}

export function PrivacyStrip({ className = "" }: { className?: string }) {
  return (
    <p className={`inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-line bg-surface px-4 py-2 text-sm font-bold shadow-sm ${className}`}>
      <Icon name="shield" className="h-4 w-4 text-brand-link" />
      <span>100% Browser-First</span><span className="text-brand-link" aria-hidden="true">·</span>
      <span>Zero Uploads</span><span className="text-brand-link" aria-hidden="true">·</span>
      <span>Free Forever</span>
    </p>
  );
}
