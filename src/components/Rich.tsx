import Link from "next/link";
import type { ReactNode } from "react";

/** Renders [text](/internal-link) markup into Next links. */
export default function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\((\/[^)\s]*|https?:\/\/[^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(m[2].startsWith("/") ? <Link key={k++} href={m[2]}>{m[1]}</Link> : <a key={k++} href={m[2]} rel="noopener noreferrer" target="_blank">{m[1]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
