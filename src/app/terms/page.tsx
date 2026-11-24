import { buildMeta } from "@/lib/seo";
import { PageHeader } from "@/components/Common";

export const metadata = buildMeta({ title: "Terms of Use", description: "The terms for using Velyto's free tools, Shop, Study and Business products.", path: "/terms" });

export default function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Use" sub="Last updated: 12 May 2026" />
      <div className="container-x py-10">
        <div className="prose-v mx-auto max-w-3xl">
          <h2>Using Velyto</h2>
          <p>By using Velyto you agree to these terms. Velyto provides free browser-based tools and optional account features &quot;as is&quot;, without warranties of any kind.</p>
          <h2>Accuracy of results</h2>
          <p>Calculators, converters, exam photo presets and document generators are aids, not professional advice. Exam specifications, tax rules and grading formulas change, so always confirm with the official source, your accountant or institution. You are responsible for what you submit or send.</p>
          <h2>Your content</h2>
          <p>You own your content. If you publish a shop, you grant us permission to display it publicly at its link and in the Shop Directory. You are responsible for the products, prices and claims in your shop and for fulfilling orders agreed on WhatsApp; Velyto is not a party to those transactions.</p>
          <h2>Acceptable use</h2>
          <ul><li>Don&apos;t publish illegal, deceptive, infringing or harmful content.</li><li>Don&apos;t attempt to disrupt, scrape at abuse levels or break into the service.</li><li>Don&apos;t use the tools to forge documents or misrepresent your identity.</li></ul>
          <p>We may remove content or suspend accounts that violate these terms.</p>
          <h2>Accounts</h2>
          <p>Keep your password safe. You can delete saved data from your dashboard or ask us to delete your account through the <a href="/contact">contact form</a>.</p>
          <h2>Availability and changes</h2>
          <p>We aim for reliability but cannot guarantee uninterrupted service. Features may change. Everything free today is intended to stay free; any future paid plan will be optional and announced in advance.</p>
          <h2>Liability</h2>
          <p>To the extent permitted by law, Velyto is not liable for indirect or consequential losses, or for losses arising from reliance on tool output, such as rejected applications or tax errors.</p>
          <h2>Contact</h2>
          <p>Questions? Use the <a href="/contact">contact page</a>.</p>
        </div>
      </div>
    </>
  );
}
