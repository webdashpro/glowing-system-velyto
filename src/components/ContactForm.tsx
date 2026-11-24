"use client";
import { useState } from "react";
import { api } from "@/lib/client";
import { Field, Notice } from "./tools/ui";

export default function ContactForm() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await api<{ error?: string }>("/api/contact", "POST", f);
    if (r.ok) { setState({ kind: "ok", text: "Message received — thank you! We read every one." }); setF({ name: "", email: "", message: "" }); }
    else setState({ kind: "error", text: r.data.error ?? "Could not send your message." });
    setBusy(false);
  }
  return (
    <form onSubmit={submit} className="card grid gap-3 p-6" noValidate>
      <div className="grid gap-3 sm:grid-cols-2"><Field label="Name"><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} maxLength={80} /></Field><Field label="Email"><input className="input" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field></div>
      <Field label="Message"><textarea className="input" rows={6} required minLength={10} maxLength={3000} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></Field>
      <button className="btn btn-primary w-fit" disabled={busy || !f.email || f.message.length < 10}>{busy ? "Sending…" : "Send message"}</button>
      {state && <Notice kind={state.kind}>{state.text}</Notice>}
    </form>
  );
}
