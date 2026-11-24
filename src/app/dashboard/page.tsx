import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSessionUser } from "@/lib/server";
import { buildMeta } from "@/lib/seo";
import { money } from "@/data/currencies";
import { streakCount } from "@/lib/streak";
import { Icon } from "@/components/Icon";
import { DeleteButton, LogoutButton } from "@/components/DashboardActions";

export const dynamic = "force-dynamic";
export const metadata = buildMeta({ title: "Dashboard", description: "Your Velyto account dashboard.", path: "/dashboard", noindex: true });

function StatCard({ icon, label, value, sub }: { icon: "store" | "chart" | "chat" | "file" | "users" | "book" | "timer"; label: string; value: string | number; sub?: string }) {
  return <div className="card p-4"><span className="icon-tile !h-9 !w-9"><Icon name={icon} className="h-[18px] w-[18px]" /></span><p className="mt-3 text-xs font-bold text-muted">{label}</p><p className="font-display text-2xl font-extrabold">{value}</p>{sub && <p className="text-xs text-muted">{sub}</p>}</div>;
}

export default async function Dashboard() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard");
  const db = await getDb();
  const [shops, docs, clients, [study], [waitlisted], reqs] = await Promise.all([
    db.select().from(schema.shops).where(eq(schema.shops.userId, user.id)).orderBy(desc(schema.shops.updatedAt)),
    db.select().from(schema.businessDocs).where(eq(schema.businessDocs.userId, user.id)).orderBy(desc(schema.businessDocs.updatedAt)).limit(8),
    db.select({ n: sql<number>`count(*)::int` }).from(schema.businessClients).where(eq(schema.businessClients.userId, user.id)),
    db.select().from(schema.studyState).where(eq(schema.studyState.userId, user.id)).limit(1),
    db.select({ id: schema.waitlist.id }).from(schema.waitlist).where(eq(schema.waitlist.email, user.email)).limit(1),
    db.select().from(schema.toolRequests).where(eq(schema.toolRequests.userId, user.id)).orderBy(desc(schema.toolRequests.createdAt)).limit(5),
  ]);
  const [docCount] = await db.select({ n: sql<number>`count(*)::int` }).from(schema.businessDocs).where(eq(schema.businessDocs.userId, user.id));
  const sd = (study?.data ?? {}) as { notes?: unknown[]; cards?: unknown[]; streak?: { days?: string[]; sessions?: number } };
  const views = shops.reduce((s, x) => s + x.views, 0);
  const wa = shops.reduce((s, x) => s + x.waClicks, 0);

  return (
    <div className="container-x py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div><p className="text-sm font-bold text-brand-link">Dashboard</p><h1 className="text-3xl font-extrabold">Hi{user.name ? `, ${user.name}` : ""} 👋</h1><p className="text-muted">{user.email}</p></div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        <StatCard icon="store" label="Shops" value={shops.length} />
        <StatCard icon="chart" label="Shop views" value={views} />
        <StatCard icon="chat" label="WhatsApp clicks" value={wa} />
        <StatCard icon="file" label="Saved documents" value={docCount?.n ?? 0} sub={`${clients[0]?.n ?? 0} clients`} />
        <StatCard icon="book" label="Study sync" value={`${sd.notes?.length ?? 0} notes`} sub={`${sd.cards?.length ?? 0} flashcards`} />
        <StatCard icon="timer" label="Focus streak" value={`${streakCount(sd.streak?.days ?? [])} days`} sub={`${sd.streak?.sessions ?? 0} sessions`} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-5" aria-labelledby="shops-h">
          <div className="mb-3 flex items-center justify-between"><h2 id="shops-h" className="text-xl font-extrabold">Your shops</h2><Link href="/shop" className="btn btn-primary btn-sm"><Icon name="plus" className="h-4 w-4" />New shop</Link></div>
          {shops.length === 0 ? <p className="text-sm text-muted">No shops yet. <Link href="/shop" className="font-semibold text-brand-link underline">Build your first catalogue</Link> and publish it for free.</p> : (
            <ul className="grid gap-2">{shops.map((s) => (
              <li key={s.id} className="rounded-xl border border-line p-3">
                <div className="flex flex-wrap items-center gap-2"><Link href={`/s/${s.slug}`} className="font-display font-bold text-brand-link hover:underline">{s.name}</Link><span className="text-xs text-muted">/s/{s.slug}</span><span className="ml-auto flex items-center gap-1"><Link href={`/shop?edit=${s.id}`} className="btn btn-secondary btn-sm">Edit</Link><DeleteButton url={`/api/shops?id=${s.id}`} label={`Delete shop ${s.name}`} /></span></div>
                <p className="mt-1 text-sm text-muted">{s.products.length} products · {s.views} views · {s.waClicks} WhatsApp clicks · {s.published ? "Public" : "Hidden"}</p>
              </li>))}</ul>
          )}
        </section>

        <section className="card p-5" aria-labelledby="docs-h">
          <div className="mb-3 flex items-center justify-between"><h2 id="docs-h" className="text-xl font-extrabold">Recent documents</h2><Link href="/business" className="btn btn-secondary btn-sm">Business</Link></div>
          {docs.length === 0 ? <p className="text-sm text-muted">Nothing saved yet. Create an <Link href="/business/invoice-generator" className="font-semibold text-brand-link underline">invoice</Link> and press “Save to cloud”.</p> : (
            <ul className="grid gap-2">{docs.map((d) => (
              <li key={d.id} className="flex items-center gap-2 rounded-xl border border-line p-3 text-sm"><span className="rounded bg-brand-soft px-2 py-0.5 text-xs font-bold capitalize text-brand-ink">{d.type}</span><span className="min-w-0 flex-1 truncate"><b>{d.number}</b> <span className="text-muted">{d.clientName}</span></span><b>{money(Number(d.total), d.currency)}</b><DeleteButton url={`/api/business/docs?id=${d.id}`} label={`Delete ${d.number}`} /></li>))}</ul>
          )}
        </section>

        <section className="card p-5" aria-labelledby="more-h">
          <h2 id="more-h" className="mb-3 text-xl font-extrabold">Account</h2>
          <ul className="grid gap-2 text-sm">
            <li className="flex items-center justify-between rounded-xl border border-line p-3"><span>Velyto Pro waitlist</span>{waitlisted ? <span className="font-bold text-good">You&apos;re on the list ✓</span> : <Link href="/pricing#waitlist" className="font-semibold text-brand-link underline">Join the waitlist</Link>}</li>
            <li className="flex items-center justify-between rounded-xl border border-line p-3"><span>Study workspace</span><Link href="/study" className="font-semibold text-brand-link underline">Open</Link></li>
            <li className="flex items-center justify-between rounded-xl border border-line p-3"><span>Tool requests</span><Link href="/requests" className="font-semibold text-brand-link underline">Vote or request</Link></li>
          </ul>
        </section>

        <section className="card p-5" aria-labelledby="req-h">
          <h2 id="req-h" className="mb-3 text-xl font-extrabold">Your tool requests</h2>
          {reqs.length === 0 ? <p className="text-sm text-muted">You haven&apos;t requested a tool yet. <Link href="/requests" className="font-semibold text-brand-link underline">Suggest one</Link>.</p> : <ul className="grid gap-2 text-sm">{reqs.map((r) => <li key={r.id} className="flex items-center gap-2 rounded-xl border border-line p-3"><span className="min-w-0 flex-1 truncate font-semibold">{r.title}</span><span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-bold text-brand-ink">▲ {r.votes}</span><span className="text-xs capitalize text-muted">{r.status}</span></li>)}</ul>}
        </section>
      </div>
    </div>
  );
}
