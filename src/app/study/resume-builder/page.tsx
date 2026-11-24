import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import { Breadcrumbs, FaqList, PageHeader, breadcrumbLd, faqLd } from "@/components/Common";
import ResumeApp from "@/components/ResumeApp";
import JsonLd from "@/components/JsonLd";

export const metadata = buildMeta({
  title: "Free Resume / CV Builder — Live Preview & Instant PDF Download",
  description: "Build a clean, ATS-friendly resume with live preview and download an A4 PDF. No watermark, no sign-up, nothing uploaded.",
  path: "/study/resume-builder",
  absoluteTitle: true,
});

const FAQS: [string, string][] = [
  ["Is the resume builder really free?", "Yes — no watermark, no paywall, no sign-up."],
  ["Is the PDF ATS-friendly?", "The PDF uses a single column with real selectable text and standard headings, which applicant tracking systems read reliably."],
  ["Are my details uploaded?", "No. The PDF is generated in your browser. If you sign in, your resume draft syncs to your account so you can edit it anywhere."],
  ["How long should a resume be?", "One page for students and early-career candidates; two pages only when you have substantial relevant experience."],
];

export default function ResumePage() {
  const crumbs = [{ name: "Home", href: "/" }, { name: "Study", href: "/study" }, { name: "Resume Builder", href: "/study/resume-builder" }];
  return (
    <>
      <PageHeader eyebrow="Velyto Study" icon="file" title="Free resume / CV builder" sub="Fill in the form, watch the preview update and download a clean A4 PDF. Load the sample CV to see how a finished resume looks." />
      <div className="container-x py-10">
        <Breadcrumbs items={crumbs} />
        <ResumeApp />
        <section className="mt-14 max-w-3xl"><h2 className="mb-4 text-2xl font-extrabold">Resume builder FAQs</h2><FaqList faqs={FAQS} /></section>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [{ "@type": "WebApplication", name: "Free Resume Builder", url: abs("/study/resume-builder"), applicationCategory: "BusinessApplication", operatingSystem: "Any (web browser)", isAccessibleForFree: true }, faqLd(FAQS), breadcrumbLd(crumbs)] }} />
    </>
  );
}
