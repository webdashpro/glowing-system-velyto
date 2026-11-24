"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { useUser } from "@/lib/client";
import { HI_SLUGS } from "@/data/hi-slugs";

const Palette = dynamic(() => import("./Palette"), { ssr: false });

export const NAV = [
  { href: "/tools", label: "Tools" },
  { href: "/media", label: "Media" },
  { href: "/shop", label: "Shop" },
  { href: "/study", label: "Study" },
  { href: "/business", label: "Business" },
  { href: "/guides", label: "Guides" },
  { href: "/pricing", label: "Pricing" },
];

export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="vg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#vg)" />
      <path d="M8.500 9.500 16 23l7.500-13.500" fill="none" stroke="#fff" strokeWidth="3.200" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function langLinks(path: string): { en: string; hi: string } {
  if (path === "/hi") return { en: "/", hi: "/hi" };
  if (path === "/") return { en: "/", hi: "/hi" };
  const hiTool = path.match(/^\/hi\/tools\/([^/]+)$/);
  if (hiTool) return { en: `/tools/${hiTool[1]}`, hi: path };
  const enTool = path.match(/^\/tools\/([^/]+)$/);
  if (enTool && HI_SLUGS.includes(enTool[1])) return { en: path, hi: `/hi/tools/${enTool[1]}` };
  return { en: path, hi: "/hi" };
}

export default function Header() {
  const path = usePathname() || "/";
  const user = useUser();
  const [open, setOpen] = useState(false);
  const [pal, setPal] = useState(false);
  const isHi = path === "/hi" || path.startsWith("/hi/");
  const lang = langLinks(path);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPal((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = () => {
    const dark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("velyto-theme", dark ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <div className="container-x flex h-16 items-center gap-3">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight" aria-label="Velyto home">
          <Logo />
          <span>Velyto</span>
        </Link>
        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => {
            const active = path === n.href || path.startsWith(n.href + "/");
            return (
              <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined} className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-brand-soft hover:text-brand-ink ${active ? "bg-brand-soft text-brand-ink" : "text-muted"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button onClick={() => setPal(true)} className="btn btn-secondary btn-sm hidden sm:inline-flex" aria-label="Search tools (Ctrl+K)">
            <Icon name="search" className="h-4 w-4" />
            <span className="text-muted">Search</span>
            <kbd className="rounded border border-line bg-soft px-1.5 py-0.5 text-[11px] font-semibold text-muted">Ctrl K</kbd>
          </button>
          <button onClick={() => setPal(true)} className="btn btn-ghost btn-sm sm:hidden" aria-label="Search tools">
            <Icon name="search" />
          </button>
          <div className="hidden items-center rounded-lg border border-line p-0.5 text-xs font-bold md:flex" role="group" aria-label="Language">
            <Link href={lang.en} hrefLang="en" aria-current={!isHi ? "true" : undefined} className={`rounded-md px-2 py-1 ${!isHi ? "bg-brand text-white" : "text-muted hover:text-fg"}`}>EN</Link>
            <Link href={lang.hi} hrefLang="hi" lang="hi" aria-current={isHi ? "true" : undefined} className={`rounded-md px-2 py-1 ${isHi ? "bg-brand text-white" : "text-muted hover:text-fg"}`}>हिंदी</Link>
          </div>
          <button onClick={toggleTheme} className="btn btn-ghost btn-sm" aria-label="Toggle dark mode">
            <Icon name="moon" className="h-5 w-5 dark:hidden" />
            <Icon name="sun" className="hidden h-5 w-5 dark:block" />
          </button>
          <div className="hidden min-w-[9.5rem] items-center justify-end gap-1 md:flex">
            {user === undefined ? null : user ? (
              <Link href="/dashboard" className="btn btn-primary btn-sm"><Icon name="user" className="h-4 w-4" />Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-ghost btn-sm">Log in</Link>
                <Link href="/signup" className="btn btn-primary btn-sm">Sign up</Link>
              </>
            )}
          </div>
          <button className="btn btn-ghost btn-sm lg:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label="Menu">
            <Icon name={open ? "x" : "menu"} />
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" className="border-t border-line bg-bg lg:hidden" aria-label="Mobile">
          <div className="container-x grid gap-1 py-3">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-3 py-2.5 font-semibold hover:bg-brand-soft">{n.label}</Link>
            ))}
            <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-line pt-3">
              <Link href={lang.en} className="chip" aria-current={!isHi ? "true" : undefined}>EN</Link>
              <Link href={lang.hi} className="chip" lang="hi" aria-current={isHi ? "true" : undefined}>हिंदी</Link>
              {user ? (
                <Link href="/dashboard" className="btn btn-primary btn-sm ml-auto">Dashboard</Link>
              ) : (
                <>
                  <Link href="/login" className="btn btn-secondary btn-sm ml-auto">Log in</Link>
                  <Link href="/signup" className="btn btn-primary btn-sm">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}
      {pal && <Palette onClose={() => setPal(false)} />}
    </header>
  );
}

/** Hero-friendly launcher that opens the same command palette. */
export function PaletteButton({ className = "" }: { className?: string }) {
  const [pal, setPal] = useState(false);
  return (
    <>
      <button onClick={() => setPal(true)} className={`group flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 text-left shadow-soft transition-colors hover:border-brand ${className}`} aria-label="Search 34 free tools (Ctrl+K)">
        <Icon name="search" className="h-5 w-5 text-brand-link" />
        <span className="flex-1 text-muted">Search 34 free tools — try “compress image”, “GST”, “JSON”…</span>
        <kbd className="hidden rounded-md border border-line bg-soft px-2 py-1 text-xs font-bold text-muted sm:inline">Ctrl K</kbd>
      </button>
      {pal && <Palette onClose={() => setPal(false)} />}
    </>
  );
}
