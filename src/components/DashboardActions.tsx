"use client";
import { useState } from "react";
import { api, resetUser } from "@/lib/client";
import { Icon } from "./Icon";

export function LogoutButton() {
  const [busy, setBusy] = useState(false);
  return (
    <button className="btn btn-secondary btn-sm" disabled={busy} onClick={async () => { setBusy(true); await api("/api/auth/logout", "POST"); resetUser(); window.location.assign("/"); }}>
      Log out
    </button>
  );
}

export function DeleteButton({ url, label }: { url: string; label: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button className="btn btn-ghost btn-sm text-bad" disabled={busy} aria-label={label} onClick={async () => { if (!confirm(`${label}? This cannot be undone.`)) return; setBusy(true); await api(url, "DELETE"); window.location.reload(); }}>
      <Icon name="trash" className="h-4 w-4" />
    </button>
  );
}
