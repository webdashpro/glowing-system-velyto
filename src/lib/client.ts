"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/* ---------- localStorage state (hydration-safe) ---------- */
export function useLocalState<T>(key: string, init: T): [T, (v: T | ((p: T) => T)) => void, boolean] {
  const [val, setVal] = useState<T>(init);
  const [ready, setReady] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setVal(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      /* quota */
    }
  }, [key, val, ready]);
  return [val, setVal, ready];
}

/* ---------- favourites & recently used ---------- */
const LIST_EVENT = "velyto-lists";
function readList(key: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}
function writeList(key: string, list: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    window.dispatchEvent(new Event(LIST_EVENT));
  } catch {
    /* ignore */
  }
}
export function useStoredList(key: "velyto.favs" | "velyto.recent"): string[] {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setList(readList(key));
    sync();
    window.addEventListener(LIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(LIST_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [key]);
  return list;
}
export function toggleFav(slug: string) {
  const l = readList("velyto.favs");
  writeList("velyto.favs", l.includes(slug) ? l.filter((s) => s !== slug) : [slug, ...l].slice(0, 24));
}
export function recordUse(slug: string) {
  const l = readList("velyto.recent").filter((s) => s !== slug);
  writeList("velyto.recent", [slug, ...l].slice(0, 8));
}

/* ---------- auth state ---------- */
export type ClientUser = { id: string; email: string; name: string };
let userPromise: Promise<ClientUser | null> | null = null;
export function resetUser() {
  userPromise = null;
}
export function fetchUser(): Promise<ClientUser | null> {
  if (!userPromise) {
    userPromise = fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => (d.user as ClientUser | null) ?? null)
      .catch(() => null);
  }
  return userPromise;
}
/** undefined = still loading, null = guest */
export function useUser(): ClientUser | null | undefined {
  const [u, setU] = useState<ClientUser | null | undefined>(undefined);
  useEffect(() => {
    let live = true;
    fetchUser().then((x) => live && setU(x));
    return () => {
      live = false;
    };
  }, []);
  return u;
}

/* ---------- misc ---------- */
export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function useDebounced<T extends (...a: never[]) => void>(fn: T, ms: number): T {
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const f = useRef(fn);
  useEffect(() => {
    f.current = fn;
  });
  return useCallback(
    ((...a: never[]) => {
      if (t.current) clearTimeout(t.current);
      t.current = setTimeout(() => f.current(...a), ms);
    }) as T,
    [ms],
  );
}

export async function api<T = unknown>(url: string, method = "GET", body?: unknown): Promise<{ ok: boolean; status: number; data: T }> {
  try {
    const r = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const data = (await r.json().catch(() => ({}))) as T;
    return { ok: r.ok, status: r.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: "Network error" } as T };
  }
}
