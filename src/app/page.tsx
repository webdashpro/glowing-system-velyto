import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import { CATEGORIES, POPULAR, TOOLS } from "@/data/tools";
import { EXAMS } from "@/data/exams";
import { GUIDES } from "@/data/guides";
import { Icon, type IconName } from "@/components/Icon";
import { HeroCollage, PillarMock, type PillarKind } from "@/components/Mockups";
import { PaletteButton } from "@/components/Header";
import { PrivacyStrip, SectionTitle } from "@/components/Common";
import ToolCard from "@/components/ToolCard";
import PersonalSections from "@/components/PersonalSections";

export const metadata = buildMeta({
  title: "Velyto — Free Tools, Shop, Study & Business | 100% Browser-First",
  description: "34 free browser-first tools plus Shop, Study, Business and Media. Resize exam photos, compress images, make PDFs, calculate GST. Zero uploads, free forever.",
  path: "/",
  absoluteTitle: true,
  languages: { en: abs("/"), hi: abs("/hi"), "x-default": abs("/") },
});

const PILLARS: { kind: PillarKind; name: string; href: string; icon: IconName; blurb: string; points: string[]; cta: string }[] = [
  { kind: "tools", name: "Velyto Tools", href: "/tools", icon: "layers", blurb: "34 everyday tools for images, PDFs, money, code and text.", points: ["Exam photo & signature resizer with 10 presets", "Image ↔ PDF, merge and split", "GST, EMI, CGPA, QR, JSON and more"], cta: "Browse all tools" },
  { kind: "media", name: "Velyto Media", href: "/media", icon: "film", blurb: "Real video, image and audio tools powered by your browser.", points: ["Video → image frame extractor", "Images → real .webm video maker", "Batch converter & voice recorder"], cta: "Open Media" },
  { kind: "shop", name: "Velyto Shop", href: "/shop", icon: "store", blurb: "A mobile catalogue with one-tap WhatsApp ordering and a QR poster.", points: ["Six currencies, live public link", "View & WhatsApp-click counters", "Printable QR poster + shop directory"], cta: "Build a shop" },
  { kind: "study", name: "Velyto Study", href: "/study", icon: "book", blurb: "Notes, flashcards, quizzes, focus timer, planner and CV builder.", points: ["Flip flashcards & timed MCQ quizzes", "Pomodoro timer with streaks", "Weekly planner & free resume PDF"], cta: "Start studying" },
  { kind: "business", name: "Velyto Business", href: "/business", icon: "briefcase", blurb: "Invoices, bills, quotes, receipts and expenses with instant PDFs.", points: ["USD, EUR, GBP, INR, AED, CAD", "Cloud-save clients & documents", "GST & invoice compliance checklist"], cta: "Create a document" },
];

