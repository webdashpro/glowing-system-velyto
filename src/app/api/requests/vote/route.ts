import { and, eq, sql } from "drizzle-orm";
import { getDb, hasDb, schema } from "@/db";
import { getSessionUser, json, noDb, rateLimit, sameOrigin, str } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasDb()) return noDb();
  if (!(await sameOrigin())) return json({ error: "Bad origin" }, 403);
  const user = await getSessionUser();
  if (!user) return json({ error: "Please log in to vote." }, 401);
  if (!rateLimit(`vote:${user.id}`, 60, 3600_000)) return json({ error: "Too many votes. Try again later." }, 429);
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = str(b.id, 60);
  const db = await getDb();
  const result = await db.transaction(async (tx) => {
    const existing = await tx.select().from(schema.requestVotes).where(and(eq(schema.requestVotes.requestId, id), eq(schema.requestVotes.userId, user.id))).limit(1);
    if (existing.length) {
      await tx.delete(schema.requestVotes).where(and(eq(schema.requestVotes.requestId, id), eq(schema.requestVotes.userId, user.id)));
      const [r] = await tx.update(schema.toolRequests).set({ votes: sql`greatest(${schema.toolRequests.votes} - 1, 0)` }).where(eq(schema.toolRequests.id, id)).returning({ votes: schema.toolRequests.votes });
      return { voted: false, votes: r?.votes ?? 0 };
    }
    await tx.insert(schema.requestVotes).values({ requestId: id, userId: user.id });
    const [r] = await tx.update(schema.toolRequests).set({ votes: sql`${schema.toolRequests.votes} + 1` }).where(eq(schema.toolRequests.id, id)).returning({ votes: schema.toolRequests.votes });
    return { voted: true, votes: r?.votes ?? 1 };
  }).catch(() => null);
  return result ? json(result) : json({ error: "Could not record your vote." }, 500);
}
