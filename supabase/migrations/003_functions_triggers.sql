-- Auto-create profile on signup
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_budgets_updated_at
    BEFORE UPDATE ON public.budgets
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Dashboard stats aggregation
-- SECURITY DEFINER runs this function with the privileges of the creator (postgres).
-- Ensure this is only used for aggregation and cannot be exploited to view others' data.
CREATE FUNCTION public.get_dashboard_stats(p_user_id UUID)
RETURNS JSON AS $$
    SELECT json_build_object(
        'total_income', COALESCE(SUM(CASE WHEN type='income' THEN amount END), 0),
        'total_expenses', COALESCE(SUM(CASE WHEN type='expense' THEN amount END), 0),
        'net_balance', COALESCE(SUM(CASE WHEN type='income' THEN amount ELSE -amount END), 0),
        'transaction_count', COUNT(*)
    )
    FROM public.transactions
    WHERE user_id = p_user_id
    AND date >= date_trunc('month', CURRENT_DATE);
$$ LANGUAGE sql SECURITY DEFINER;
