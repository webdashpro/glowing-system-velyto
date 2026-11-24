import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  const m = name.match(/^icon-(\d{2,3})(-maskable)?\.png$/);
  if (!m) return new Response("Not found", { status: 404 });
  const size = Math.min(Math.max(parseInt(m[1], 10), 48), 512);
  const maskable = Boolean(m[2]);
  const glyph = Math.round(size * (maskable ? 0.46 : 0.62));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
          borderRadius: maskable ? 0 : Math.round(size * 0.28),
          color: "#fff",
          fontSize: glyph,
          fontWeight: 800,
        }}
      >
        V
      </div>
    ),
    { width: size, height: size, headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  );
}
