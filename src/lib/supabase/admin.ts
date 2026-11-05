import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../env";

let client: SupabaseClient | null = null;

/** Cliente con llave secreta: solo en servidor, para insertar envíos de formularios (RLS sin acceso público). */
export function supabaseAdmin() {
  if (!env.supabaseUrl || !env.supabaseSecret) return null;
  client ??= createClient(env.supabaseUrl, env.supabaseSecret, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
