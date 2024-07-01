// supabase/functions/_shared/supabaseClient.ts
import { createClient } from 'https://deno.land/x/supabase@1.0.0/mod.ts'

export const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_ANON_KEY') || ''
)
