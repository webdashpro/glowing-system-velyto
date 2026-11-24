import Script from "next/script";
import { PLAUSIBLE_DOMAIN } from "@/lib/site";

/** Privacy-friendly analytics. Renders nothing unless NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set. */
export default function Analytics() {
  if (!PLAUSIBLE_DOMAIN) return null;
  return <Script defer data-domain={PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" strategy="afterInteractive" />;
}
