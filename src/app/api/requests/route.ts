import { eq } from "drizzle-orm";
import { getDb, hasDb, schema } from "@/db";
import { getSessionUser, json, noDb, rateLimit, sameOrigin, str } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasDb()) return noDb();
  if (!(await sameOrigin())) return json({ error: "Bad origin" }, 403);
  const user = await getSessionUser();
  if (!user) return json({ error: "Please log in to submit a request." }, 401);
  if (!rateLimit(`req:${user.id}`, 5, 3600_000)) return json({ error: "You can submit up to 5 requests per hour." }, 429);
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const title = str(b.title, 100);
  if (title.length < 4) return json({ error: "Give your request a short, clear title (4+ characters)." }, 400);
  const db = await getDb();
  const [row] = await db.insert(schema.toolRequests).values({ userId: user.id, author: user.name || user.email.split("@")[0], title, details: str(b.details, 600), votes: 1 }).returning();
  await db.insert(schema.requestVotes).values({ requestId: row.id, userId: user.id }).onConflictDoNothing();
  return json({ request: row }, 201);
}

export async function DELETE(req: Request) {
  if (!hasDb()) return noDb();
  if (!(await sameOrigin())) return json({ error: "Bad origin" }, 403);
  const user = await getSessionUser();
  if (!user) return json({ error: "Please log in." }, 401);
  const id = new URL(req.url).searchParams.get("id") || "";
  const db = await getDb();
  const [r] = await db.select().from(schema.toolRequests).where(eq(schema.toolRequests.id, id)).limit(1);
  if (r && r.userId === user.id) await db.delete(schema.toolRequests).where(eq(schema.toolRequests.id, id));
  return json({ ok: true });
}
