import { eq } from "drizzle-orm";
import { getDb, hasDb, schema } from "@/db";
import { getSessionUser, json, noDb, rateLimit, sameOrigin } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDb()) return noDb();
  const user = await getSessionUser();
  if (!user) return json({ error: "guest" }, 401);
  const db = await getDb();
  const [row] = await db.select().from(schema.studyState).where(eq(schema.studyState.userId, user.id)).limit(1);
  return json({ data: row?.data ?? null, updatedAt: row?.updatedAt ?? null });
}

export async function PUT(req: Request) {
  if (!hasDb()) return noDb();
  if (!(await sameOrigin())) return json({ error: "Bad origin" }, 403);
  const user = await getSessionUser();
  if (!user) return json({ error: "guest" }, 401);
  if (!rateLimit(`study:${user.id}`, 120, 600_000)) return json({ error: "Slow down" }, 429);
  const b = (await req.json().catch(() => ({}))) as { data?: unknown };
  if (!b.data || typeof b.data !== "object") return json({ error: "Invalid data" }, 400);
  const raw = JSON.stringify(b.data);
  if (raw.length > 900_000) return json({ error: "Study data is too large to sync." }, 413);
  const db = await getDb();
  await db
    .insert(schema.studyState)
    .values({ userId: user.id, data: b.data as Record<string, unknown>, updatedAt: new Date() })
    .onConflictDoUpdate({ target: schema.studyState.userId, set: { data: b.data as Record<string, unknown>, updatedAt: new Date() } });
  return json({ ok: true });
}
