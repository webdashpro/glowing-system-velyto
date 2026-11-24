import { and, desc, eq } from "drizzle-orm";
import { getDb, hasDb, schema, type ShopProductT } from "./types";
import { getSessionUser, json, noDb, rateLimit, sameOrigin, str } from "@/lib/server";
import { CURRENCIES } from "@/data/currencies";
import { digits, slugify } from "@/lib/shop";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDb()) return noDb();
  const user = await getSessionUser();
  if (!user) return json({ error: "Please log in." }, 401);
  const db = await getDb();
  const rows = await db.select().from(schema.shops).where(eq(schema.shops.userId, user.id)).orderBy(desc(schema.shops.updatedAt));
  return json({ shops: rows });
}

export async function POST(req: Request) {
  if (!hasDb()) return noDb();
  if (!(await sameOrigin())) return json({ error: "Bad origin" }, 403);
  const user = await getSessionUser();
  if (!user) return json({ error: "Please log in to publish your shop." }, 401);
  if (!rateLimit(`shop:${user.id}`, 40, 3600_000)) return json({ error: "Too many saves. Try again later." }, 429);
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = str(b.name, 60);
  const whatsapp = digits(str(b.whatsapp, 30));
  const currency = CURRENCIES.some((c) => c.code === b.currency) ? String(b.currency) : "USD";
  if (name.length < 2) return json({ error: "Shop name is required." }, 400);
  if (whatsapp.length < 7 || whatsapp.length > 15) return json({ error: "Enter a WhatsApp number in international format, e.g. 919876543210." }, 400);
  const rawProducts = Array.isArray(b.products) ? b.products.slice(0, 60) : [];
  const products: ShopProductT[] = rawProducts
    .map((p: Record<string, unknown>, i: number) => ({ id: str(p.id, 40) || `p${i}`, name: str(p.name, 80), price: Math.max(0, Math.round(Number(p.price) * 100) / 100 || 0), description: str(p.description, 240), emoji: str(p.emoji, 8) || "🛍️" }))
    .filter((p) => p.name);
  if (!products.length) return json({ error: "Add at least one product." }, 400);
  const values = { name, tagline: str(b.tagline, 120), city: str(b.city, 60), category: str(b.category, 40) || "General", currency, whatsapp, products, published: b.published !== false, updatedAt: new Date() };
  try {
    const db = await getDb();
    const id = str(b.id, 60);
    if (id) {
      const [row] = await db.update(schema.shops).set(values).where(and(eq(schema.shops.id, id), eq(schema.shops.userId, user.id))).returning();
      if (row) return json({ shop: row });
    }
    const base = slugify(name);
    for (let i = 0; i < 6; i++) {
      const slug = i === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`;
      const taken = await db.select({ id: schema.shops.id }).from(schema.shops).where(eq(schema.shops.slug, slug)).limit(1);
      if (taken.length) continue;
      const [row] = await db.insert(schema.shops).values({ ...values, userId: user.id, slug }).returning();
      return json({ shop: row }, 201);
    }
    return json({ error: "Could not allocate a link. Try a different shop name." }, 409);
  } catch {
    return json({ error: "Could not save the shop. Please try again." }, 500);
  }
}

export async function DELETE(req: Request) {
  if (!hasDb()) return noDb();
  if (!(await sameOrigin())) return json({ error: "Bad origin" }, 403);
  const user = await getSessionUser();
  if (!user) return json({ error: "Please log in." }, 401);
  const id = new URL(req.url).searchParams.get("id") || "";
  const db = await getDb();
  await db.delete(schema.shops).where(and(eq(schema.shops.id, id), eq(schema.shops.userId, user.id)));
  return json({ ok: true });
}
