import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import { Icon, type IconName } from "@/components/Icon";
import { PillarMock } from "@/components/Mockups";
import { FaqList, PrivacyStrip, SectionTitle, breadcrumbLd, faqLd } from "@/components/Common";
import StudyApp from "@/components/StudyApp";
import JsonLd from "@/components/JsonLd";

export const metadata = buildMeta({
  title: "Velyto Study — Smart Notes, Flashcards, Quiz Builder, Pomodoro & Planner",
  description: "Free study workspace: turn notes into flashcards, build timed MCQ quizzes, focus with Pomodoro streaks, plan your week and build a resume. Syncs when signed in.",
  path: "/study",
  absoluteTitle: true,
});

const FEATURES: [IconName, string, string][] = [
  ["pen", "Smart notes", "Write “Term: definition” lines and turn them into flashcards in one click, with auto-extracted key points."],
  ["layers", "Flip flashcards", "Space to flip, arrows to move, mark what you know. Shuffle and review only the cards you miss."],
  ["checkcircle", "Timed MCQ quizzes", "Build your own quizzes with a countdown timer, review answers and share your score."],
  ["timer", "Focus timer & streaks", "25-minute Pomodoro sessions that build a daily streak you can see."],
  ["calendar", "Weekly planner", "A drag-free timetable with colours and a print view."],
  ["file", "Free resume builder", "Fill in the form, preview live and download a clean A4 PDF."],
];

const FAQS: [string, string][] = [
  ["Is Velyto Study free?", "Yes. Every study tool is free, with no ads and no limits."],
  ["Do I need an account?", "No. Everything works in guest mode and is saved on your device. Sign in only if you want notes, flashcards, quizzes, streaks, planner and resume to sync across devices."],
  ["Why use active recall and Pomodoro?", "Retrieval practice and spaced review are among the best-supported ways to learn, and short timed sessions make it easier to start. Our guide explains the approach in detail."],
];

export default function StudyPage() {
  return (
    <>
      <section className="hero-bg border-b border-line">
        <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <span className="eyebrow"><Icon name="book" className="h-4 w-4" />Velyto Study</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">Study smarter, not longer — <span className="text-gradient">free.</span></h1>
            <p className="mt-4 max-w-xl text-lg text-muted">Turn your notes into flashcards, quiz yourself against the clock, stay consistent with a focus streak and plan your week — all in one clean workspace that works offline.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3"><a href="#workspace" className="btn btn-primary">Open the workspace<Icon name="arrow" className="h-4 w-4" /></a><Link href="/study/planner" className="btn btn-secondary">Weekly planner</Link><Link href="/study/resume-builder" className="btn btn-secondary">Resume builder</Link></div>
            <div className="mt-6"><PrivacyStrip /></div>
          </div>
          <div className="mx-auto w-full max-w-md"><PillarMock kind="study" /></div>
        </div>
      </section>

      <div className="container-x py-12">
        <section aria-labelledby="features-h">
          <SectionTitle eyebrow="What you get" title="Six tools built around how memory works" />
          <ul id="features-h" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{FEATURES.map(([i, t, d]) => <li key={t} className="card p-5"><span className="icon-tile"><Icon name={i} /></span><h3 className="mt-3 font-display text-lg font-extrabold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></li>)}</ul>
        </section>

        <section id="workspace" className="mt-16 scroll-mt-24" aria-labelledby="ws-h">
          <h2 id="ws-h" className="mb-5 text-3xl font-extrabold">Your workspace</h2>
          <StudyApp />
        </section>

        <section className="mt-16" aria-labelledby="faq-h"><h2 id="faq-h" className="mb-4 text-2xl font-extrabold">Study FAQs</h2><div className="max-w-3xl"><FaqList faqs={FAQS} /></div><p className="mt-4 text-sm"><Link href="/guides/flashcards-active-recall-pomodoro-exam-guide" className="font-semibold text-brand-link underline">Read: How to use flashcards, active recall &amp; Pomodoro to score higher →</Link></p></section>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [{ "@type": "WebApplication", name: "Velyto Study", url: abs("/study"), applicationCategory: "EducationalApplication", operatingSystem: "Any (web browser)", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }, faqLd(FAQS), breadcrumbLd([{ name: "Home", href: "/" }, { name: "Study", href: "/study" }])] }} />
    </>
  );
}