const AUDIENCES: [IconName, string, string][] = [
  ["graduation", "Students", "Resize exam photos, convert CGPA, plan your week and revise with flashcards — all free."],
  ["camera", "Creators", "Turn images into videos, grab frames, convert formats and record clean voice notes."],
  ["briefcase", "Freelancers", "Send professional invoices and receipts in your client's currency in under a minute."],
  ["store", "Global shops", "Publish a WhatsApp-ready catalogue with a QR poster — no website or app needed."],
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero-bg relative overflow-hidden border-b border-line">
        <div className="grid-dots pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" aria-hidden="true" />
        <div className="container-x relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div>
            <PrivacyStrip />
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-[3.6rem]">
              Free tools, shops &amp; study kits — <span className="text-gradient">all in your browser.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Resize exam photos, compress images to 50 KB, make PDFs, send invoices and publish a WhatsApp shop. <strong className="text-fg">Nothing is uploaded. Nothing costs money.</strong> No sign-up needed.
            </p>
            <div className="mt-7 max-w-xl"><PaletteButton /></div>
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Quick categories">
              {CATEGORIES.map((c) => <Link key={c.id} href={`/tools#${c.id}`} className="chip">{c.label}</Link>)}
              <Link href="/shop" className="chip">Shop</Link>
              <Link href="/study" className="chip">Study</Link>
              <Link href="/business" className="chip">Business</Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/tools/exam-photo-resizer" className="btn btn-primary">Resize exam photo<Icon name="arrow" className="h-4 w-4" /></Link>
              <Link href="/tools" className="btn btn-secondary">Explore 34 tools</Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[34rem] lg:max-w-none">
            <HeroCollage className="h-auto w-full" />
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section aria-label="Velyto at a glance" className="border-b border-line bg-soft">
        <dl className="container-x grid grid-cols-2 gap-y-5 py-6 text-center sm:grid-cols-5">
          {[[String(TOOLS.length), "free tools"], ["5", "products, one account"], [String(EXAMS.length), "exam photo presets"], ["6", "currencies"], ["0 B", "uploaded to servers"]].map(([n, l]) => (
            <div key={l}><dt className="sr-only">{l}</dt><dd className="font-display text-3xl font-extrabold text-brand-link">{n}<span className="mt-0.5 block text-sm font-semibold text-muted">{l}</span></dd></div>
          ))}
        </dl>
      </section>

      <PersonalSections />

      {/* POPULAR */}
      <section className="container-x pt-16" aria-labelledby="popular">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div><p className="mb-2 text-sm font-bold uppercase tracking-wider text-brand-link">Most used</p><h2 id="popular" className="text-3xl font-extrabold sm:text-4xl">Popular tools</h2></div>
          <Link href="/tools" className="btn btn-ghost btn-sm">All 34 tools<Icon name="arrow" className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{POPULAR.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
      </section>

      {/* PILLARS */}
      <section className="container-x pt-20" aria-labelledby="products">
        <SectionTitle eyebrow="Five products · one platform" title="Everything you need, nothing you don't" sub="Use every product as a guest. Create one free account only when you want cloud sync, a public shop or saved documents." />
        <div id="products" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <article key={p.kind} className="card card-hover flex flex-col overflow-hidden p-4">
              <PillarMock kind={p.kind} />
              <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
                <h3 className="flex items-center gap-2 text-xl font-extrabold"><span className="icon-tile !h-9 !w-9"><Icon name={p.icon} className="h-[18px] w-[18px]" /></span>{p.name}</h3>
                <p className="mt-2 text-muted">{p.blurb}</p>
                <ul className="mt-3 grid gap-1.5 text-sm">{p.points.map((x) => <li key={x} className="flex gap-2"><Icon name="checkcircle" className="mt-0.5 h-4 w-4 flex-none text-brand-link" />{x}</li>)}</ul>
                <Link href={p.href} className="btn btn-secondary btn-sm mt-5 w-fit">{p.cta}<Icon name="arrow" className="h-4 w-4" /></Link>
              </div>
            </article>
          ))}
          <article className="card flex flex-col justify-center bg-gradient-to-br from-brand to-blue-800 p-6 text-white">
            <Icon name="zap" className="h-8 w-8" />
            <h3 className="mt-3 text-2xl font-extrabold !text-white">100% free right now</h3>
            <p className="mt-2 text-blue-100">All five products are free today. Join the Pro waitlist for future custom domains and team features.</p>
            <Link href="/pricing" className="btn mt-5 w-fit bg-white text-blue-800 hover:bg-blue-50">See pricing</Link>
          </article>
        </div>
      </section>

      {/* BUILT FOR */}
      <section className="container-x pt-20" aria-labelledby="builtfor">
        <SectionTitle eyebrow="Who it's for" title="Built for Students, Creators, Freelancers & Global Shops" sub="Velyto started as one student's side project. It grows only when it is genuinely useful — so there are no inflated numbers and no invented testimonials here." />
        <div id="builtfor" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map(([i, t, d]) => (
            <div key={t} className="card p-5"><span className="icon-tile"><Icon name={i} /></span><h3 className="mt-4 text-lg font-extrabold">{t}</h3><p className="mt-1.5 text-sm text-muted">{d}</p></div>
          ))}
        </div>
      </section>

      {/* PRIVACY */}
      <section className="container-x pt-20" aria-labelledby="privacy-h">
        <div className="card grid items-center gap-8 overflow-hidden p-6 sm:p-10 lg:grid-cols-[1fr_auto]">
          <div>
            <h2 id="privacy-h" className="text-3xl font-extrabold">Your files never leave your device</h2>
            <p className="mt-3 max-w-2xl text-muted">Image, PDF, video and audio tools run on your own CPU using standard browser APIs. There is no upload queue, no server copy and no third-party scripts by default. Sign in only if you want to publish a shop or sync notes and invoices — and then only that data is stored.</p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
              {["No ads", "No tracking by default", "Works offline (PWA)", "Dark mode", "हिंदी support"].map((x) => <span key={x} className="chip cursor-default"><Icon name="check" className="h-4 w-4 text-brand-link" />{x}</span>)}
            </div>
          </div>
          <div className="mx-auto grid h-36 w-36 place-items-center rounded-3xl bg-gradient-to-br from-blue-500 to-blue-800 text-white shadow-pop"><Icon name="shield" className="h-16 w-16" strokeWidth={1.5} /></div>
        </div>
      </section>

      {/* GUIDES */}
      <section className="container-x pt-20" aria-labelledby="guides-h">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div><p className="mb-2 text-sm font-bold uppercase tracking-wider text-brand-link">Learn</p><h2 id="guides-h" className="text-3xl font-extrabold sm:text-4xl">Practical guides</h2></div>
          <Link href="/guides" className="btn btn-ghost btn-sm">All guides<Icon name="arrow" className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {GUIDES.slice(0, 3).map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="card card-hover block p-5"><p className="text-xs font-bold text-brand-link">{g.readMins} min read</p><h3 className="mt-2 text-lg font-extrabold leading-snug">{g.title}</h3><p className="mt-2 text-sm text-muted">{g.description}</p></Link>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-x pt-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-900 p-8 text-center text-white sm:p-14">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold !text-white sm:text-4xl">Start free in 10 seconds. No account required.</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">Use any tool right now, or create one free account to publish a shop and sync your work across devices.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/tools" className="btn bg-white text-blue-800 hover:bg-blue-50">Open the tools</Link>
            <Link href="/signup" className="btn border-white/40 bg-white/10 text-white hover:bg-white/20">Create free account</Link>
          </div>
        </div>
      </section>
    </>
  );
}
