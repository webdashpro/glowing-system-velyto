"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, useDebounced, useUser, type ClientUser } from "./client";
import { todayKey as _tk } from "./streak";
void _tk;

export type Note = { id: string; title: string; body: string; updated: number };
export type Card = { id: string; front: string; back: string; known?: boolean };
export type QuizQ = { id: string; q: string; options: string[]; answer: number };
export type Quiz = { id: string; title: string; minutes: number; questions: QuizQ[] };
export type Streak = { days: string[]; sessions: number; minutes: number };
export type PlanItem = { id: string; day: number; start: string; end: string; subject: string; color: string };
export type ResumeData = {
  name: string; headline: string; email: string; phone: string; location: string; links: string; summary: string;
  experience: { id: string; role: string; org: string; period: string; bullets: string }[];
  education: { id: string; degree: string; school: string; period: string; detail: string }[];
  skills: string; extras: string;
};
export type StudyData = { notes: Note[]; cards: Card[]; quizzes: Quiz[]; streak: Streak; planner: PlanItem[]; resume: ResumeData | null; updatedAt: number };

export const EMPTY_STUDY: StudyData = { notes: [], cards: [], quizzes: [], streak: { days: [], sessions: 0, minutes: 0 }, planner: [], resume: null, updatedAt: 0 };

const KEY = "velyto.study.v1";
export type SyncState = "loading" | "guest" | "syncing" | "synced" | "error";

const hasContent = (d: StudyData) => d.notes.length + d.cards.length + d.quizzes.length + d.planner.length > 0 || d.streak.sessions > 0 || !!d.resume;
export const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export { todayKey, streakCount } from "./streak";

export function useStudy(): { data: StudyData; update: (fn: (d: StudyData) => StudyData) => void; ready: boolean; sync: SyncState; user: ClientUser | null | undefined } {
  const user = useUser();
  const [data, setData] = useState<StudyData>(EMPTY_STUDY);
  const [ready, setReady] = useState(false);
  const [sync, setSync] = useState<SyncState>("loading");
  const ref = useRef<StudyData>(EMPTY_STUDY);
  const userRef = useRef<ClientUser | null | undefined>(undefined);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = { ...EMPTY_STUDY, ...JSON.parse(raw) } as StudyData;
        ref.current = d;
        setData(d);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const push = useCallback(async (d: StudyData) => {
    setSync("syncing");
    const r = await api("/api/study", "PUT", { data: d });
    setSync(r.ok ? "synced" : "error");
  }, []);
  const pushSoon = useDebounced(push, 1500);

  useEffect(() => {
    if (!ready || user === undefined) return;
    if (!user) {
      setSync("guest");
      return;
    }
    setSync("syncing");
    api<{ data: StudyData | null }>("/api/study").then((r) => {
      if (!r.ok) return setSync(r.status === 503 ? "guest" : "error");
      const server = r.data.data;
      const local = ref.current;
      if (server && (server.updatedAt || 0) > (local.updatedAt || 0)) {
        const merged = { ...EMPTY_STUDY, ...server };
        ref.current = merged;
        setData(merged);
        try {
          localStorage.setItem(KEY, JSON.stringify(merged));
        } catch {
          /* ignore */
        }
        setSync("synced");
      } else if (hasContent(local)) push(local);
      else setSync("synced");
    });
  }, [ready, user, push]);

  const update = useCallback(
    (fn: (d: StudyData) => StudyData) => {
      const next = { ...fn(ref.current), updatedAt: Date.now() };
      ref.current = next;
      setData(next);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      if (userRef.current) pushSoon(next);
    },
    [pushSoon],
  );

  return { data, update, ready, sync, user };
}

export function SAMPLE(): Pick<StudyData, "notes" | "cards" | "quizzes"> {
  return {
    notes: [{ id: uid(), title: "Photosynthesis (Class 10 Biology)", updated: Date.now(), body: "Photosynthesis: The process by which green plants make glucose from carbon dioxide and water using light energy.\nChlorophyll: The green pigment in chloroplasts that absorbs sunlight, mainly red and blue light.\nStomata: Tiny pores on the leaf surface that let carbon dioxide in and oxygen out.\nLight reaction: The first stage, in the thylakoid membranes, where light splits water and makes ATP and NADPH.\nCalvin cycle: The second stage, in the stroma, where carbon dioxide is fixed into glucose using ATP and NADPH.\nEquation: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2.\n\nPhotosynthesis is the foundation of almost every food chain because it converts light into chemical energy that plants store as sugar. Rate of photosynthesis depends on light intensity, carbon dioxide concentration and temperature. Without chlorophyll, plants cannot capture light efficiently, so leaves look pale and growth is slow." }],
    cards: [
      ["What is photosynthesis?", "Making glucose from CO₂ and water using light energy."],
      ["Which pigment absorbs light in plants?", "Chlorophyll."],
      ["What are stomata?", "Tiny leaf pores for gas exchange."],
      ["Where does the Calvin cycle occur?", "In the stroma of the chloroplast."],
      ["What do the light reactions produce?", "ATP, NADPH and oxygen."],
      ["Name 3 factors affecting the rate of photosynthesis.", "Light intensity, CO₂ concentration, temperature."],
    ].map(([front, back]) => ({ id: uid(), front, back })),
    quizzes: [{ id: uid(), title: "Photosynthesis quick quiz", minutes: 3, questions: [
      { id: uid(), q: "Which gas is released as a by-product of photosynthesis?", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], answer: 1 },
      { id: uid(), q: "Where do the light reactions take place?", options: ["Stroma", "Mitochondria", "Thylakoid membranes", "Nucleus"], answer: 2 },
      { id: uid(), q: "What is the main product of the Calvin cycle?", options: ["Glucose", "Oxygen", "Water", "Chlorophyll"], answer: 0 },
      { id: uid(), q: "Stomata mainly help with…", options: ["Absorbing water", "Gas exchange", "Making pigments", "Storing starch"], answer: 1 },
    ] }],
  };
}
