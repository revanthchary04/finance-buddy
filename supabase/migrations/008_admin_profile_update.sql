-- Allow admins and super_admins to update any profile (roles & statuses)
DROP POLICY IF EXISTS "Super admins can update any profile" ON public.profiles;

CREATE POLICY "Admins and super admins can update profiles" ON public.profiles
    FOR UPDATE USING (
        (auth.jwt() ->> 'user_role') IN ('admin', 'super_admin')
    );
