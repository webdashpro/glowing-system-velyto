"use client";
import { useEffect, useState } from "react";
import { downloadBlob } from "@/lib/client";
import { pdfBlob } from "@/lib/image";
import { safe, wrap } from "@/lib/pdf";
import { uid, type ResumeData } from "@/lib/study";
import { StudyProvider, SyncBadge, useS } from "./StudyApp";
import { Field, Panel } from "./tools/ui";
import { Icon } from "./Icon";

const BLANK: ResumeData = {
  name: "", headline: "", email: "", phone: "", location: "", links: "", summary: "",
  experience: [{ id: "e1", role: "", org: "", period: "", bullets: "" }],
  education: [{ id: "d1", degree: "", school: "", period: "", detail: "" }],
  skills: "", extras: "",
};
const SAMPLE: ResumeData = {
  name: "Aarav Sharma", headline: "Computer Science Graduate · Frontend Developer", email: "aarav@example.com", phone: "+91 98765 43210", location: "Pune, India", links: "github.com/aarav · linkedin.com/in/aarav",
  summary: "Detail-oriented graduate with hands-on experience building responsive web apps. Passionate about accessible design, clean code and shipping features that users actually need.",
  experience: [{ id: "e1", role: "Frontend Intern", org: "BrightPixel Studio", period: "Jun 2025 – Dec 2025", bullets: "Built a React dashboard used by 300+ staff, cutting report time by 40%\nImproved Lighthouse performance from 62 to 94 on the marketing site\nWrote unit tests that raised coverage from 35% to 80%" }],
  education: [{ id: "d1", degree: "B.Tech, Computer Science", school: "Savitribai Phule Pune University", period: "2021 – 2025", detail: "CGPA 8.6/10 · Dean's list 2024" }],
  skills: "JavaScript, TypeScript, React, Next.js, HTML & CSS, Git, REST APIs, Figma", extras: "Winner, Smart India Hackathon (internal round) 2024\nVolunteer coding mentor for school students",
};

