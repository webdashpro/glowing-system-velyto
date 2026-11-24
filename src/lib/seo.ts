import type { Metadata } from "next";
import { abs } from "./site";

type MetaInput = {
  title: string;
  description: string;
  path: string;
  ogSub?: string;
  languages?: Record<string, string>;
  type?: "website" | "article";
  noindex?: boolean;
  absoluteTitle?: boolean;
};

export function ogUrl(title: string, sub?: string): string {
  const q = new URLSearchParams({ title });
  if (sub) q.set("sub", sub);
  return `/og?${q.toString()}`;
}

export function buildMeta(i: MetaInput): Metadata {
  const alt = `${i.title} — Velyto`;
  const image = ogUrl(i.title, i.ogSub);
  return {
    title: i.absoluteTitle ? { absolute: i.title } : i.title,
    description: i.description,
    alternates: {
      canonical: abs(i.path),
      ...(i.languages ? { languages: i.languages } : {}),
    },
    robots: i.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: i.type ?? "website",
      siteName: "Velyto",
      title: i.title,
      description: i.description,
      url: abs(i.path),
      images: [{ url: image, width: 1200, height: 630, type: "image/png", alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: i.title,
      description: i.description,
      images: [{ url: image, alt }],
    },
  };
}
