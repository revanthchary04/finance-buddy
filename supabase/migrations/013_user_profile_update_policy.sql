-- supabase/migrations/013_user_profile_update_policy.sql
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Notify postgrest to reload the schema (optional but good practice)
NOTIFY pgrst, 'reload schema';
