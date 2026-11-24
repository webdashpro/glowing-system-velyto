import { and, desc, eq } from "drizzle-orm";
import { getDb, hasDb, schema } from "@/db";
import { getSessionUser, json, noDb, rateLimit, sameOrigin, str } from "@/lib/server";
import { CURRENCIES } from "@/data/currencies";

export const dynamic = "force-dynamic";
const TYPES = ["invoice", "bill", "quotation", "receipt", "expense"];

export async function GET(req: Request) {
  if (!hasDb()) return noDb();
  const user = await getSessionUser();
  if (!user) return json({ error: "Please log in." }, 401);
  const type = new URL(req.url).searchParams.get("type");
  const db = await getDb();
  const docs = await db.select().from(schema.businessDocs).where(type && TYPES.includes(type) ? and(eq(schema.businessDocs.userId, user.id), eq(schema.businessDocs.type, type)) : eq(schema.businessDocs.userId, user.id)).orderBy(desc(schema.businessDocs.updatedAt)).limit(100);
  const clients = await db.select().from(schema.businessClients).where(eq(schema.businessClients.userId, user.id)).orderBy(schema.businessClients.name).limit(200);
  return json({ docs, clients });
}

export async function POST(req: Request) {
  if (!hasDb()) return noDb();
  if (!(await sameOrigin())) return json({ error: "Bad origin" }, 403);
  const user = await getSessionUser();
  if (!user) return json({ error: "Please log in to save to the cloud." }, 401);
  if (!rateLimit(`doc:${user.id}`, 120, 3600_000)) return json({ error: "Too many saves. Try again later." }, 429);
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const type = str(b.type, 20);
  if (!TYPES.includes(type)) return json({ error: "Invalid document type." }, 400);
  const data = b.data && typeof b.data === "object" ? (b.data as Record<string, unknown>) : {};
  if (JSON.stringify(data).length > 200_000) return json({ error: "Document is too large." }, 413);
  const values = {
    type,
    number: str(b.number, 40),
    clientName: str(b.clientName, 120),
    currency: CURRENCIES.some((c) => c.code === b.currency) ? String(b.currency) : "USD",
    total: String(Math.max(0, Math.round((Number(b.total) || 0) * 100) / 100)),
    data,
    updatedAt: new Date(),
  };
  try {
    const db = await getDb();
    let doc;
    const id = str(b.id, 60);
    if (id) [doc] = await db.update(schema.businessDocs).set(values).where(and(eq(schema.businessDocs.id, id), eq(schema.businessDocs.userId, user.id))).returning();
    if (!doc) [doc] = await db.insert(schema.businessDocs).values({ ...values, userId: user.id }).returning();
    const c = b.client as Record<string, unknown> | undefined;
    const cname = str(c?.name, 120);
    if (cname) {
      await db
        .insert(schema.businessClients)
        .values({ userId: user.id, name: cname, email: str(c?.email, 160), phone: str(c?.phone, 40), address: str(c?.address, 300) })
        .onConflictDoUpdate({ target: [schema.businessClients.userId, schema.businessClients.name], set: { email: str(c?.email, 160), phone: str(c?.phone, 40), address: str(c?.address, 300) } });
    }
    return json({ doc });
  } catch {
    return json({ error: "Could not save. Please try again." }, 500);
  }
}

export async function DELETE(req: Request) {
  if (!hasDb()) return noDb();
  if (!(await sameOrigin())) return json({ error: "Bad origin" }, 403);
  const user = await getSessionUser();
  if (!user) return json({ error: "Please log in." }, 401);
  const url = new URL(req.url);
  const db = await getDb();
  const id = url.searchParams.get("id");
  const client = url.searchParams.get("client");
  if (id) await db.delete(schema.businessDocs).where(and(eq(schema.businessDocs.id, id), eq(schema.businessDocs.userId, user.id)));
  if (client) await db.delete(schema.businessClients).where(and(eq(schema.businessClients.id, client), eq(schema.businessClients.userId, user.id)));
  return json({ ok: true });
}
