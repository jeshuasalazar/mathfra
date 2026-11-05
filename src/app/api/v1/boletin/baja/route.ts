import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

async function baja(req: NextRequest) {
  const t = req.nextUrl.searchParams.get("t") || "";
  const db = supabaseAdmin();
  if (db && /^[A-Za-z0-9_-]{16,64}$/.test(t)) {
    await db.from("suscriptores").update({ estado: "baja", baja_en: new Date().toISOString() }).eq("token_baja", t);
  }
  return Response.redirect(new URL("/boletin/baja", req.url), 303);
}

export const GET = baja;
/** Baja en un clic (RFC 8058, List-Unsubscribe-Post). */
export const POST = baja;
