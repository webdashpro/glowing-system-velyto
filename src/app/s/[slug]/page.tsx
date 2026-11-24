import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getDb, hasDb, schema } from "@/db";
import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import ShopCatalogue from "@/components/ShopCatalogue";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

async function load(slug: string) {
  if (!hasDb()) return null;
  try {
    const db = await getDb();
    const [s] = await db.select().from(schema.shops).where(and(eq(schema.shops.slug, slug), eq(schema.shops.published, true))).limit(1);
    return s ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = await load(slug);
  if (!s) return { title: "Shop not found", robots: { index: false } };
  return buildMeta({ title: `${s.name}${s.city ? ` — ${s.city}` : ""} | Catalogue`, description: `${s.tagline || `Browse ${s.name}'s catalogue`} · ${s.products.length} products · Order on WhatsApp.`, path: `/s/${slug}`, ogSub: `${s.category}${s.city ? ` · ${s.city}` : ""} · Order on WhatsApp` });
}

export default async function PublicShop({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await load(slug);
  if (!s) notFound();
  const shop = { id: s.id, slug: s.slug, name: s.name, tagline: s.tagline, city: s.city, category: s.category, currency: s.currency, whatsapp: s.whatsapp, products: s.products };
  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <ShopCatalogue shop={shop} track />
      <p className="mt-6 text-center text-xs text-muted">Catalogue made with <Link href="/shop" className="font-semibold text-brand-link underline">Velyto Shop</Link> · <Link href="/shops" className="underline">Shop Directory</Link></p>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Store", name: s.name, description: s.tagline, url: abs(`/s/${s.slug}`), address: s.city ? { "@type": "PostalAddress", addressLocality: s.city } : undefined, makesOffer: s.products.slice(0, 20).map((p) => ({ "@type": "Offer", price: p.price, priceCurrency: s.currency, itemOffered: { "@type": "Product", name: p.name, description: p.description } })) }} />
    </div>
  );
}
