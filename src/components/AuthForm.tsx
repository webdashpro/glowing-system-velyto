"use client";
import Link from "next/link";
import { useState } from "react";
import { api, resetUser } from "@/lib/client";
import { Field, Notice } from "./tools/ui";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const signup = mode === "signup";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await api<{ error?: string }>(`/api/auth/${mode}`, "POST", { email, password, name });
    if (r.ok) {
      resetUser();
      const next = new URLSearchParams(window.location.search).get("next") || "/dashboard";
      window.location.assign(next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
      return;
    }
    setErr(r.data.error ?? "Something went wrong. Please try again.");
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="card mx-auto grid w-full max-w-md gap-4 p-6 sm:p-8" noValidate>
      <div>
        <h1 className="text-3xl font-extrabold">{signup ? "Create your free account" : "Welcome back"}</h1>
        <p className="mt-1 text-sm text-muted">{signup ? "One account for Shop, Business and Study cloud sync. Every tool still works without it." : "Log in to sync your shops, documents and study data."}</p>
      </div>
      {signup && <Field label="Name (optional)"><input className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} /></Field>}
      <Field label="Email"><input className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
      <Field label="Password" hint={signup ? "At least 8 characters. Stored as a salted scrypt hash." : undefined}><input className="input" type="password" autoComplete={signup ? "new-password" : "current-password"} required minLength={signup ? 8 : 1} value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
      {err && <Notice kind="error">{err}</Notice>}
      <button className="btn btn-primary w-full" disabled={busy || !email || !password}>{busy ? "Please wait…" : signup ? "Create account" : "Log in"}</button>
      <p className="text-center text-sm text-muted">{signup ? <>Already have an account? <Link className="font-semibold text-brand-link underline" href="/login">Log in</Link></> : <>New to Velyto? <Link className="font-semibold text-brand-link underline" href="/signup">Create a free account</Link></>}</p>
    </form>
  );
}
