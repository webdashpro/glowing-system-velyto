import Link from "next/link";
import { POPULAR } from "@/data/tools";
import { Icon } from "@/components/Icon";
import NotFoundSearch from "@/components/NotFoundSearch";

export const metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <section className="hero-bg">
      <div className="container-x grid justify-items-center gap-6 py-20 text-center sm:py-28">
        <svg viewBox="0 0 200 120" className="h-32 w-auto" aria-hidden="true">
          <text x="100" y="92" textAnchor="middle" fontSize="96" fontWeight="800" className="fill-brand" fontFamily="var(--font-display)">404</text>
          <circle cx="40" cy="30" r="6" className="fill-brand-soft" /><circle cx="168" cy="48" r="9" className="fill-brand-soft" /><circle cx="150" cy="14" r="4" className="fill-brand" opacity="0.4" />
        </svg>
        <div><h1 className="text-3xl font-extrabold sm:text-4xl">We couldn&apos;t find that page</h1><p className="mx-auto mt-2 max-w-md text-muted">The link may be old or mistyped. Search for a tool, or jump to something popular.</p></div>
        <NotFoundSearch />
        <div className="flex flex-wrap justify-center gap-2" aria-label="Popular tools">{POPULAR.slice(0, 6).map((t) => <Link key={t.slug} href={`/tools/${t.slug}`} className="chip"><Icon name={t.icon} className="h-4 w-4 text-brand-link" />{t.name}</Link>)}</div>
        <div className="flex gap-3"><Link href="/" className="btn btn-primary">Go home</Link><Link href="/tools" className="btn btn-secondary">All tools</Link></div>
      </div>
    </section>
  );
}
