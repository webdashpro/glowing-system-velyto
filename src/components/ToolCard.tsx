import Link from "next/link";
import type { Tool } from "@/data/tools";
import { Icon } from "./Icon";
import FavStar from "./FavStar";

export default function ToolCard({ tool, star = true }: { tool: Tool; star?: boolean }) {
  return (
    <div className="card card-hover relative flex items-start gap-3 p-4">
      <span className="icon-tile"><Icon name={tool.icon} /></span>
      <div className="min-w-0 flex-1">
        <h3 className="flex items-center gap-2 font-display text-[0.98rem] font-bold leading-snug">
          <Link href={`/tools/${tool.slug}`} className="after:absolute after:inset-0 after:content-['']">{tool.name}</Link>
          {tool.isNew && <span className="badge-new">New</span>}
        </h3>
        <p className="mt-0.5 text-sm text-muted">{tool.short}</p>
      </div>
      {star && <FavStar slug={tool.slug} name={tool.name} />}
    </div>
  );
}
