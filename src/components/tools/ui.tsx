"use client";
import { useState, type ReactNode } from "react";
import { Icon } from "../Icon";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card p-4 sm:p-5 ${className}`}>{children}</div>;
}

export function Field({ label, children, className = "", hint }: { label: string; children: ReactNode; className?: string; hint?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Num({ label, value, onChange, min, max, step = 1, suffix, className = "" }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; step?: number | "any"; suffix?: string; className?: string }) {
  return (
    <Field label={label} className={className}>
      <div className="relative">
        <input type="number" inputMode="decimal" className="input" value={Number.isFinite(value) ? value : ""} min={min} max={max} step={step} onChange={(e) => onChange(e.target.value === "" ? NaN : Number(e.target.value))} />
        {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted">{suffix}</span>}
      </div>
    </Field>
  );
}

export function Range({ label, value, onChange, min, max, step = 1, unit = "" }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; step?: number; unit?: string }) {
  return (
    <label className="block">
      <span className="label flex justify-between"><span>{label}</span><span className="text-fg">{value}{unit}</span></span>
      <input type="range" className="w-full accent-[var(--brand)]" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

export function Drop({ accept, multiple, onFiles, label, hint }: { accept: string; multiple?: boolean; onFiles: (f: File[]) => void; label: string; hint?: string }) {
  const [over, setOver] = useState(false);
  return (
    <label
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-[var(--brand)] ${over ? "border-brand bg-brand-soft" : "border-line bg-soft hover:border-brand"}`}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const fs = Array.from(e.dataTransfer.files);
        if (fs.length) onFiles(multiple ? fs : fs.slice(0, 1));
      }}
    >
      <span className="icon-tile"><Icon name="upload" /></span>
      <span className="font-semibold">{label}</span>
      <span className="text-xs text-muted">{hint ?? "or drag and drop — files never leave your device"}</span>
      <input
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const fs = Array.from(e.target.files ?? []);
          if (fs.length) onFiles(fs);
          e.target.value = "";
        }}
      />
    </label>
  );
}

export function Notice({ kind = "info", children }: { kind?: "info" | "ok" | "warn" | "error"; children: ReactNode }) {
  const cls = { info: "border-line bg-brand-soft text-brand-ink", ok: "border-emerald-500/40 bg-emerald-500/10 text-good", warn: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300", error: "border-red-500/40 bg-red-500/10 text-bad" }[kind];
  return <div role={kind === "error" ? "alert" : "status"} className={`rounded-xl border px-3 py-2 text-sm ${cls}`}>{children}</div>;
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-soft p-3">
      <div className="text-xs font-semibold text-muted">{label}</div>
      <div className="font-display text-xl font-extrabold">{value}</div>
      {sub && <div className="text-xs text-muted">{sub}</div>}
    </div>
  );
}

export function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-secondary btn-sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        } catch {
          /* ignore */
        }
      }}
    >
      <Icon name={done ? "checkcircle" : "copy"} className="h-4 w-4" />
      {done ? "Copied" : label}
    </button>
  );
}

export function Reorder<T extends { id: string }>({ items, setItems, render }: { items: T[]; setItems: (i: T[]) => void; render: (t: T, i: number) => ReactNode }) {
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const n = items.slice();
    [n[i], n[j]] = [n[j], n[i]];
    setItems(n);
  };
  return (
    <ul className="grid gap-2">
      {items.map((t, i) => (
        <li key={t.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-2.5">
          <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-brand-soft text-xs font-bold text-brand-ink">{i + 1}</span>
          <div className="min-w-0 flex-1">{render(t, i)}</div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><Icon name="up" className="h-4 w-4" /></button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down"><Icon name="down" className="h-4 w-4" /></button>
          <button type="button" className="btn btn-ghost btn-sm text-bad" onClick={() => setItems(items.filter((x) => x.id !== t.id))} aria-label="Remove"><Icon name="trash" className="h-4 w-4" /></button>
        </li>
      ))}
    </ul>
  );
}

let uid = 0;
export const newId = () => `${Date.now().toString(36)}-${(uid++).toString(36)}`;
