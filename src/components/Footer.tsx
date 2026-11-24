import Link from "next/link";
import { Logo } from "./Header";

const COLS: { title: string; links: [string, string][] }[] = [
  { title: "Products", links: [["Tools", "/tools"], ["Media", "/media"], ["Shop", "/shop"], ["Shop Directory", "/shops"], ["Study", "/study"], ["Business", "/business"], ["Pricing", "/pricing"]] },
  { title: "Popular tools", links: [["Exam Photo Resizer", "/tools/exam-photo-resizer"], ["Image Compressor", "/tools/image-compressor"], ["Image to PDF", "/tools/image-to-pdf"], ["GST Calculator", "/tools/gst-calculator"], ["JSON Formatter", "/tools/json-formatter"]] },
  { title: "Resources", links: [["Guides", "/guides"], ["Changelog", "/changelog"], ["Request a tool", "/requests"], ["About", "/about"], ["Contact", "/contact"]] },
  { title: "Legal & language", links: [["Privacy", "/privacy"], ["Terms", "/terms"], ["हिंदी (Hindi)", "/hi"], ["Sitemap", "/sitemap.xml"]] },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-soft">
      <div className="container-x grid gap-10 py-12 md:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold"><Logo />Velyto</Link>
          <p className="mt-3 max-w-xs text-sm text-muted">Free tools, shops, study kits and business documents for the whole world. 100% browser-first, zero uploads, free forever.</p>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="font-display text-sm font-bold">{c.title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {c.links.map(([l, h]) => (
                <li key={h}><Link href={h} className="hover:text-brand-link hover:underline" {...(h === "/hi" ? { hrefLang: "hi", lang: "hi" } : {})}>{l}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-muted">
          <p>© {new Date().getFullYear()} Velyto. Built for students, creators, freelancers and shops.</p>
          <p>No ads · No trackers by default · Files stay on your device</p>
        </div>
      </div>
    </footer>
  );
}
