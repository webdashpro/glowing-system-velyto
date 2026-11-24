import { buildMeta } from "@/lib/seo";
import AuthForm from "@/components/AuthForm";

export const metadata = buildMeta({ title: "Log in", description: "Log in to Velyto to sync your shops, business documents and study data.", path: "/login", noindex: true });

export default function LoginPage() {
  return <div className="hero-bg px-4 py-16 sm:py-24"><AuthForm mode="login" /></div>;
}
