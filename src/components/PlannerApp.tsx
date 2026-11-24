"use client";
import { useEffect, useState } from "react";
import { uid, type PlanItem } from "@/lib/study";
import { StudyProvider, SyncBadge, useS } from "./StudyApp";
import { Field } from "./tools/ui";
import { Icon } from "./Icon";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const COLORS = ["#2563eb", "#0891b2", "#7c3aed", "#db2777", "#ea580c", "#16a34a"];
const SAMPLE_WEEK: Omit<PlanItem, "id">[] = [
  { day: 0, start: "18:00", end: "19:30", subject: "Mathematics", color: COLORS[0] },
  { day: 1, start: "18:00", end: "19:30", subject: "Physics", color: COLORS[1] },
  { day: 2, start: "18:00", end: "19:00", subject: "Chemistry", color: COLORS[2] },
  { day: 3, start: "18:00", end: "19:30", subject: "Biology", color: COLORS[3] },
  { day: 4, start: "17:30", end: "18:30", subject: "English", color: COLORS[4] },
  { day: 5, start: "10:00", end: "12:30", subject: "Mock test + review", color: COLORS[5] },
  { day: 6, start: "16:00", end: "17:00", subject: "Weekly revision", color: COLORS[0] },
];

function Planner() {
  const { data, update, sync, user } = useS();
  const [f, setF] = useState({ day: 0, start: "18:00", end: "19:00", subject: "", color: COLORS[0] });
  const [today, setToday] = useState(-1);
  useEffect(() => setToday((new Date().getDay() + 6) % 7), []);
  const add = () => {
    if (!f.subject.trim() || f.end <= f.start) return;
    update((d) => ({ ...d, planner: [...d.planner, { id: uid(), ...f, subject: f.subject.trim() }] }));
    setF({ ...f, subject: "" });
  };
  const hours = data.planner.reduce((s, p) => { const [a, b] = [p.start, p.end].map((t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3))); return s + (b - a) / 60; }, 0);
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2 no-print">
        <SyncBadge sync={sync} signedIn={!!user} />
        <span className="text-sm font-semibold text-muted">{data.planner.length} blocks · {hours.toFixed(1)} h / week</span>
        <div className="ml-auto flex gap-2"><button className="btn btn-secondary btn-sm" onClick={() => update((d) => ({ ...d, planner: [...d.planner, ...SAMPLE_WEEK.map((p) => ({ ...p, id: uid() }))] }))}><Icon name="zap" className="h-4 w-4" />Load sample week</button><button className="btn btn-secondary btn-sm" onClick={() => window.print()}><Icon name="print" className="h-4 w-4" />Print</button><button className="btn btn-danger btn-sm" onClick={() => { if (confirm("Clear the whole timetable?")) update((d) => ({ ...d, planner: [] })); }}>Clear</button></div>
      </div>
      <form className="card grid gap-3 p-4 no-print sm:grid-cols-2 lg:grid-cols-[9rem_7rem_7rem_1fr_auto_auto]" onSubmit={(e) => { e.preventDefault(); add(); }}>
        <Field label="Day"><select className="input" value={f.day} onChange={(e) => setF({ ...f, day: Number(e.target.value) })}>{DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}</select></Field>
        <Field label="Start"><input type="time" className="input" value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} /></Field>
        <Field label="End"><input type="time" className="input" value={f.end} onChange={(e) => setF({ ...f, end: e.target.value })} /></Field>
        <Field label="Subject / task"><input className="input" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} placeholder="e.g. Organic chemistry" maxLength={60} /></Field>
        <div><span className="label">Colour</span><div className="flex gap-1.5 py-1.5">{COLORS.map((c) => <button type="button" key={c} onClick={() => setF({ ...f, color: c })} aria-label={`Colour ${c}`} aria-pressed={f.color === c} className={`h-6 w-6 rounded-full ring-offset-2 ring-offset-surface ${f.color === c ? "ring-2 ring-fg" : ""}`} style={{ background: c }} />)}</div></div>
        <button className="btn btn-primary self-end" type="submit"><Icon name="plus" className="h-4 w-4" />Add</button>
      </form>
      {f.end <= f.start && <p className="text-sm text-bad no-print">End time must be after start time.</p>}
      <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
        {DAYS.map((d, i) => {
          const items = data.planner.filter((p) => p.day === i).sort((a, b) => a.start.localeCompare(b.start));
          return (
            <section key={d} aria-label={d} className={`card min-h-[8rem] p-3 ${today === i ? "ring-2 ring-brand" : ""}`}>
              <h3 className="mb-2 font-display text-sm font-extrabold">{d.slice(0, 3)}{today === i && <span className="ml-1.5 rounded bg-brand px-1.5 py-0.5 text-[10px] text-white">Today</span>}</h3>
              <ul className="grid gap-1.5">
                {items.map((p) => (
                  <li key={p.id} className="group relative rounded-lg p-2 pl-3 text-xs text-white" style={{ background: p.color }}>
                    <p className="font-bold leading-tight">{p.subject}</p><p className="opacity-90">{p.start}–{p.end}</p>
                    <button className="absolute right-1 top-1 rounded p-0.5 opacity-0 hover:bg-black/20 focus:opacity-100 group-hover:opacity-100 no-print" aria-label={`Delete ${p.subject}`} onClick={() => update((s) => ({ ...s, planner: s.planner.filter((x) => x.id !== p.id) }))}><Icon name="x" className="h-3.5 w-3.5" /></button>
                  </li>
                ))}
                {items.length === 0 && <li className="text-xs text-muted">Free day</li>}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default function PlannerApp() {
  return <StudyProvider><Planner /></StudyProvider>;
}
