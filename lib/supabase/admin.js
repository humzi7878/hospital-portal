import { createClient } from '@supabase/supabase-js';

// Sirf server par use karein. Service role key kabhi browser mein nahi jani chahiye.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
