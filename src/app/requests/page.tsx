import { desc, eq } from "drizzle-orm";
import { getDb, hasDb, schema } from "@/db";
import { getSessionUser } from "@/lib/server";
import { buildMeta } from "@/lib/seo";
import { PageHeader } from "@/components/Common";
import RequestsBoard, { type Req } from "@/components/RequestsBoard";

export const dynamic = "force-dynamic";
export const metadata = buildMeta({
  title: "Tool Requests — Suggest and Vote on the Next Velyto Tool",
  description: "Public request board: suggest a new free tool and vote on what Velyto should build next.",
  path: "/requests",
  absoluteTitle: true,
});

export default async function RequestsPage() {
  let initial: Req[] = [];
  const configured = hasDb();
  if (configured) {
    try {
      const db = await getDb();
      const user = await getSessionUser();
      const rows = await db.select().from(schema.toolRequests).orderBy(desc(schema.toolRequests.votes), desc(schema.toolRequests.createdAt)).limit(60);
      const mine = user ? await db.select({ id: schema.requestVotes.requestId }).from(schema.requestVotes).where(eq(schema.requestVotes.userId, user.id)) : [];
      const set = new Set(mine.map((m) => m.id));
      initial = rows.map((r) => ({ id: r.id, title: r.title, details: r.details, author: r.author, votes: r.votes, status: r.status, voted: set.has(r.id) }));
    } catch {
      /* show empty board */
    }
  }
  return (
    <>
      <PageHeader eyebrow="Community" icon="users" title="Request a tool. Vote on what's next." sub="Velyto's roadmap is shaped by the people who use it. Suggest a tool or upvote the ideas you want most." />
      <div className="container-x py-10"><RequestsBoard initial={initial} configured={configured} /></div>
    </>
  );
}
