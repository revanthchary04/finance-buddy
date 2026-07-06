-- Backfill profile for admin@sriram.com and elevate to super_admin
INSERT INTO public.profiles (id, full_name, email, role, status)
SELECT 
    id, 
    COALESCE(raw_user_meta_data->>'full_name', 'Sriram Admin'), 
    email,
    'super_admin',
    'approved'
FROM auth.users
WHERE email = 'admin@sriram.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'super_admin', status = 'approved';

-- Backfill any other existing auth users that were missed
INSERT INTO public.profiles (id, full_name, email)
SELECT 
    id, 
    COALESCE(raw_user_meta_data->>'full_name', ''), 
    email
FROM auth.users
ON CONFLICT (id) DO NOTHING;
