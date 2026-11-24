import type { ShopProduct } from "@/db/schema";

export type ShopData = {
  id?: string;
  slug?: string;
  name: string;
  tagline: string;
  city: string;
  category: string;
  currency: string;
  whatsapp: string;
  products: ShopProduct[];
  published?: boolean;
};

export const SHOP_CATEGORIES = ["General", "Food & Bakery", "Fashion & Apparel", "Handmade & Crafts", "Beauty & Wellness", "Electronics", "Home & Decor", "Grocery", "Books & Stationery", "Services", "Other"];

export function slugify(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "shop";
}

export function digits(s: string): string {
  return s.replace(/\D/g, "");
}

export function waLink(number: string, text: string): string {
  return `https://wa.me/${digits(number)}?text=${encodeURIComponent(text)}`;
}

export const DEMO_SHOP: ShopData = {
  name: "Maya's Bakery",
  tagline: "Fresh-baked cakes & breads, made daily",
  city: "Mumbai",
  category: "Food & Bakery",
  currency: "INR",
  whatsapp: "919876543210",
  products: [
    { id: "d1", name: "Berry cake (1 kg)", price: 1450, description: "Vanilla sponge, fresh berries, whipped cream.", emoji: "🎂" },
    { id: "d2", name: "Sourdough loaf", price: 320, description: "48-hour fermented, crusty outside, soft inside.", emoji: "🍞" },
    { id: "d3", name: "Butter croissants (box of 4)", price: 480, description: "Flaky, buttery, baked every morning.", emoji: "🥐" },
    { id: "d4", name: "Chocolate brownies (6)", price: 540, description: "Fudgy, dark chocolate, walnut crunch.", emoji: "🍫" },
  ],
};
