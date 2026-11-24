import { buildMeta } from "@/lib/seo";
import AuthForm from "@/components/AuthForm";

export const metadata = buildMeta({ title: "Create a free account", description: "Create a free Velyto account to publish shops and sync business documents and study data.", path: "/signup", noindex: true });

export default function SignupPage() {
  return <div className="hero-bg px-4 py-16 sm:py-24"><AuthForm mode="signup" /></div>;
}
