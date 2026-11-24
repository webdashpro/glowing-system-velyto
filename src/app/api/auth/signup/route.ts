import { eq } from "drizzle-orm";
import { getDb, hasDb, schema } from "@/db";
import { clientKey, createSession, hashPassword, json, noDb, rateLimit, sameOrigin, str } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!hasDb()) return noDb();
  if (!(await sameOrigin())) return json({ error: "Bad origin" }, 403);
  if (!rateLimit(`signup:${await clientKey()}`, 8, 3600_000)) return json({ error: "Too many attempts. Please try again later." }, 429);
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const email = str(body.email, 200).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  const name = str(body.name, 80);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ error: "Enter a valid email address." }, 400);
  if (password.length < 8 || password.length > 200) return json({ error: "Password must be at least 8 characters." }, 400);
  try {
    const db = await getDb();
    const exists = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email)).limit(1);
    if (exists.length) return json({ error: "An account with this email already exists. Try logging in." }, 409);
    const [u] = await db.insert(schema.users).values({ email, name, passwordHash: await hashPassword(password) }).returning({ id: schema.users.id, email: schema.users.email, name: schema.users.name });
    await createSession(u.id);
    return json({ user: u }, 201);
  } catch {
    return json({ error: "Could not create the account right now. Please try again." }, 500);
  }
}
