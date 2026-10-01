import { ImageResponse } from "next/og";

export const alt = "Hitesh Khatana, full-stack engineer (LLM and RAG)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  const dots = Array.from({ length: 90 }, (_, i) => {
    const a = i * 2.39996, r = 18 + Math.sqrt(i) * 24;
    return { x: 860 + Math.cos(a) * r, y: 315 + Math.sin(a) * r * 0.8, amber: i % 11 === 3 };
  });
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F3EEE4", color: "#1D1C19", position: "relative", fontFamily: "sans-serif" }}>
        {dots.map((d, i) => (
          <div key={i} style={{ position: "absolute", left: d.x, top: d.y, width: d.amber ? 12 : 7, height: d.amber ? 12 : 7, borderRadius: 99, background: d.amber ? "#B4471F" : "#3E5C8A", opacity: d.amber ? 1 : 0.5 }} />
        ))}
        <div style={{ position: "absolute", left: 854, top: 309, width: 18, height: 18, borderRadius: 99, background: "#1F5D50" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", width: 720 }}>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>Hitesh</div>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1, letterSpacing: -2 }}>Khatana</div>
          <div style={{ fontSize: 32, marginTop: 36, color: "#6A6459", lineHeight: 1.3 }}>
            Full-stack engineer who ships LLM-powered products to production.
          </div>
          <div style={{ fontSize: 24, marginTop: 28, color: "#1F5D50" }}>hiteshkhatana.com</div>
        </div>
      </div>
    ),
    size
  );
}
