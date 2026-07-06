-- Enable Realtime for the profiles table
BEGIN;
  -- remove the supabase_realtime publication
  DROP PUBLICATION IF EXISTS supabase_realtime;

  -- re-create the publication
  CREATE PUBLICATION supabase_realtime;
COMMIT;

-- add table to publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
