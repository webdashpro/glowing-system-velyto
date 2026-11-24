"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TOOLS } from "@/data/tools";
import { Icon } from "./Icon";

export default function NotFoundSearch() {
  const [q, setQ] = useState("");
  const res = useMemo(() => {
    const t = q.toLowerCase().split(/\s+/).filter(Boolean);
    return t.length ? TOOLS.filter((x) => t.every((w) => `${x.name} ${x.keywords}`.toLowerCase().includes(w))).slice(0, 6) : [];
  }, [q]);
  return (
    <div className="mx-auto w-full max-w-md text-left">
      <div className="relative"><Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" /><input type="search" className="input !py-3 !pl-11" placeholder="Search tools…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search tools" /></div>
      {res.length > 0 && <ul className="card mt-2 divide-y divide-line">{res.map((t) => <li key={t.slug}><Link href={`/tools/${t.slug}`} className="flex items-center gap-3 p-3 hover:bg-brand-soft"><Icon name={t.icon} className="h-5 w-5 text-brand-link" /><span className="font-semibold">{t.name}</span></Link></li>)}</ul>}
      {q && res.length === 0 && <p className="mt-2 text-sm text-muted">No tools match “{q}”.</p>}
    </div>
  );
}