function Resume() {
  const { data, update, sync, user, ready } = useS();
  const [r, setR] = useState<ResumeData>(BLANK);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (ready && !loaded) {
      if (data.resume) setR(data.resume);
      setLoaded(true);
    }
  }, [ready, loaded, data.resume]);
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => update((d) => ({ ...d, resume: r })), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r, loaded]);
  const set = <K extends keyof ResumeData>(k: K, v: ResumeData[K]) => setR((p) => ({ ...p, [k]: v }));
  const contact = [r.email, r.phone, r.location, r.links].filter(Boolean).join("  |  ");

  async function pdf() {
    setBusy(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc = await PDFDocument.create();
      const reg = await doc.embedFont(StandardFonts.Helvetica);
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      const W = 595.28, H = 841.89, M = 44, CW = W - M * 2;
      const blue = rgb(0.145, 0.388, 0.922), ink = rgb(0.04, 0.09, 0.19), grey = rgb(0.33, 0.38, 0.47);
      let page = doc.addPage([W, H]);
      let y = H - M;
      const need = (n: number) => { if (y - n < M) { page = doc.addPage([W, H]); y = H - M; } };
      const text = (t: string, o: { size?: number; font?: typeof reg; color?: ReturnType<typeof rgb>; x?: number; w?: number; lh?: number } = {}) => {
        const size = o.size ?? 10, font = o.font ?? reg;
        for (const line of wrap(font, t, size, o.w ?? CW)) { need(size * 1.4); page.drawText(line, { x: o.x ?? M, y: y - size, size, font, color: o.color ?? ink }); y -= o.lh ?? size * 1.4; }
      };
      const heading = (t: string) => { need(30); y -= 8; page.drawText(safe(t.toUpperCase()), { x: M, y: y - 11, size: 11, font: bold, color: blue }); y -= 15; page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.8, color: blue }); y -= 8; };
      text(r.name || "Your Name", { size: 24, font: bold, lh: 28 });
      if (r.headline) text(r.headline, { size: 12, color: blue, font: bold, lh: 16 });
      if (contact) text(contact, { size: 9, color: grey, lh: 13 });
      if (r.summary.trim()) { heading("Summary"); text(r.summary, { size: 10 }); }
      const exp = r.experience.filter((e) => e.role || e.org);
      if (exp.length) { heading("Experience"); for (const e of exp) { need(40); text(`${e.role}${e.org ? ` — ${e.org}` : ""}`, { font: bold, size: 10.5 }); if (e.period) text(e.period, { size: 9, color: grey, lh: 12 }); for (const b of e.bullets.split("\n").filter((x) => x.trim())) text(`• ${b.trim()}`, { x: M + 8, w: CW - 8 }); y -= 5; } }
      const edu = r.education.filter((e) => e.degree || e.school);
      if (edu.length) { heading("Education"); for (const e of edu) { need(36); text(`${e.degree}${e.school ? ` — ${e.school}` : ""}`, { font: bold, size: 10.5 }); if (e.period) text(e.period, { size: 9, color: grey, lh: 12 }); if (e.detail) text(e.detail); y -= 5; } }
      if (r.skills.trim()) { heading("Skills"); text(r.skills); }
      if (r.extras.trim()) { heading("Achievements & activities"); for (const b of r.extras.split("\n").filter((x) => x.trim())) text(`• ${b.trim()}`, { x: M + 8, w: CW - 8 }); }
      downloadBlob(pdfBlob(await doc.save()), `${(r.name || "resume").toLowerCase().replace(/\W+/g, "-")}-resume.pdf`);
    } finally { setBusy(false); }
  }

  const lines = (s: string) => s.split("\n").filter((x) => x.trim());
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="grid content-start gap-4">
        <div className="flex flex-wrap items-center gap-2"><SyncBadge sync={sync} signedIn={!!user} /><button className="btn btn-secondary btn-sm ml-auto" onClick={() => setR(SAMPLE)}><Icon name="zap" className="h-4 w-4" />Load sample CV</button><button className="btn btn-ghost btn-sm" onClick={() => { if (confirm("Clear your resume?")) setR(BLANK); }}>Clear</button></div>
        <Panel className="grid gap-3 sm:grid-cols-2">
          <Field label="Full name"><input className="input" value={r.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Headline"><input className="input" value={r.headline} onChange={(e) => set("headline", e.target.value)} placeholder="Role · specialty" /></Field>
          <Field label="Email"><input className="input" type="email" value={r.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Phone"><input className="input" value={r.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label="Location"><input className="input" value={r.location} onChange={(e) => set("location", e.target.value)} /></Field>
          <Field label="Links"><input className="input" value={r.links} onChange={(e) => set("links", e.target.value)} placeholder="linkedin.com/in/you" /></Field>
          <Field label="Summary" className="sm:col-span-2"><textarea className="input" rows={3} value={r.summary} onChange={(e) => set("summary", e.target.value)} /></Field>
        </Panel>
        <Panel className="grid gap-3">
          <div className="flex items-center justify-between"><h3 className="font-display font-bold">Experience</h3><button className="btn btn-secondary btn-sm" onClick={() => set("experience", [...r.experience, { id: uid(), role: "", org: "", period: "", bullets: "" }])}><Icon name="plus" className="h-4 w-4" />Add</button></div>
          {r.experience.map((e, i) => (
            <div key={e.id} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-2">
              <input className="input" placeholder="Role" aria-label="Role" value={e.role} onChange={(x) => set("experience", r.experience.map((p, j) => (j === i ? { ...p, role: x.target.value } : p)))} />
              <input className="input" placeholder="Organisation" aria-label="Organisation" value={e.org} onChange={(x) => set("experience", r.experience.map((p, j) => (j === i ? { ...p, org: x.target.value } : p)))} />
              <input className="input sm:col-span-2" placeholder="Period (e.g. Jan 2024 – Present)" aria-label="Period" value={e.period} onChange={(x) => set("experience", r.experience.map((p, j) => (j === i ? { ...p, period: x.target.value } : p)))} />
              <textarea className="input sm:col-span-2" rows={3} placeholder="One achievement per line" aria-label="Bullets" value={e.bullets} onChange={(x) => set("experience", r.experience.map((p, j) => (j === i ? { ...p, bullets: x.target.value } : p)))} />
              {r.experience.length > 1 && <button className="btn btn-ghost btn-sm w-fit text-bad" onClick={() => set("experience", r.experience.filter((_, j) => j !== i))}>Remove</button>}
            </div>
          ))}
        </Panel>
        <Panel className="grid gap-3">
          <div className="flex items-center justify-between"><h3 className="font-display font-bold">Education</h3><button className="btn btn-secondary btn-sm" onClick={() => set("education", [...r.education, { id: uid(), degree: "", school: "", period: "", detail: "" }])}><Icon name="plus" className="h-4 w-4" />Add</button></div>
          {r.education.map((e, i) => (
            <div key={e.id} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-2">
              <input className="input" placeholder="Degree" aria-label="Degree" value={e.degree} onChange={(x) => set("education", r.education.map((p, j) => (j === i ? { ...p, degree: x.target.value } : p)))} />
              <input className="input" placeholder="School / University" aria-label="School" value={e.school} onChange={(x) => set("education", r.education.map((p, j) => (j === i ? { ...p, school: x.target.value } : p)))} />
              <input className="input" placeholder="Period" aria-label="Period" value={e.period} onChange={(x) => set("education", r.education.map((p, j) => (j === i ? { ...p, period: x.target.value } : p)))} />
              <input className="input" placeholder="Detail (grade, honours)" aria-label="Detail" value={e.detail} onChange={(x) => set("education", r.education.map((p, j) => (j === i ? { ...p, detail: x.target.value } : p)))} />
              {r.education.length > 1 && <button className="btn btn-ghost btn-sm w-fit text-bad" onClick={() => set("education", r.education.filter((_, j) => j !== i))}>Remove</button>}
            </div>
          ))}
        </Panel>
        <Panel className="grid gap-3"><Field label="Skills (comma separated)"><textarea className="input" rows={2} value={r.skills} onChange={(e) => set("skills", e.target.value)} /></Field><Field label="Achievements & activities (one per line)"><textarea className="input" rows={3} value={r.extras} onChange={(e) => set("extras", e.target.value)} /></Field></Panel>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="mb-2 flex items-center justify-between"><p className="text-sm font-bold text-muted">Live preview (A4)</p><button className="btn btn-primary btn-sm" disabled={busy} onClick={pdf}><Icon name="download" className="h-4 w-4" />{busy ? "Building…" : "Download PDF"}</button></div>
        <div className="max-h-[40rem] overflow-auto rounded-xl border border-line bg-white p-7 text-[12px] leading-relaxed text-slate-800 shadow-soft">
          <h2 className="font-display text-2xl font-extrabold !text-slate-900">{r.name || "Your Name"}</h2>
          {r.headline && <p className="font-bold text-blue-700">{r.headline}</p>}
          {contact && <p className="text-[11px] text-slate-500">{contact}</p>}
          {r.summary && <Sec t="Summary"><p>{r.summary}</p></Sec>}
          {r.experience.some((e) => e.role || e.org) && <Sec t="Experience">{r.experience.filter((e) => e.role || e.org).map((e) => <div key={e.id} className="mb-2"><p className="font-bold">{e.role}{e.org && ` — ${e.org}`}</p><p className="text-[11px] text-slate-500">{e.period}</p><ul className="ml-4 list-disc">{lines(e.bullets).map((b, i) => <li key={i}>{b}</li>)}</ul></div>)}</Sec>}
          {r.education.some((e) => e.degree || e.school) && <Sec t="Education">{r.education.filter((e) => e.degree || e.school).map((e) => <div key={e.id} className="mb-2"><p className="font-bold">{e.degree}{e.school && ` — ${e.school}`}</p><p className="text-[11px] text-slate-500">{e.period}</p><p>{e.detail}</p></div>)}</Sec>}
          {r.skills && <Sec t="Skills"><p>{r.skills}</p></Sec>}
          {r.extras && <Sec t="Achievements & activities"><ul className="ml-4 list-disc">{lines(r.extras).map((b, i) => <li key={i}>{b}</li>)}</ul></Sec>}
        </div>
        <p className="mt-2 text-xs text-muted">Your resume autosaves on this device{user ? " and syncs to your account" : ""}. The PDF is generated locally — nothing is uploaded.</p>
      </div>
    </div>
  );
}

function Sec({ t, children }: { t: string; children: React.ReactNode }) {
  return <section className="mt-4"><h3 className="mb-1 border-b-2 border-blue-600 pb-0.5 font-display text-[11px] font-extrabold uppercase tracking-wider !text-blue-700">{t}</h3>{children}</section>;
}

export default function ResumeApp() {
  return <StudyProvider><Resume /></StudyProvider>;
}
