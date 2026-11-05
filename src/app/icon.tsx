import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og-fonts";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Ícono: la «M» de la marca con el cuadrito acento (no es un logotipo nuevo, es la marca tipográfica). */
export default async function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1E5EFF", color: "#FFFFFF", fontFamily: "Archivo Black", fontSize: 340, borderRadius: 96 }}>
        M<div style={{ width: 70, height: 70, background: "#22C3A6", border: "12px solid #0E1726", marginTop: 150, marginLeft: 6 }} />
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
