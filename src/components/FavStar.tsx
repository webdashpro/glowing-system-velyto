"use client";
import { toggleFav, useStoredList } from "@/lib/client";
import { Icon } from "./Icon";

export default function FavStar({ slug, name }: { slug: string; name: string }) {
  const favs = useStoredList("velyto.favs");
  const on = favs.includes(slug);
  return (
    <button
      type="button"
      onClick={() => toggleFav(slug)}
      aria-pressed={on}
      aria-label={`${on ? "Remove" : "Add"} ${name} ${on ? "from" : "to"} favorites`}
      className={`relative z-10 grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-brand-soft ${on ? "text-amber-500" : "text-muted"}`}
    >
      <Icon name="star" className={`h-[18px] w-[18px] ${on ? "fill-current" : ""}`} />
    </button>
  );
}
