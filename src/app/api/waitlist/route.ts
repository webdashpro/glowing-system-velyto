import { getDb, hasDb, schema } from "@/db";
import { clientKey, getSessionUser, json, noDb, rateLimit, sameOrigin, str } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasDb()) return noDb();
  if (!(await sameOrigin())) return json({ error: "Bad origin" }, 403);
  if (!rateLimit(`wl:${await clientKey()}`, 6, 3600_000)) return json({ error: "Too many requests. Try again later." }, 429);
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = str(b.email, 200).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ error: "Enter a valid email address." }, 400);
  try {
    const db = await getDb();
    const user = await getSessionUser();
    const res = await db.insert(schema.waitlist).values({ email, userId: user?.id ?? null, interest: str(b.interest, 200) }).onConflictDoNothing().returning({ id: schema.waitlist.id });
    return json({ ok: true, already: res.length === 0 });
  } catch {
    return json({ error: "Could not join the waitlist right now." }, 500);
  }
}
