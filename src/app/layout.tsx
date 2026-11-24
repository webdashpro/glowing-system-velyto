import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PwaClient from "@/components/PwaClient";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, GSC_VERIFICATION } from "@/lib/site";
import { ogUrl } from "@/lib/seo";

const DESC = "Velyto: 34 free browser-first tools plus Shop, Study, Business and Media. Resize exam photos, compress images, make PDFs, calculate GST — zero uploads, free forever.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Velyto — Free Tools, Shop, Study & Business | 100% Browser-First", template: "%s | Velyto" },
  description: DESC,
  applicationName: "Velyto",
  manifest: "/manifest.json",
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: [{ url: "/icons/icon-180.png", sizes: "180x180" }] },
  verification: GSC_VERIFICATION ? { google: GSC_VERIFICATION } : undefined,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Velyto",
    title: "Velyto — Free Tools, Shop, Study & Business",
    description: DESC,
    url: SITE_URL,
    images: [{ url: ogUrl("Free tools. Zero uploads.", "100% Browser-First · Free Forever"), width: 1200, height: 630, type: "image/png", alt: "Velyto — 100% browser-first free tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velyto — Free Tools, Shop, Study & Business",
    description: DESC,
    images: [{ url: ogUrl("Free tools. Zero uploads.", "100% Browser-First · Free Forever"), alt: "Velyto — 100% browser-first free tools" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#080e1d" },
  ],
};

const themeScript = `try{var t=localStorage.getItem('velyto-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-bg text-fg antialiased">
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <PwaClient />
        <Analytics />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "Organization", "@id": `${SITE_URL}/#org`, name: "Velyto", url: SITE_URL, logo: `${SITE_URL}/icons/icon-512.png`, description: DESC },
              { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: "Velyto", publisher: { "@id": `${SITE_URL}/#org` }, inLanguage: ["en", "hi"] },
            ],
          }}
        />
      </body>
    </html>
  );
}
