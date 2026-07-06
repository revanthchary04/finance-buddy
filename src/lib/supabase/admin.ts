import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Service role client bypassing RLS, for admin server actions only
export function createAdminClient() {
  let serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Hot-patch for when the dev server is running and .env.local was updated without a restart
  if (!serviceRoleKey || serviceRoleKey.includes("your_supabase")) {
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
        if (match && match[1]) {
          serviceRoleKey = match[1].trim();
        }
      }
    } catch (e) {
      console.error("Failed to hot-reload service role key:", e);
    }
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
