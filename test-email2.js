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
    console.log("Testing signInWithOtp for: rudrakshabhanuprasad62@gmail.com");
    const { data, error } = await adminClient.auth.signInWithOtp({
      email: 'rudrakshabhanuprasad62@gmail.com'
    });
    console.log("Otp Response:", data, error);
  } catch (e) {
    console.error("Catch Error:", e);
  }
}
test();
