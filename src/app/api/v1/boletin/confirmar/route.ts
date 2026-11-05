import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { unsubscribeToken } from "@/lib/tokens";
import { site } from "@/content/site";
import { BoletinBienvenida } from "@/emails/templates";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const db = supabaseAdmin();
  let ok = false;
  if (db && /^[A-Za-z0-9_-]{20,64}$/.test(token)) {
    const { data } = await db
      .from("suscriptores")
      .update({ estado: "confirmado", confirmado_en: new Date().toISOString(), token_confirmacion: null })
      .eq("token_confirmacion", token)
      .eq("estado", "pendiente")
      .select("email")
      .maybeSingle();
    if (data?.email) {
      ok = true;
      await sendEmail(data.email, "Ya estás en el boletín · Mathfra", BoletinBienvenida({ unsubscribeUrl: `${site.url}/api/v1/boletin/baja?t=${unsubscribeToken(data.email)}` }));
    }
  }
  return Response.redirect(new URL(ok ? "/boletin/confirmado" : "/boletin/enlace-invalido", req.url), 303);
}
