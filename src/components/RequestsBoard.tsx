"use client";
import Link from "next/link";
import { useState } from "react";
import { api, useUser } from "@/lib/client";
import { Field, Notice } from "./tools/ui";

export type Req = { id: string; title: string; details: string; author: string; votes: number; voted: boolean; status: string };

export default function RequestsBoard({ initial, configured }: { initial: Req[]; configured: boolean }) {
  const user = useUser();
  const [list, setList] = useState<Req[]>(initial);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function vote(id: string) {
    const r = await api<{ voted?: boolean; votes?: number; error?: string }>("/api/requests/vote", "POST", { id });
    if (r.ok) setList((l) => l.map((x) => (x.id === id ? { ...x, votes: r.data.votes ?? x.votes, voted: !!r.data.voted } : x)).sort((a, b) => b.votes - a.votes));
    else setMsg({ kind: "error", text: r.status === 401 ? "Please log in to vote." : r.data.error ?? "Could not vote." });
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await api<{ request?: { id: string; title: string; details: string; author: string; votes: number; status: string }; error?: string }>("/api/requests", "POST", { title, details });
    if (r.ok && r.data.request) {
      setList((l) => [{ ...r.data.request!, voted: true }, ...l]);
      setTitle("");
      setDetails("");
      setMsg({ kind: "ok", text: "Thanks! Your request is on the board." });
    } else setMsg({ kind: "error", text: r.status === 401 ? "Please log in to submit a request." : r.data.error ?? "Could not submit." });
    setBusy(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <ul className="grid content-start gap-3">
        {list.length === 0 && <li className="card p-8 text-center text-muted">{configured ? "No requests yet — be the first to suggest a tool." : "The request board needs a database connection (DATABASE_URL)."}</li>}
        {list.map((r) => (
          <li key={r.id} className="card flex gap-4 p-4">
            <button onClick={() => vote(r.id)} aria-pressed={r.voted} aria-label={`${r.voted ? "Remove vote from" : "Vote for"} ${r.title}`} className={`flex h-16 w-14 flex-none flex-col items-center justify-center rounded-xl border text-sm font-extrabold transition-colors ${r.voted ? "border-brand bg-brand text-white" : "border-line hover:border-brand hover:bg-brand-soft"}`}><span aria-hidden="true">▲</span>{r.votes}</button>
            <div className="min-w-0"><h3 className="font-display text-lg font-bold leading-snug">{r.title}</h3>{r.details && <p className="mt-1 text-sm text-muted">{r.details}</p>}<p className="mt-2 text-xs text-muted">by {r.author || "a Velyto user"} · <span className="capitalize">{r.status}</span></p></div>
          </li>
        ))}
      </ul>
      <aside className="card h-fit p-5 lg:sticky lg:top-24">
        <h2 className="text-xl font-extrabold">Request a tool</h2>
        <p className="mb-3 mt-1 text-sm text-muted">Tell us what to build next. The most-voted ideas ship first.</p>
        {user ? (
          <form onSubmit={submit} className="grid gap-3">
            <Field label="Tool name / idea"><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} required placeholder="e.g. PDF compressor" /></Field>
            <Field label="Details (optional)"><textarea className="input" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} maxLength={600} /></Field>
            <button className="btn btn-primary" disabled={busy || title.trim().length < 4}>{busy ? "Submitting…" : "Submit request"}</button>
          </form>
        ) : <p className="rounded-xl bg-brand-soft p-3 text-sm text-brand-ink"><Link className="font-bold underline" href="/login?next=/requests">Log in</Link> or <Link className="font-bold underline" href="/signup?next=/requests">create a free account</Link> to submit requests and vote.</p>}
        {msg && <div className="mt-3"><Notice kind={msg.kind}>{msg.text}</Notice></div>}
      </aside>
    </div>
  );
}
