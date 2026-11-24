import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import { Icon, type IconName } from "@/components/Icon";
import { PageHeader, SectionTitle, breadcrumbLd } from "@/components/Common";
import JsonLd from "@/components/JsonLd";

export const metadata = buildMeta({
  title: "About Velyto — Our Story, Principles & Roadmap",
  description: "Why Velyto exists, the principles behind it (browser-first, private, free) and what we're building next.",
  path: "/about",
  absoluteTitle: true,
});

const PRINCIPLES: [IconName, string, string][] = [
  ["shield", "Private by default", "Files are processed on your device. We don't need your photos, PDFs or recordings, so we never ask for them."],
  ["free", "Free where it counts", "Everything you can use today is free. If paid features ever arrive, they will be optional extras."],
  ["zap", "Fast and light", "Heavy libraries load only when you press the button. We measure performance and treat regressions as bugs."],
  ["users", "Honest and accessible", "No fake testimonials or inflated numbers. Keyboard-friendly, dark-mode ready, and available in Hindi for key tools."],
];

const ROADMAP: [string, string[]][] = [
  ["Now", ["Five products under one free account", "Programmatic exam photo presets (10 exams)", "Hindi pilot for the top five tools"]],
  ["Next", ["More Hindi tool pages and more exam presets", "PDF compressor and PDF-to-image", "Shop analytics by day and shareable QR templates"]],
  ["Later", ["Optional Pro plan: custom shop domains and team workspaces", "More languages", "Voting-driven tools from the public request board"]],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" icon="heart" title="Useful software shouldn't need an upload button." sub="Velyto is a small, independent platform of free tools, built to work in your browser and respect your files." />
      <div className="container-x py-12">
        <div className="prose-v mx-auto max-w-3xl">
          <h2>The founder story</h2>
          <p>Velyto began as a one-person side project, born from a very ordinary frustration: helping friends and family fill in online forms. Every form wanted a photo of an exact pixel size and a signature under 20 KB, and every free website that promised to fix it wanted the files uploaded to a server, plastered a watermark on the result, or hid the download behind a sign-up.</p>
          <p>The browser is already powerful enough to resize, compress and convert images, assemble PDFs, record audio and render video — so the first version of Velyto simply did that, locally, in a few simple tools. People kept asking for the next thing: a GST calculator, a way to share a price list on WhatsApp, a place to keep flashcards, an easy invoice. Those became Shop, Study and Business.</p>
          <p>Velyto 3.0 brings it together: five products, one optional free account, a faster and more accessible design, and a growing library of guides. It is still small and still independent — and that is deliberate.</p>
        </div>

        <section className="mt-14" aria-labelledby="principles"><SectionTitle eyebrow="Principles" title="What we won't compromise on" /><div id="principles" className="grid gap-4 sm:grid-cols-2">{PRINCIPLES.map(([i, t, d]) => <div key={t} className="card flex gap-4 p-5"><span className="icon-tile"><Icon name={i} /></span><div><h3 className="font-display text-lg font-extrabold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></div></div>)}</div></section>

        <section className="mt-14" aria-labelledby="roadmap"><SectionTitle eyebrow="Roadmap" title="Where we're headed" sub="Plans change based on what people vote for on the request board." /><div id="roadmap" className="grid gap-4 md:grid-cols-3">{ROADMAP.map(([h, items]) => <div key={h} className="card p-5"><h3 className="font-display text-xl font-extrabold text-brand-link">{h}</h3><ul className="mt-3 grid gap-2 text-sm">{items.map((x) => <li key={x} className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 flex-none text-brand-link" />{x}</li>)}</ul></div>)}</div></section>

        <div className="mt-12 flex flex-wrap gap-3"><Link href="/changelog" className="btn btn-secondary">Read the changelog</Link><Link href="/requests" className="btn btn-primary">Request a tool</Link><Link href="/contact" className="btn btn-secondary">Contact us</Link></div>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [{ "@type": "AboutPage", name: "About Velyto", url: abs("/about") }, breadcrumbLd([{ name: "Home", href: "/" }, { name: "About", href: "/about" }])] }} />
    </>
  );
}
