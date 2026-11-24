import { buildMeta } from "@/lib/seo";
import { PageHeader } from "@/components/Common";

export const metadata = buildMeta({ title: "Privacy Policy", description: "How Velyto handles your data: browser-first tools, minimal cloud data, no ads and no trackers by default.", path: "/privacy" });

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" sub="Last updated: 12 May 2026" />
      <div className="container-x py-10">
        <div className="prose-v mx-auto max-w-3xl">
          <h2>The short version</h2>
          <p>Velyto&apos;s tools are browser-first. Images, PDFs, video, audio, text and calculator inputs are processed on your own device and are never uploaded to our servers. We store data only when you create an account and choose to save or publish something.</p>
          <h2>What we store when you have an account</h2>
          <ul>
            <li><strong>Account:</strong> your email, optional name and a salted scrypt hash of your password (we cannot read your password).</li>
            <li><strong>Session:</strong> an HTTP-only, secure cookie containing a random token. Only a hash of the token is stored in our database.</li>
            <li><strong>Shop:</strong> shop details and products you publish, plus view and WhatsApp-click counters. Published shops are public by design.</li>
            <li><strong>Business:</strong> documents and clients you choose to save.</li>
            <li><strong>Study:</strong> notes, flashcards, quizzes, streaks, planner and resume draft you sync.</li>
            <li><strong>Community:</strong> waitlist email, tool requests and votes, and messages you send via the contact form.</li>
          </ul>
          <h2>What we do not do</h2>
          <ul><li>We do not upload or inspect files you process with the tools.</li><li>We do not sell personal data or show ads.</li><li>We do not use third-party scripts by default.</li></ul>
          <h2>Local storage and cookies</h2>
          <p>Guest drafts (shop draft, study data, invoices, to-do list, favourites, theme choice) are kept in your browser&apos;s localStorage. The only cookie is the session cookie, set when you log in.</p>
          <h2>Optional analytics</h2>
          <p>If the site operator enables Plausible, it records anonymous, cookie-free page-view statistics. When it is not configured, no analytics code loads.</p>
          <h2>Counters and rate limits</h2>
          <p>Shop view and click counters and abuse-prevention rate limits use your IP address transiently in server memory; we don&apos;t store IP addresses in the database.</p>
          <h2>Your choices</h2>
          <p>You can clear local data from your browser at any time, delete saved shops and documents from your dashboard, and ask us to delete your account entirely through the <a href="/contact">contact form</a>.</p>
          <h2>Children</h2>
          <p>Velyto is not directed to children under 13, and accounts should be created by people who are old enough to consent in their country.</p>
          <h2>Changes</h2>
          <p>If this policy changes materially, we will update the date above and note it in the <a href="/changelog">changelog</a>.</p>
        </div>
      </div>
    </>
  );
}
