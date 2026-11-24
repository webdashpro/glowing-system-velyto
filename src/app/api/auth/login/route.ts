import { eq } from "drizzle-orm";
import { getDb, hasDb, schema } from "@/db";
import { clientKey, createSession, json, noDb, rateLimit, sameOrigin, str, verifyPassword } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasDb()) return noDb();
  if (!(await sameOrigin())) return json({ error: "Bad origin" }, 403);
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = str(body.email, 200).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  if (!rateLimit(`login:${await clientKey()}:${email}`, 10, 15 * 60_000)) return json({ error: "Too many attempts. Please wait a few minutes." }, 429);
  try {
    const db = await getDb();
    const [u] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    if (!u || !(await verifyPassword(password, u.passwordHash))) return json({ error: "Incorrect email or password." }, 401);
    await createSession(u.id);
    return json({ user: { id: u.id, email: u.email, name: u.name } });
  } catch {
    return json({ error: "Could not log in right now. Please try again." }, 500);
  }
}
