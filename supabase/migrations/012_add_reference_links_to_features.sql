-- supabase/migrations/012_add_reference_links_to_features.sql
ALTER TABLE public.feature_requests 
ADD COLUMN IF NOT EXISTS reference_links TEXT[];

-- Optional: NOTIFY pgrst to reload the schema automatically when this script is run
NOTIFY pgrst, 'reload schema';
