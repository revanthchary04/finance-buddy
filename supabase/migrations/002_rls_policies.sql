-- Profiles: users read own, admins read all, super_admin writes
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (
        (auth.jwt() ->> 'user_role') IN ('admin', 'super_admin')
    );

CREATE POLICY "Super admins can update any profile" ON public.profiles
    FOR UPDATE USING (
        (auth.jwt() ->> 'user_role') = 'super_admin'
    );

-- Transactions: users CRUD own only
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own transactions" ON public.transactions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.transactions
    FOR SELECT USING (
        (auth.jwt() ->> 'user_role') IN ('admin', 'super_admin')
    );

-- Categories: users CRUD own, read global
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own and global categories" ON public.categories
    FOR SELECT USING (auth.uid() = user_id OR is_global = true);

CREATE POLICY "Users manage own categories" ON public.categories
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins manage global categories" ON public.categories
    FOR ALL USING (
        (auth.jwt() ->> 'user_role') IN ('admin', 'super_admin')
    );

-- Budgets: users CRUD own only
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own budgets" ON public.budgets
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all budgets" ON public.budgets
    FOR SELECT USING (
        (auth.jwt() ->> 'user_role') IN ('admin', 'super_admin')
    );

-- Audit log: only admins can view, no one can update/delete directly
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON public.audit_log
    FOR SELECT USING (
        (auth.jwt() ->> 'user_role') IN ('admin', 'super_admin')
    );

CREATE POLICY "System inserts audit logs" ON public.audit_log
    FOR INSERT WITH CHECK (true); -- Usually restricted by server-side logic bypassing RLS
