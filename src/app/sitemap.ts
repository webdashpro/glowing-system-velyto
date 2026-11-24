import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";
import { TOOLS } from "@/data/tools";
import { EXAMS } from "@/data/exams";
import { GUIDES } from "@/data/guides";
import { HI_SLUGS } from "@/data/hi-tools";
import { BUSINESS_DOCS } from "@/data/business";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date("2026-05-12");
  const core = ["/", "/tools", "/media", "/shop", "/shops", "/study", "/study/planner", "/study/resume-builder", "/business", "/pricing", "/guides", "/about", "/changelog", "/requests", "/privacy", "/terms", "/contact"];
  const entries: MetadataRoute.Sitemap = [];

  for (const p of core) {
    entries.push({
      url: abs(p),
      lastModified: now,
      changeFrequency: p === "/" ? "weekly" : "monthly",
      priority: p === "/" ? 1 : 0.8,
      ...(p === "/" ? { alternates: { languages: { en: abs("/"), hi: abs("/hi"), "x-default": abs("/") } } } : {}),
    });
  }
  entries.push({ url: abs("/hi"), lastModified: now, changeFrequency: "monthly", priority: 0.7, alternates: { languages: { en: abs("/"), hi: abs("/hi") } } });

  for (const d of BUSINESS_DOCS) entries.push({ url: abs(`/business/${d.slug}`), lastModified: now, changeFrequency: "monthly", priority: 0.7 });
  for (const t of TOOLS) {
    const hasHi = HI_SLUGS.includes(t.slug);
    entries.push({
      url: abs(`/tools/${t.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: t.popular ? 0.9 : 0.7,
      ...(hasHi ? { alternates: { languages: { en: abs(`/tools/${t.slug}`), hi: abs(`/hi/tools/${t.slug}`) } } } : {}),
    });
  }
  for (const s of HI_SLUGS) entries.push({ url: abs(`/hi/tools/${s}`), lastModified: now, changeFrequency: "monthly", priority: 0.6, alternates: { languages: { en: abs(`/tools/${s}`), hi: abs(`/hi/tools/${s}`) } } });
  for (const e of EXAMS) entries.push({ url: abs(`/tools/exam-photo-resizer/${e.slug}`), lastModified: now, changeFrequency: "monthly", priority: 0.8 });
  for (const g of GUIDES) entries.push({ url: abs(`/guides/${g.slug}`), lastModified: new Date(g.updated), changeFrequency: "monthly", priority: 0.7 });
  return entries;
}
