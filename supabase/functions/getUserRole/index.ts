import { serve } from "https://deno.land/x/sift@0.4.2/mod.ts";
import { createClient } from "https://deno.land/x/supabase@1.0.0/mod.ts";
import "https://deno.land/x/dotenv/load.ts"; // To load the .env file

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_ANON_KEY");

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing Authorization header" }), { status: 400 });
  }

  const token = authHeader.replace("Bearer ", "");
  const { user, error } = await supabase.auth.api.getUser(token);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 401 });
  }

  if (user) {
    return new Response(JSON.stringify({ role: user.role }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }
});
