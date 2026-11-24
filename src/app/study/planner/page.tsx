import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import { Breadcrumbs, FaqList, PageHeader, breadcrumbLd, faqLd } from "@/components/Common";
import PlannerApp from "@/components/PlannerApp";
import JsonLd from "@/components/JsonLd";

export const metadata = buildMeta({
  title: "Weekly Study Timetable Planner — Free, Printable, Syncs When Signed In",
  description: "Plan your study week with a colour-coded timetable. Add subjects and time blocks, print it, and sync across devices with a free account.",
  path: "/study/planner",
  absoluteTitle: true,
});

const FAQS: [string, string][] = [
  ["How do I make a good study timetable?", "Block fixed commitments first, then place your hardest subject in your best-energy slot, alternate heavy and light topics, and leave one weekly slot for revision and a mock test."],
  ["Does the planner sync?", "Guests save on this device. Signed-in users sync automatically to their account."],
  ["Can I print it?", "Yes. Press Print for a clean one-page view."],
];

export default function PlannerPage() {
  const crumbs = [{ name: "Home", href: "/" }, { name: "Study", href: "/study" }, { name: "Planner", href: "/study/planner" }];
  return (
    <>
      <PageHeader eyebrow="Velyto Study" icon="calendar" title="Weekly study timetable planner" sub="Add colour-coded blocks for each subject, see today highlighted, and print your plan." />
      <div className="container-x py-10">
        <Breadcrumbs items={crumbs} />
        <PlannerApp />
        <section className="mt-14 max-w-3xl"><h2 className="mb-4 text-2xl font-extrabold">Planner FAQs</h2><FaqList faqs={FAQS} /></section>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [{ "@type": "WebApplication", name: "Weekly Study Timetable Planner", url: abs("/study/planner"), applicationCategory: "EducationalApplication", operatingSystem: "Any (web browser)", isAccessibleForFree: true }, faqLd(FAQS), breadcrumbLd(crumbs)] }} />
    </>
  );
}
