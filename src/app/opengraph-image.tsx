import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og-fonts";
import { areas } from "@/content/examen";

export const alt = "Mathfra · Tu primera opción se gana en las áreas difíciles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Vista previa al compartir por WhatsApp: titular + mapa de áreas (tokens del sistema). */
export default async function Image() {
  const ink = "#0E1726", accent = "#22C3A6", bg = "#F6F8FC";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: bg, color: ink, padding: 64, gap: 48, fontFamily: "Archivo" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1.25 }}>
          <div style={{ display: "flex", alignItems: "flex-end", fontFamily: "Archivo Black", fontSize: 40 }}>
            Mathfra<div style={{ width: 16, height: 16, background: accent, border: `3px solid ${ink}`, marginLeft: 4, marginBottom: 10 }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", fontFamily: "Archivo Black", fontSize: 72, lineHeight: 0.98, letterSpacing: -2 }}>
            Tu primera opción se gana en las&nbsp;
            <span style={{ background: `linear-gradient(transparent 58%, ${accent} 58%, ${accent} 96%, transparent 96%)` }}>áreas difíciles.</span>
          </div>
          <div style={{ fontSize: 28 }}>Curso de ingreso ECOEMS · Santa Clara</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, background: "#FFFFFF", border: `4px solid ${ink}`, borderRadius: 16, boxShadow: `8px 8px 0 0 ${ink}`, padding: 24, gap: 4 }}>
          {areas.map((a, i) => (
            <div key={a.slug} style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 22, padding: "5px 10px", borderRadius: 6, background: a.focus ? accent : "transparent", border: a.focus ? `2px solid ${ink}` : "2px solid transparent", color: a.focus ? ink : "#46536B" }}>
              <span style={{ fontSize: 16, width: 26 }}>{String(i + 1).padStart(2, "0")}</span>{a.name}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
