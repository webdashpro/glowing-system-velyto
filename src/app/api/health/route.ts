import { sql } from "drizzle-orm";
import { getDb, hasDb } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasDb()) return Response.json({ ok: true, db: "not-configured" });
  try {
    const db = await getDb();
    await db.execute(sql`select 1`);
    return Response.json({ ok: true, db: "up" });
  } catch {
    // The app itself is healthy even when the database is unreachable (guest mode keeps working).
    return Response.json({ ok: true, db: "down" });
  }
}
