-- supabase/migrations/010_add_missing_columns.sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS designation TEXT,
ADD COLUMN IF NOT EXISTS company TEXT;

ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS location TEXT;
