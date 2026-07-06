import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function signUp() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@sriram.com',
    password: 'Sriram@admin',
    options: {
      data: {
        full_name: 'Sriram Admin'
      }
    }
  })

  if (error) {
    console.error('Error signing up:', error.message)
    process.exit(1)
  }

  console.log('Successfully created user!')
  console.log(data)
}

signUp()
