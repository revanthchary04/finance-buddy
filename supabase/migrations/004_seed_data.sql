-- Seed default global categories
INSERT INTO public.categories (name, type, is_global, icon, color) VALUES
    ('Salary', 'income', true, 'Briefcase', '#10b981'),
    ('Freelance', 'income', true, 'Laptop', '#3b82f6'),
    ('Investments', 'income', true, 'TrendingUp', '#8b5cf6'),
    ('Housing', 'expense', true, 'Home', '#ef4444'),
    ('Food & Dining', 'expense', true, 'Utensils', '#f59e0b'),
    ('Transportation', 'expense', true, 'Car', '#6366f1'),
    ('Utilities', 'expense', true, 'Zap', '#0ea5e9'),
    ('Entertainment', 'expense', true, 'Film', '#ec4899'),
    ('Shopping', 'expense', true, 'ShoppingBag', '#f43f5e'),
    ('Healthcare', 'expense', true, 'HeartPulse', '#14b8a6')
ON CONFLICT DO NOTHING;

-- To set the first super admin, run this query manually after creating a user:
-- UPDATE public.profiles SET role = 'super_admin', status = 'approved' WHERE email = 'your-email@example.com';
