require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function test() {
  try {
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: { autoRefreshToken: false, persistSession: false }
      }
    );
    const { data: users, error: dbErr } = await adminClient.from("profiles").select("*").limit(2);
    console.log("Users:", users);

    if (users && users.length > 0) {
      const email = users[0].email;
      console.log("Testing signInWithOtp for:", email);
      const { data, error } = await adminClient.auth.signInWithOtp({
        email: email
      });
      console.log("Otp Response:", data, error);
    }
  } catch (e) {
    console.error("Catch Error:", e);
  }
}
test();
