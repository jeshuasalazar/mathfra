import "server-only";
import { supabaseServer } from "@/lib/supabase/server";
import { entorno } from "./config.ts";

/** Devuelve el correo del administrador con sesión, o null. Solo entran los correos de PROSPECCION_ADMINS. */
export async function adminActual(): Promise<string | null> {
  const admins = entorno().admins;
  if (!admins.length) return null;
  const supabase = await supabaseServer();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase();
  return email && admins.includes(email) ? email : null;
}
