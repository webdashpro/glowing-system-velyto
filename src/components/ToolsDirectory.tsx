"use client";
import { useMemo, useState } from "react";
import { CATEGORIES, TOOLS, type CategoryId } from "@/data/tools";
import ToolCard from "./ToolCard";
import { Icon } from "./Icon";

export default function ToolsDirectory() {
  const [cat, setCat] = useState<"all" | CategoryId>("all");
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    return TOOLS.filter((t) => (cat === "all" || t.category === cat) && terms.every((x) => `${t.name} ${t.keywords} ${t.short}`.toLowerCase().includes(x)));
  }, [cat, q]);
  return (
    <div>
      <div className="mb-6 grid gap-4">
        <div className="relative max-w-xl">
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tools… e.g. PDF, GST, JSON" className="input !pl-11 !py-3" aria-label="Search tools" />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button className="chip" aria-pressed={cat === "all"} onClick={() => setCat("all")}>All <span className="rounded-full bg-black/10 px-1.5 text-xs dark:bg-white/15">{TOOLS.length}</span></button>
          {CATEGORIES.map((c) => (
            <button key={c.id} className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
              {c.label} <span className="rounded-full bg-black/10 px-1.5 text-xs dark:bg-white/15">{TOOLS.filter((t) => t.category === c.id).length}</span>
            </button>
          ))}
        </div>
      </div>
      {CATEGORIES.map((c) => {
        const list = filtered.filter((t) => t.category === c.id);
        if (!list.length) return null;
        return (
          <section key={c.id} id={c.id} className="mb-10 scroll-mt-24" aria-labelledby={`h-${c.id}`}>
            <div className="mb-3 flex items-end justify-between gap-3">
              <div><h2 id={`h-${c.id}`} className="text-2xl font-extrabold">{c.label} <span className="text-base font-semibold text-muted">· {list.length}</span></h2><p className="text-sm text-muted">{c.blurb}</p></div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{list.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
          </section>
        );
      })}
      {filtered.length === 0 && <div className="card p-8 text-center text-muted">No tools match “{q}”. Try a different word or <a className="font-semibold text-brand-link underline" href="/requests">request a tool</a>.</div>}
    </div>
  );
}
