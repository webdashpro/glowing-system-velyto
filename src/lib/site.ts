export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://velyto.netlify.app").replace(/\/+$/, "");
export const SITE_NAME = "Velyto";
export const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION || "";
export const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "";
/** Content freshness date used for dateModified / "Last updated". */
export const LAST_UPDATED = "2026-05-12";
export const LAST_UPDATED_LABEL = "12 May 2026";
export const AUTHOR = "Velyto Editorial Team";

export function abs(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
