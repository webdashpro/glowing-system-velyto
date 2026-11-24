"use client";
import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { SAMPLE, streakCount, todayKey, uid, useStudy, type Card, type Quiz, type QuizQ } from "@/lib/study";
import { Field, Notice, Stat } from "./tools/ui";
import { Icon } from "./Icon";

type Store = ReturnType<typeof useStudy>;
const Ctx = createContext<Store | null>(null);
export function StudyProvider({ children }: { children: ReactNode }) {
  const store = useStudy();
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}
export const useS = (): Store => useContext(Ctx)!;

const TABS = [["notes", "Notes", "pen"], ["cards", "Flashcards", "layers"], ["quiz", "Quiz", "checkcircle"], ["focus", "Focus", "timer"]] as const;
type Tab = (typeof TABS)[number][0];

export function SyncBadge({ sync, signedIn }: { sync: string; signedIn: boolean }) {
  const t = sync === "synced" ? "Synced to your account" : sync === "syncing" ? "Syncing…" : sync === "error" ? "Sync paused — will retry" : signedIn ? "Loading…" : "Guest mode · saved on this device";
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${sync === "synced" ? "border-emerald-500/40 text-good" : "border-line text-muted"}`}><Icon name={sync === "synced" ? "checkcircle" : "offline"} className="h-3.5 w-3.5" />{t}{!signedIn && sync !== "loading" && <Link href="/signup?next=/study" className="ml-1 text-brand-link underline">Sign in to sync</Link>}</span>;
}

export default function StudyApp() {
  return <StudyProvider><Workspace /></StudyProvider>;
}

function Workspace() {
  const { data, update, ready, sync, user } = useS();
  const [tab, setTab] = useState<Tab>("notes");
  const loadSample = () => {
    const s = SAMPLE();
    update((d) => ({ ...d, notes: [...s.notes, ...d.notes], cards: [...s.cards, ...d.cards], quizzes: [...s.quizzes, ...d.quizzes] }));
  };
  const empty = ready && !data.notes.length && !data.cards.length && !data.quizzes.length;
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Study workspace">
          {TABS.map(([k, l, i]) => <button key={k} role="tab" aria-selected={tab === k} className="chip" aria-pressed={tab === k} onClick={() => setTab(k)}><Icon name={i} className="h-4 w-4" />{l}{k === "cards" && data.cards.length > 0 && <b className="text-xs">{data.cards.length}</b>}</button>)}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2"><SyncBadge sync={sync} signedIn={!!user} /><button className="btn btn-secondary btn-sm" onClick={loadSample}><Icon name="zap" className="h-4 w-4" />Load Sample Chapter</button></div>
      </div>
      {empty && <Notice>Nothing here yet — press <b>Load Sample Chapter</b> to see notes, flashcards and a quiz instantly, or start writing your own.</Notice>}
      {tab === "notes" && <NotesTab />}
      {tab === "cards" && <CardsTab />}
      {tab === "quiz" && <QuizTab />}
      {tab === "focus" && <FocusTab />}
    </div>
  );
}

/* ---------------- Notes ---------------- */
function keyPoints(body: string): string[] {
  const sentences = body.replace(/\n+/g, " ").match(/[^.!?]+[.!?]/g)?.map((s) => s.trim()).filter((s) => s.split(" ").length > 5) ?? [];
  const freq = new Map<string, number>();
  for (const w of body.toLowerCase().match(/[a-z]{4,}/g) ?? []) freq.set(w, (freq.get(w) ?? 0) + 1);
  return sentences.map((s, i) => ({ s, i, sc: (s.toLowerCase().match(/[a-z]{4,}/g) ?? []).reduce((a, w) => a + (freq.get(w) ?? 0), 0) / Math.sqrt(s.length) })).sort((a, b) => b.sc - a.sc).slice(0, 3).sort((a, b) => a.i - b.i).map((x) => x.s);
}

function NotesTab() {
  const { data, update } = useS();
  const [sel, setSel] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const note = data.notes.find((n) => n.id === sel) ?? data.notes[0];
  const patch = (p: Partial<{ title: string; body: string }>) => note && update((d) => ({ ...d, notes: d.notes.map((n) => (n.id === note.id ? { ...n, ...p, updated: Date.now() } : n)) }));
  const makeCards = () => {
    if (!note) return;
    const found: Card[] = [];
    for (const line of note.body.split("\n")) {
      const m = line.match(/^\s*(.{2,80}?)\s*[:：]\s+(.{3,300})$/);
      if (m) found.push({ id: uid(), front: `What is ${m[1]}?`, back: m[2] });
    }
    const existing = new Set(data.cards.map((c) => c.front));
    const fresh = found.filter((c) => !existing.has(c.front));
    update((d) => ({ ...d, cards: [...d.cards, ...fresh] }));
    setMsg(fresh.length ? `Created ${fresh.length} flashcard${fresh.length > 1 ? "s" : ""} from “Term: definition” lines.` : "No new “Term: definition” lines found. Write lines like  Mitosis: cell division that produces two identical cells.");
  };
  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
      <div className="card p-3">
        <button className="btn btn-primary btn-sm mb-3 w-full" onClick={() => { const n = { id: uid(), title: "Untitled note", body: "", updated: Date.now() }; update((d) => ({ ...d, notes: [n, ...d.notes] })); setSel(n.id); }}><Icon name="plus" className="h-4 w-4" />New note</button>
        <ul className="grid gap-1">{data.notes.map((n) => <li key={n.id}><button onClick={() => setSel(n.id)} className={`w-full truncate rounded-lg px-3 py-2 text-left text-sm font-semibold ${note?.id === n.id ? "bg-brand-soft text-brand-ink" : "hover:bg-soft"}`}>{n.title || "Untitled"}</button></li>)}{data.notes.length === 0 && <li className="p-3 text-sm text-muted">No notes yet.</li>}</ul>
      </div>
      {note ? (
        <div className="card grid gap-3 p-4">
          <input className="input font-display !text-lg font-bold" value={note.title} onChange={(e) => patch({ title: e.target.value })} aria-label="Note title" />
          <textarea className="input min-h-[16rem]" value={note.body} onChange={(e) => patch({ body: e.target.value })} aria-label="Note body" placeholder={"Write your notes here.\nTip: lines like “Term: definition” become flashcards."} />
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary btn-sm" onClick={makeCards}><Icon name="layers" className="h-4 w-4" />Make flashcards from notes</button>
            <button className="btn btn-danger btn-sm" onClick={() => { update((d) => ({ ...d, notes: d.notes.filter((n) => n.id !== note.id) })); setSel(null); }}><Icon name="trash" className="h-4 w-4" />Delete</button>
          </div>
          {msg && <Notice kind="ok">{msg}</Notice>}
          {keyPoints(note.body).length > 0 && <div className="rounded-xl border border-line bg-soft p-3"><p className="label">Key points (auto-extracted)</p><ul className="grid gap-1.5 text-sm">{keyPoints(note.body).map((k) => <li key={k} className="flex gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 flex-none text-brand-link" />{k}</li>)}</ul></div>}
        </div>
      ) : <div className="card grid place-items-center p-10 text-center text-muted">Create a note or load the sample chapter.</div>}
    </div>
  );
}

/* ---------------- Flashcards ---------------- */
function CardsTab() {
  const { data, update } = useS();
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [only, setOnly] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const deck = only ? data.cards.filter((c) => !c.known) : data.cards;
  const card = deck[Math.min(i, Math.max(0, deck.length - 1))];
  const go = (d: number) => { setFlip(false); setI((x) => (deck.length ? (x + d + deck.length) % deck.length : 0)); };
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const t = (e.target as HTMLElement).tagName;
      if (t === "INPUT" || t === "TEXTAREA") return;
      if (e.code === "Space") { e.preventDefault(); setFlip((f) => !f); }
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  const mark = (known: boolean) => { if (!card) return; update((d) => ({ ...d, cards: d.cards.map((c) => (c.id === card.id ? { ...c, known } : c)) })); go(1); };
  const known = data.cards.filter((c) => c.known).length;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
      <div className="grid gap-3">
        {card ? (
          <>
            <button onClick={() => setFlip(!flip)} className="group [perspective:1200px]" aria-label={flip ? "Show question" : "Reveal answer"}>
              <span className={`relative block h-64 w-full transition-transform duration-500 [transform-style:preserve-3d] ${flip ? "[transform:rotateY(180deg)]" : ""}`}>
                <span className="absolute inset-0 grid place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-800 p-8 text-center font-display text-2xl font-extrabold text-white shadow-pop [backface-visibility:hidden]">{card.front}</span>
                <span className="absolute inset-0 grid place-items-center rounded-2xl border-2 border-brand bg-surface p-8 text-center text-xl font-semibold shadow-pop [backface-visibility:hidden] [transform:rotateY(180deg)]">{card.back}</span>
              </span>
            </button>
            <p className="text-center text-sm text-muted">Card {Math.min(i, deck.length - 1) + 1} of {deck.length} · Space to flip · ← → to move</p>
            <div className="flex flex-wrap justify-center gap-2"><button className="btn btn-secondary" onClick={() => go(-1)}>← Prev</button><button className="btn btn-secondary" onClick={() => mark(false)}>Again</button><button className="btn btn-primary" onClick={() => mark(true)}>Got it ✓</button><button className="btn btn-secondary" onClick={() => go(1)}>Next →</button></div>
          </>
        ) : <div className="card grid place-items-center p-12 text-center text-muted">{data.cards.length ? "All cards marked known — great work! Untick “only unknown”." : "No flashcards yet. Add one, generate from notes, or load the sample chapter."}</div>}
        <div className="grid grid-cols-3 gap-3"><Stat label="Cards" value={data.cards.length} /><Stat label="Known" value={known} /><Stat label="To review" value={data.cards.length - known} /></div>
      </div>
      <div className="grid content-start gap-3">
        <div className="card grid gap-2 p-4">
          <h3 className="font-display font-bold">Add a card</h3>
          <Field label="Question / term"><input className="input" value={front} onChange={(e) => setFront(e.target.value)} /></Field>
          <Field label="Answer"><textarea className="input" rows={2} value={back} onChange={(e) => setBack(e.target.value)} /></Field>
          <button className="btn btn-primary btn-sm" disabled={!front.trim() || !back.trim()} onClick={() => { update((d) => ({ ...d, cards: [...d.cards, { id: uid(), front: front.trim(), back: back.trim() }] })); setFront(""); setBack(""); }}>Add card</button>
          <label className="mt-1 flex items-center gap-2 text-sm"><input type="checkbox" checked={only} onChange={(e) => { setOnly(e.target.checked); setI(0); }} />Only cards I don&apos;t know yet</label>
          <div className="flex gap-2"><button className="btn btn-ghost btn-sm" onClick={() => update((d) => ({ ...d, cards: [...d.cards].sort(() => Math.random() - 0.5) }))}>Shuffle</button><button className="btn btn-ghost btn-sm" onClick={() => update((d) => ({ ...d, cards: d.cards.map((c) => ({ ...c, known: false })) }))}>Reset progress</button></div>
        </div>
        <ul className="card max-h-64 divide-y divide-line overflow-y-auto text-sm">{data.cards.map((c) => <li key={c.id} className="flex items-center gap-2 p-2.5"><span className="min-w-0 flex-1 truncate">{c.known ? "✓ " : ""}{c.front}</span><button className="btn btn-ghost btn-sm text-bad" aria-label="Delete card" onClick={() => update((d) => ({ ...d, cards: d.cards.filter((x) => x.id !== c.id) }))}><Icon name="trash" className="h-4 w-4" /></button></li>)}</ul>
      </div>
    </div>
  );
}

/* ---------------- Quiz ---------------- */
function QuizTab() {
  const { data, update } = useS();
  const [mode, setMode] = useState<"list" | "build" | "run" | "result">("list");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [left, setLeft] = useState(0);
  const [draft, setDraft] = useState<Quiz>({ id: "", title: "", minutes: 5, questions: [] });
  const [q, setQ] = useState({ q: "", o: ["", "", "", ""], a: 0 });
  const [shared, setShared] = useState("");
  const finish = useRef<() => void>(() => {});
  finish.current = () => setMode("result");
  useEffect(() => {
    if (mode !== "run") return;
    const end = Date.now() + left * 1000;
    const t = setInterval(() => {
      const r = Math.max(0, Math.round((end - Date.now()) / 1000));
      setLeft(r);
      if (r <= 0) { clearInterval(t); finish.current(); }
    }, 500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
  const start = (z: Quiz) => { setQuiz(z); setAnswers({}); setLeft(z.minutes * 60); setShared(""); setMode("run"); };
  const score = quiz ? quiz.questions.filter((x) => answers[x.id] === x.answer).length : 0;
  const share = async () => {
    if (!quiz) return;
    const text = `I scored ${score}/${quiz.questions.length} on “${quiz.title}” with Velyto Study! Try it free: https://velyto.netlify.app/study`;
    try {
      if (navigator.share) await navigator.share({ text });
      else { await navigator.clipboard.writeText(text); setShared("Score copied to clipboard — paste it anywhere."); }
    } catch { /* cancelled */ }
  };
  if (mode === "build") {
    const addQ = () => {
      const opts = q.o.map((x) => x.trim()).filter(Boolean);
      if (!q.q.trim() || opts.length < 2) return;
      const item: QuizQ = { id: uid(), q: q.q.trim(), options: q.o.map((x) => x.trim()).filter(Boolean), answer: Math.min(q.a, opts.length - 1) };
      setDraft((d) => ({ ...d, questions: [...d.questions, item] }));
      setQ({ q: "", o: ["", "", "", ""], a: 0 });
    };
    return (
      <div className="card grid gap-3 p-5">
        <h3 className="font-display text-xl font-extrabold">Quiz builder</h3>
        <div className="grid gap-3 sm:grid-cols-[1fr_8rem]"><Field label="Quiz title"><input className="input" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field><Field label="Time limit (min)"><input className="input" type="number" min={1} max={180} value={draft.minutes} onChange={(e) => setDraft({ ...draft, minutes: Number(e.target.value) || 1 })} /></Field></div>
        <div className="grid gap-2 rounded-xl border border-line p-3">
          <Field label={`Question ${draft.questions.length + 1}`}><input className="input" value={q.q} onChange={(e) => setQ({ ...q, q: e.target.value })} /></Field>
          {q.o.map((o, i) => <div key={i} className="flex items-center gap-2"><input type="radio" name="correct" checked={q.a === i} onChange={() => setQ({ ...q, a: i })} aria-label={`Option ${i + 1} is correct`} /><input className="input" placeholder={`Option ${i + 1}`} value={o} onChange={(e) => setQ({ ...q, o: q.o.map((x, j) => (j === i ? e.target.value : x)) })} /></div>)}
          <p className="text-xs text-muted">Select the radio button next to the correct answer.</p>
          <button className="btn btn-secondary btn-sm w-fit" onClick={addQ}><Icon name="plus" className="h-4 w-4" />Add question</button>
        </div>
        <ol className="grid gap-1 text-sm">{draft.questions.map((x, i) => <li key={x.id} className="flex items-center gap-2"><span className="min-w-0 flex-1 truncate">{i + 1}. {x.q}</span><button className="btn btn-ghost btn-sm text-bad" onClick={() => setDraft((d) => ({ ...d, questions: d.questions.filter((y) => y.id !== x.id) }))}><Icon name="trash" className="h-4 w-4" /></button></li>)}</ol>
        <div className="flex gap-2"><button className="btn btn-primary" disabled={!draft.title.trim() || !draft.questions.length} onClick={() => { update((d) => ({ ...d, quizzes: [{ ...draft, id: uid() }, ...d.quizzes] })); setMode("list"); setDraft({ id: "", title: "", minutes: 5, questions: [] }); }}>Save quiz</button><button className="btn btn-ghost" onClick={() => setMode("list")}>Cancel</button></div>
      </div>
    );
  }
  if (mode === "run" && quiz) {
    return (
      <div className="card grid gap-4 p-5">
        <div className="flex items-center justify-between"><h3 className="font-display text-xl font-extrabold">{quiz.title}</h3><span className={`rounded-full px-3 py-1 font-display text-lg font-extrabold tabular-nums ${left < 30 ? "bg-red-500/15 text-bad" : "bg-brand-soft text-brand-ink"}`} role="timer">{Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}</span></div>
        {quiz.questions.map((x, n) => (
          <fieldset key={x.id} className="grid gap-2 rounded-xl border border-line p-3"><legend className="px-1 font-semibold">{n + 1}. {x.q}</legend>{x.options.map((o, i) => <label key={i} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${answers[x.id] === i ? "border-brand bg-brand-soft" : "border-line"}`}><input type="radio" name={x.id} checked={answers[x.id] === i} onChange={() => setAnswers({ ...answers, [x.id]: i })} />{o}</label>)}</fieldset>
        ))}
        <button className="btn btn-primary w-fit" onClick={() => setMode("result")}>Submit answers</button>
      </div>
    );
  }
  if (mode === "result" && quiz) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="card grid gap-4 p-5">
        <div className="text-center"><p className="text-sm font-bold text-muted">Your score</p><p className="font-display text-6xl font-extrabold text-brand-link">{score}/{quiz.questions.length}</p><p className="text-lg font-semibold">{pct}% — {pct >= 80 ? "Excellent!" : pct >= 50 ? "Good effort — review the misses." : "Keep practising — you'll get there."}</p></div>
        <div className="flex flex-wrap justify-center gap-2"><button className="btn btn-primary" onClick={share}><Icon name="link" className="h-4 w-4" />Share Score</button><button className="btn btn-secondary" onClick={() => start(quiz)}>Retry</button><button className="btn btn-ghost" onClick={() => setMode("list")}>Back to quizzes</button></div>
        {shared && <Notice kind="ok">{shared}</Notice>}
        <ol className="grid gap-2 text-sm">{quiz.questions.map((x, n) => { const ok = answers[x.id] === x.answer; return <li key={x.id} className={`rounded-xl border p-3 ${ok ? "border-emerald-500/40" : "border-red-500/40"}`}><b>{n + 1}. {x.q}</b><br />{ok ? <span className="text-good">✔ {x.options[x.answer]}</span> : <span><span className="text-bad">✖ {answers[x.id] !== undefined ? x.options[answers[x.id]] : "No answer"}</span> · correct: <b>{x.options[x.answer]}</b></span>}</li>; })}</ol>
      </div>
    );
  }
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between"><h3 className="font-display text-xl font-extrabold">Timed MCQ quizzes</h3><button className="btn btn-primary btn-sm" onClick={() => setMode("build")}><Icon name="plus" className="h-4 w-4" />Build a quiz</button></div>
      {data.quizzes.length === 0 && <div className="card p-8 text-center text-muted">No quizzes yet. Build one or press “Load Sample Chapter”.</div>}
      <ul className="grid gap-3 sm:grid-cols-2">{data.quizzes.map((z) => <li key={z.id} className="card flex flex-col gap-2 p-4"><h4 className="font-display font-bold">{z.title}</h4><p className="text-sm text-muted">{z.questions.length} questions · {z.minutes} min</p><div className="mt-auto flex gap-2"><button className="btn btn-primary btn-sm" onClick={() => start(z)}><Icon name="play" className="h-4 w-4" />Start</button><button className="btn btn-ghost btn-sm text-bad" onClick={() => update((d) => ({ ...d, quizzes: d.quizzes.filter((x) => x.id !== z.id) }))}>Delete</button></div></li>)}</ul>
    </div>
  );
}

/* ---------------- Focus ---------------- */
function FocusTab() {
  const { data, update } = useS();
  const [mode, setMode] = useState<"focus" | "short" | "long">("focus");
  const [mins, setMins] = useState({ focus: 25, short: 5, long: 15 });
  const [left, setLeft] = useState(25 * 60);
  const [run, setRun] = useState(false);
  const end = useRef(0);
  const doneRef = useRef<() => void>(() => {});
  doneRef.current = () => {
    setRun(false);
    try {
      const AC = window.AudioContext;
      const c = new AC();
      const o = c.createOscillator();
      o.connect(c.destination);
      o.frequency.value = 880;
      o.start();
      o.stop(c.currentTime + 0.4);
    } catch { /* ignore */ }
    if (mode === "focus") {
      const t = todayKey();
      update((d) => ({ ...d, streak: { days: d.streak.days.includes(t) ? d.streak.days : [...d.streak.days, t].slice(-400), sessions: d.streak.sessions + 1, minutes: d.streak.minutes + mins.focus } }));
    }
  };
  useEffect(() => {
    if (!run) return;
    end.current = Date.now() + left * 1000;
    const t = setInterval(() => {
      const r = Math.max(0, Math.round((end.current - Date.now()) / 1000));
      setLeft(r);
      if (r <= 0) { clearInterval(t); doneRef.current(); }
    }, 250);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);
  const choose = (m: typeof mode) => { setRun(false); setMode(m); setLeft(mins[m] * 60); };
  const total = mins[mode] * 60;
  const streak = streakCount(data.streak.days);
  const last7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return todayKey(d); });
  const R = 70;
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
      <div className="card grid justify-items-center gap-4 p-6">
        <div className="flex gap-2">{(["focus", "short", "long"] as const).map((m) => <button key={m} className="chip" aria-pressed={mode === m} onClick={() => choose(m)}>{m === "focus" ? "Focus" : m === "short" ? "Short break" : "Long break"}</button>)}</div>
        <div className="relative grid h-52 w-52 place-items-center">
          <svg viewBox="0 0 160 160" className="absolute inset-0 -rotate-90" aria-hidden="true"><circle cx="80" cy="80" r={R} className="fill-none stroke-line" strokeWidth="10" /><circle cx="80" cy="80" r={R} className="fill-none stroke-brand" strokeWidth="10" strokeLinecap="round" strokeDasharray={2 * Math.PI * R} strokeDashoffset={2 * Math.PI * R * (1 - left / total)} /></svg>
          <output className="font-display text-5xl font-extrabold tabular-nums" aria-live="off">{String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}</output>
        </div>
        <div className="flex gap-2"><button className="btn btn-primary" onClick={() => setRun(!run)}><Icon name={run ? "pause" : "play"} className="h-4 w-4" />{run ? "Pause" : "Start"}</button><button className="btn btn-secondary" onClick={() => choose(mode)}>Reset</button></div>
        <div className="flex items-center gap-2 text-sm text-muted"><label>Focus length <input type="number" min={1} max={120} className="input !inline-block !w-20 !py-1" value={mins.focus} onChange={(e) => { const v = Math.max(1, Number(e.target.value) || 25); setMins({ ...mins, focus: v }); if (mode === "focus" && !run) setLeft(v * 60); }} /> min</label></div>
      </div>
      <div className="grid content-start gap-3">
        <Stat label="Current streak" value={`${streak} day${streak === 1 ? "" : "s"} 🔥`} sub="Complete one focus session a day to keep it alive" />
        <div className="grid grid-cols-2 gap-3"><Stat label="Sessions" value={data.streak.sessions} /><Stat label="Focus minutes" value={data.streak.minutes} /></div>
        <div className="card p-4"><p className="label">Last 7 days</p><div className="flex gap-1.5">{last7.map((d) => <span key={d} title={d} className={`h-8 flex-1 rounded-md ${data.streak.days.includes(d) ? "bg-brand" : "bg-line"}`} />)}</div></div>
      </div>
    </div>
  );
}
