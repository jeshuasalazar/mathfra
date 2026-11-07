import type { NextRequest } from "next/server";
import { entorno } from "@/lib/prospeccion/config.ts";
import { leerTokenBaja } from "@/lib/prospeccion/legal.ts";
import { conectar, darDeBaja } from "@/lib/prospeccion/repo.ts";

/** Baja en un clic de la prospección: entra a la lista permanente al instante. */
async function baja(req: NextRequest) {
  const env = entorno();
  const t = req.nextUrl.searchParams.get("t") || "";
  const correo = env.secreto && t.length < 400 ? leerTokenBaja(t, env.secreto) : undefined;
  let ok = false;
  if (correo) {
    try {
      await darDeBaja(conectar(env), correo, "enlace");
      ok = true;
    } catch (e) {
      console.error("[prospección] baja falló", (e as Error).message);
    }
  }
  return Response.redirect(new URL(ok ? "/prospeccion/baja" : "/prospeccion/baja/error", req.url), 303);
}

export const GET = baja;
/** RFC 8058 (List-Unsubscribe-Post: One-Click). */
export const POST = baja;
