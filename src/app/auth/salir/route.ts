import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  await supabase?.auth.signOut();
  return Response.redirect(new URL("/", req.url), 303);
}
