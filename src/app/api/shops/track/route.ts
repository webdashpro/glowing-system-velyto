import { eq, sql } from "drizzle-orm";
import { getDb, hasDb, schema } from "@/db";
import { clientKey, json, noDb, rateLimit, str } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasDb()) return noDb();
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const slug = str(b.slug, 60);
  const kind = b.kind === "wa" ? "wa" : "view";
  if (!slug) return json({ error: "Missing slug" }, 400);
  if (!rateLimit(`track:${await clientKey()}:${slug}:${kind}`, 20, 60_000)) return json({ ok: true });
  try {
    const db = await getDb();
    await db
      .update(schema.shops)
      .set(kind === "wa" ? { waClicks: sql`${schema.shops.waClicks} + 1` } : { views: sql`${schema.shops.views} + 1` })
      .where(eq(schema.shops.slug, slug));
    return json({ ok: true });
  } catch {
    return json({ ok: false }, 500);
  }
}
