import Link from "next/link";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb, hasDb, schema } from "@/db";
import { buildMeta } from "@/lib/seo";
import { PageHeader } from "@/components/Common";
import { SHOP_CATEGORIES } from "@/lib/shop";
import { Icon } from "@/components/Icon";

export const dynamic = "force-dynamic";
export const metadata = buildMeta({
  title: "Shop Directory — Discover Local WhatsApp Shops by City & Category",
  description: "Browse public Velyto shops. Filter by city and category and order directly on WhatsApp.",
  path: "/shops",
  absoluteTitle: true,
});

export default async function ShopsPage({ searchParams }: { searchParams: Promise<{ city?: string; category?: string; q?: string }> }) {
  const sp = await searchParams;
  const city = (sp.city ?? "").trim().slice(0, 60);
  const category = (sp.category ?? "").trim().slice(0, 40);
  const q = (sp.q ?? "").trim().slice(0, 60);
  let rows: (typeof schema.shops.$inferSelect)[] = [];
  let cities: string[] = [];
  let configured = hasDb();
  if (configured) {
    try {
      const db = await getDb();
      const conds = [eq(schema.shops.published, true)];
      if (city) conds.push(eq(sql`lower(${schema.shops.city})`, city.toLowerCase()));
      if (category) conds.push(eq(schema.shops.category, category));
      if (q) conds.push(or(ilike(schema.shops.name, `%${q}%`), ilike(schema.shops.tagline, `%${q}%`))!);
      rows = await db.select().from(schema.shops).where(and(...conds)).orderBy(desc(schema.shops.views), desc(schema.shops.createdAt)).limit(60);
      const c = await db.selectDistinct({ city: schema.shops.city }).from(schema.shops).where(eq(schema.shops.published, true)).limit(100);
      cities = c.map((x) => x.city).filter(Boolean).sort();
    } catch {
      configured = false;
    }
  }
  return (
    <>
      <PageHeader eyebrow="Shop Directory" icon="store" title="Discover shops near you" sub="Every shop here was published by its owner with Velyto Shop. Filter by city or category and order on WhatsApp." />
      <div className="container-x py-10">
        <form className="card mb-8 grid gap-3 p-4 sm:grid-cols-[1fr_1fr_1fr_auto]" method="get" action="/shops" role="search">
          <label><span className="label">Search</span><input name="q" defaultValue={q} className="input" placeholder="Shop name…" /></label>
          <label><span className="label">City</span><select name="city" defaultValue={city} className="input"><option value="">All cities</option>{cities.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label><span className="label">Category</span><select name="category" defaultValue={category} className="input"><option value="">All categories</option>{SHOP_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
          <button className="btn btn-primary self-end" type="submit"><Icon name="search" className="h-4 w-4" />Filter</button>
        </form>
        {rows.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((s) => (
              <li key={s.id}>
                <Link href={`/s/${s.slug}`} className="card card-hover flex h-full gap-4 p-5">
                  <span className="grid h-14 w-14 flex-none place-items-center rounded-2xl bg-brand-soft text-3xl" aria-hidden="true">{s.products[0]?.emoji ?? "🛍️"}</span>
                  <span className="min-w-0"><span className="block font-display text-lg font-extrabold leading-tight">{s.name}</span><span className="mt-1 block text-sm text-muted">{s.tagline || "Browse the catalogue"}</span><span className="mt-2 flex flex-wrap gap-1.5 text-xs font-semibold"><span className="rounded-full bg-brand-soft px-2 py-0.5 text-brand-ink">{s.category}</span>{s.city && <span className="rounded-full bg-soft px-2 py-0.5">📍 {s.city}</span>}<span className="rounded-full bg-soft px-2 py-0.5">{s.products.length} products</span></span></span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="card mx-auto max-w-xl p-10 text-center">
            <span className="icon-tile mx-auto !h-14 !w-14"><Icon name="store" className="h-7 w-7" /></span>
            <h2 className="mt-4 text-xl font-extrabold">{configured ? (city || category || q ? "No shops match these filters" : "No public shops yet — be the first!") : "The directory needs a database connection"}</h2>
            <p className="mt-2 text-muted">{configured ? "Publish your catalogue with a free account and it will appear here instantly." : "Set DATABASE_URL to enable shop publishing and the directory. All tools still work."}</p>
            <Link href="/shop" className="btn btn-primary mt-5">Create your shop</Link>
          </div>
        )}
      </div>
    </>
  );
}
