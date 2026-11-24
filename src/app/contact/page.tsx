import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { PageHeader } from "@/components/Common";
import ContactForm from "@/components/ContactForm";

export const metadata = buildMeta({ title: "Contact Velyto", description: "Questions, feedback or a bug to report? Send Velyto a message.", path: "/contact" });

export default function ContactPage() {
  return (
    <>
      <PageHeader eyebrow="Contact" icon="chat" title="Say hello" sub="Found a bug, have feedback or need an account deleted? Write to us — messages go straight to our database and we read every one." />
      <div className="container-x grid gap-8 py-10 lg:grid-cols-[1fr_20rem]">
        <ContactForm />
        <aside className="grid content-start gap-3 text-sm">
          <div className="card p-4"><h2 className="font-display font-bold">Want a new tool?</h2><p className="mt-1 text-muted">Use the public <Link href="/requests" className="font-semibold text-brand-link underline">request board</Link> so others can vote.</p></div>
          <div className="card p-4"><h2 className="font-display font-bold">Account deletion</h2><p className="mt-1 text-muted">Mention the email you signed up with and we&apos;ll delete your account and saved data.</p></div>
        </aside>
      </div>
    </>
  );
}
