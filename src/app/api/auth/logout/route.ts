import { destroySession, json, sameOrigin } from "@/lib/server";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!(await sameOrigin())) return json({ error: "Bad origin" }, 403);
  await destroySession();
  return json({ ok: true });
}
