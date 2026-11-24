import { getDb, hasDb, schema } from "@/db";
import { clientKey, json, noDb, rateLimit, sameOrigin, str } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasDb()) return noDb();
  if (!(await sameOrigin())) return json({ error: "Bad origin" }, 403);
  if (!rateLimit(`contact:${await clientKey()}`, 5, 3600_000)) return json({ error: "Too many messages. Try again later." }, 429);
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = str(b.email, 200).toLowerCase();
  const message = str(b.message, 3000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ error: "Enter a valid email address." }, 400);
  if (message.length < 10) return json({ error: "Please write at least a sentence." }, 400);
  const db = await getDb();
  await db.insert(schema.contactMessages).values({ name: str(b.name, 80), email, message });
  return json({ ok: true });
}
