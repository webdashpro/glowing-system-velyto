import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { abs } from "@/lib/site";
import { toolsByCategory } from "@/data/tools";
import { Icon } from "@/components/Icon";
import { PillarMock } from "@/components/Mockups";
import { FaqList, PrivacyStrip, SectionTitle, breadcrumbLd, faqLd } from "@/components/Common";
import ToolCard from "@/components/ToolCard";
import JsonLd from "@/components/JsonLd";

export const metadata = buildMeta({
  title: "Velyto Media — Video to Image, Images to Video, Image Converter & Audio Recorder",
  description: "Real browser-side media tools using HTML5 Video, Canvas and MediaRecorder: extract video frames, make .webm videos from images, convert image formats, record voice notes.",
  path: "/media",
  absoluteTitle: true,
});

const FAQS: [string, string][] = [
  ["Are these tools real or demos?", "They are real. Video frames are drawn from the HTML5 video element onto a Canvas, videos are encoded with MediaRecorder, and audio is captured from your microphone — all inside your browser."],
  ["Are my videos uploaded?", "No. Files are read from local blob URLs and never sent to a server."],
  ["Which browsers work best?", "Recent Chrome, Edge, Firefox and Safari. Video recording needs MediaRecorder with WebM support; the tools tell you plainly if your browser can't do something."],
  ["Is there a file size limit?", "Only your device's memory. Long or 4K videos need more RAM, so extract in segments."],
];

const SUPPORT: [string, string, string, string][] = [
  ["Video → Image", "HTML5 <video> + Canvas", "MP4 (H.264), WebM", "PNG / JPG at native resolution"],
  ["Images → Video", "Canvas.captureStream + MediaRecorder", "JPG, PNG, WebP", ".webm (VP9 / VP8)"],
  ["Image Converter", "Canvas.toBlob", "JPG, PNG, WebP", "JPG, PNG, WebP"],
  ["Audio Recorder", "getUserMedia + MediaRecorder", "Microphone", ".webm / .m4a / .ogg"],
];

export default function MediaPage() {
  const tools = toolsByCategory("media");
  return (
    <>
      <section className="hero-bg border-b border-line">
        <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <span className="eyebrow"><Icon name="film" className="h-4 w-4" />Velyto Media · New</span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">Video, image &amp; audio tools that <span className="text-gradient">run on your device.</span></h1>
            <p className="mt-4 max-w-xl text-lg text-muted">Extract frames from a video, turn photos into a real .webm slideshow, convert image formats in bulk and record clean voice notes — no upload, no watermark, no fake AI placeholders.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link href="/tools/video-to-image" className="btn btn-primary">Extract video frames<Icon name="arrow" className="h-4 w-4" /></Link><Link href="/tools/image-to-video" className="btn btn-secondary">Make a video</Link></div>
            <div className="mt-6"><PrivacyStrip /></div>
          </div>
          <div className="mx-auto w-full max-w-md"><PillarMock kind="media" /></div>
        </div>
      </section>
      <div className="container-x py-14">
        <SectionTitle eyebrow="Four real tools" title="Pick a media tool" />
        <div className="grid gap-4 sm:grid-cols-2">{tools.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>

        <section className="mt-16" aria-labelledby="how-h">
          <SectionTitle eyebrow="Under the hood" title="Real browser APIs, no black boxes" />
          <div id="how-h" className="table-wrap"><table className="w-full text-sm"><thead className="bg-soft text-left"><tr><th className="p-3">Tool</th><th className="p-3">Browser API</th><th className="p-3">Input</th><th className="p-3">Output</th></tr></thead><tbody>{SUPPORT.map((r) => <tr key={r[0]} className="border-t border-line">{r.map((c, i) => <td key={i} className={`p-3 ${i === 0 ? "font-semibold" : "text-muted"}`}>{c}</td>)}</tr>)}</tbody></table></div>
        </section>

        <section className="mt-16 max-w-3xl" aria-labelledby="faq-h"><h2 id="faq-h" className="mb-4 text-2xl font-extrabold">Media FAQs</h2><FaqList faqs={FAQS} /></section>
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [{ "@type": "CollectionPage", name: "Velyto Media", url: abs("/media") }, faqLd(FAQS), breadcrumbLd([{ name: "Home", href: "/" }, { name: "Media", href: "/media" }])] }} />
    </>
  );
}
