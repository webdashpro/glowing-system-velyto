"use client";
import { useEffect, useState } from "react";
import { api, useUser } from "@/lib/client";
import { Notice } from "./tools/ui";

export default function WaitlistForm() {
  const user = useUser();
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("Custom domain for my shop");
  const [state, setState] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (user?.email) setEmail((e) => e || user.email); }, [user]);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await api<{ already?: boolean; error?: string }>("/api/waitlist", "POST", { email, interest });
    setState(r.ok ? { kind: "ok", text: r.data.already ? "You're already on the Velyto Pro waitlist — thank you!" : "You're on the list! We'll email you once when Pro launches." } : { kind: "error", text: r.data.error ?? "Something went wrong." });
    setBusy(false);
  }
  return (
    <form onSubmit={submit} className="grid gap-3" noValidate>
      <label className="block"><span className="label">Email</span><input className="input" type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label className="block"><span className="label">I&apos;m most interested in</span><select className="input" value={interest} onChange={(e) => setInterest(e.target.value)}>{["Custom domain for my shop", "Team workspace for Business", "Branded invoices & templates", "Higher cloud limits", "Something else"].map((x) => <option key={x}>{x}</option>)}</select></label>
      <button className="btn btn-primary" disabled={busy || !email}>{busy ? "Joining…" : "Join the Pro waitlist"}</button>
      {state && <Notice kind={state.kind}>{state.text}</Notice>}
      <p className="text-xs text-muted">One email when Pro launches. No spam, unsubscribe any time. Everything you use today stays free.</p>
    </form>
  );
}
