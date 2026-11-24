"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon, type IconName } from "./Icon";
import { TOOLS } from "@/data/tools";

type Item = { href: string; label: string; hint: string; icon: IconName; hay: string };

const PAGES: Item[] = [
  { href: "/shop", label: "Velyto Shop", hint: "WhatsApp catalogue", icon: "store", hay: "shop catalogue whatsapp store dukaan" },
  { href: "/study", label: "Velyto Study", hint: "Notes, flashcards, quiz", icon: "book", hay: "study notes flashcards quiz pomodoro" },
  { href: "/study/planner", label: "Study Planner", hint: "Weekly timetable", icon: "calendar", hay: "planner timetable schedule" },
  { href: "/study/resume-builder", label: "Resume Builder", hint: "Free CV PDF", icon: "file", hay: "resume cv builder" },
  { href: "/business", label: "Velyto Business", hint: "Invoices & receipts", icon: "briefcase", hay: "business invoice bill quotation receipt expense" },
  { href: "/media", label: "Velyto Media", hint: "Video, image, audio", icon: "film", hay: "media video audio" },
  { href: "/guides", label: "Guides", hint: "How-to articles", icon: "book", hay: "guides articles help" },
  { href: "/pricing", label: "Pricing", hint: "100% free", icon: "free", hay: "pricing free waitlist pro" },
  { href: "/dashboard", label: "Dashboard", hint: "Your account", icon: "user", hay: "dashboard account login" },
];

export default function Palette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<Element | null>(null);

  const items: Item[] = useMemo(
    () => [
      ...TOOLS.map((t) => ({ href: `/tools/${t.slug}`, label: t.name, hint: t.short, icon: t.icon, hay: `${t.name} ${t.keywords}`.toLowerCase() })),
      ...PAGES,
    ],
    [],
  );
  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return items.slice(0, 9);
    return items.filter((i) => terms.every((t) => i.hay.toLowerCase().includes(t))).slice(0, 10);
  }, [q, items]);

  useEffect(() => {
    opener.current = document.activeElement;
    input.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, []);

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const r = results[idx];
      if (r) go(r.href);
    } else if (e.key === "Tab") {
      // focus trap
      const f = box.current?.querySelectorAll<HTMLElement>("button, input, a[href]");
      if (!f || !f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={box} role="dialog" aria-modal="true" aria-label="Command palette" onKeyDown={onKeyDown} className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-pop">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Icon name="search" className="h-5 w-5 text-muted" />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(0);
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[idx] ? `pal-${idx}` : undefined}
            placeholder="Search tools and pages…"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
            aria-label="Search tools and pages"
          />
          <button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close search">
            <kbd className="text-xs font-bold">Esc</kbd>
          </button>
        </div>
        <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No match. Try “pdf”, “gst” or “json”.</li>}
          {results.map((r, i) => (
            <li key={r.href} id={`pal-${i}`} role="option" aria-selected={i === idx}>
              <button onClick={() => go(r.href)} onMouseMove={() => setIdx(i)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${i === idx ? "bg-brand-soft" : ""}`}>
                <span className="icon-tile !h-9 !w-9"><Icon name={r.icon} className="h-[18px] w-[18px]" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{r.label}</span>
                  <span className="block truncate text-xs text-muted">{r.hint}</span>
                </span>
                {i === idx && <Icon name="arrow" className="h-4 w-4 text-brand-link" />}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-4 border-t border-line px-4 py-2 text-xs text-muted">
          <span>↑↓ navigate</span><span>↵ open</span><span>Esc close</span>
        </div>
      </div>
    </div>
  );
}
