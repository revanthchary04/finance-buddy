
-- Create a custom access token (JWT) hook to inject user role
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
AS $$
  DECLARE
    claims jsonb;
    user_role TEXT;
  BEGIN
    -- Fetch the user role in the profiles table
    SELECT role INTO user_role FROM public.profiles WHERE id = (event->>'user_id')::uuid;

    claims := event->'claims';

    IF user_role IS NOT NULL THEN
      -- Set the claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    ELSE
      claims := jsonb_set(claims, '{user_role}', '"user"');
    END IF;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    RETURN event;
  END;
$$;

-- Grant execution to supabase_auth_admin
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;
