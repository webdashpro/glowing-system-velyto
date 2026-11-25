"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { useUser } from "@/lib/client";

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

/** Square icon button used across the header — one consistent shape, one consistent hover. */
const iconBtn =
  "grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line bg-surface text-muted transition-colors hover:border-brand hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export default function Header() {
  const path = usePathname() || "/";
  const user = useUser();
  const [open, setOpen] = useState(false);
  const [pal, setPal] = useState(false);
  const isHi = path === "/hi" || path.startsWith("/hi/");

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
      <div className="container-x flex h-16 items-center gap-2">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center gap-2 font-display text-xl font-extrabold tracking-tight" aria-label="Velyto home">
          <Logo />
          <span>Velyto</span>
        </Link>

        {/* Primary navigation */}
        <nav className="ml-5 hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {NAV.map((n) => {
            const active = path === n.href || path.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-brand-soft hover:text-brand-ink ${
                  active ? "bg-brand-soft text-brand-ink" : "text-muted"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Search — desktop pill */}
          <button
            onClick={() => setPal(true)}
            className="hidden h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-muted shadow-sm transition-colors hover:border-brand hover:text-brand-ink sm:inline-flex"
            aria-label="Search tools (Ctrl K)"
          >
            <Icon name="search" className="h-4 w-4 shrink-0" />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden rounded border border-line bg-soft px-1.5 py-0.5 text-[11px] font-bold lg:inline">Ctrl K</kbd>
          </button>

          {/* Search — mobile icon only */}
          <button onClick={() => setPal(true)} className={`${iconBtn} sm:hidden`} aria-label="Search tools">
            <Icon name="search" className="h-5 w-5" />
          </button>

          {/* Hindi pages only: a single quiet way back to English (never shown on English pages) */}
          {isHi && (
            <Link
              href="/"
              className="hidden h-9 items-center rounded-lg border border-line bg-surface px-3 text-xs font-bold text-muted transition-colors hover:border-brand hover:text-brand-ink md:inline-flex"
              hrefLang="en"
            >
              English
            </Link>
          )}

          {/* Theme toggle — inline SVG so it can never render as an empty blob */}
          <button onClick={toggleTheme} className={iconBtn} aria-label="Toggle dark mode" title="Toggle dark mode">
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] dark:hidden" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
            </svg>
            <svg viewBox="0 0 24 24" className="hidden h-[18px] w-[18px] dark:block" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          </button>

          {/* Account — fixed-width wrapper so the header never jumps while auth loads */}
          <div className="hidden min-w-[9.5rem] items-center justify-end gap-2 border-l border-line pl-3 md:flex">
            {user === undefined ? null : user ? (
              <Link href="/dashboard" className="btn btn-primary btn-sm">
                <Icon name="user" className="h-4 w-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-2.5 py-2 text-sm font-semibold text-muted transition-colors hover:text-brand-ink">
                  Log in
                </Link>
                <Link href="/signup" className="btn btn-primary btn-sm">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu */}
          <button
            className={`${iconBtn} text-fg lg:hidden`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Menu"
          >
            <Icon name={open ? "x" : "menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-line bg-bg lg:hidden" aria-label="Mobile">
          <div className="container-x grid gap-1 py-3">
            {NAV.map((n) => {
              const active = path === n.href || path.startsWith(n.href + "/");
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2.5 font-semibold ${active ? "bg-brand-soft text-brand-ink" : "text-fg hover:bg-brand-soft"}`}
                >
                  {n.label}
                </Link>
              );
            })}
            <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-line pt-3">
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
      <button onClick={() => setPal(true)} className={`group flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 text-left shadow-soft transition-colors hover:border-brand ${className}`} aria-label="Search 34 free tools (Ctrl K)">
        <Icon name="search" className="h-5 w-5 text-brand-link" />
        <span className="flex-1 text-muted">Search 34 free tools — try “compress image”, “GST”, “JSON”…</span>
        <kbd className="hidden rounded-md border border-line bg-soft px-2 py-1 text-xs font-bold text-muted sm:inline">Ctrl K</kbd>
      </button>
      {pal && <Palette onClose={() => setPal(false)} />}
    </>
  );
}
