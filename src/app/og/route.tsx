import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const title = (sp.get("title") || "Free tools. Zero uploads.").slice(0, 90);
  const sub = (sp.get("sub") || "100% Browser-First · Zero Uploads · Free Forever").slice(0, 100);
  const size = title.length > 55 ? 58 : title.length > 32 ? 72 : 88;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "#fff",
          background: "linear-gradient(135deg,#1e40af 0%,#2563eb 55%,#38bdf8 120%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#1d4ed8", fontSize: 44, fontWeight: 800 }}>V</div>
          <div style={{ fontSize: 40, fontWeight: 800 }}>Velyto</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: size, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>{title}</div>
          <div style={{ fontSize: 32, opacity: 0.9 }}>{sub}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, opacity: 0.85 }}>
          <div>Tools · Media · Shop · Study · Business</div>
          <div>velyto.netlify.app</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    },
  );
}
