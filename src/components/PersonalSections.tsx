"use client";
import Link from "next/link";
import { useStoredList } from "@/lib/client";
import { TOOLS } from "@/data/tools";
import { Icon } from "./Icon";

function Row({ title, slugs, icon }: { title: string; slugs: string[]; icon: "clock" | "star" }) {
  const tools = slugs.map((s) => TOOLS.find((t) => t.slug === s)).filter((t): t is (typeof TOOLS)[number] => Boolean(t));
  if (!tools.length) return null;
  return (
    <div>
      <h2 className="mb-3 flex items-center gap-2 text-lg font-bold"><Icon name={icon} className="h-5 w-5 text-brand-link" />{title}</h2>
      <ul className="flex flex-wrap gap-2">
        {tools.map((t) => (
          <li key={t.slug}><Link href={`/tools/${t.slug}`} className="chip"><Icon name={t.icon} className="h-4 w-4 text-brand-link" />{t.name}</Link></li>
        ))}
      </ul>
    </div>
  );
}

/** Renders nothing at all for first-time visitors — no empty boxes. */
export default function PersonalSections() {
  const recent = useStoredList("velyto.recent");
  const favs = useStoredList("velyto.favs");
  if (!recent.length && !favs.length) return null;
  return (
    <section aria-label="Your tools" className="container-x pt-10">
      <div className="card grid gap-6 p-5 sm:p-6">
        <Row title="Recently used" slugs={recent} icon="clock" />
        <Row title="Your favorites" slugs={favs} icon="star" />
      </div>
    </section>
  );
}
