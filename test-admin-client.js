const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log("Key:", process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 15) + "..." : "missing");
try {
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  adminClient.from("profiles").select("*").limit(1).then(res => {
    console.log("Result:", res);
  }).catch(err => console.error("Catch:", err));
} catch(err) {
  console.error("Sync Error:", err);
}
