-- supabase/migrations/011_feature_requests.sql

CREATE TABLE IF NOT EXISTS public.feature_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Sent' CHECK (status IN ('Sent', 'In Review', 'Approved', 'Rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.feature_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own feature requests
CREATE POLICY "Users can view their own feature requests" 
    ON public.feature_requests 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Admins can view all feature requests
CREATE POLICY "Admins can view all feature requests" 
    ON public.feature_requests 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Policy: Users can insert their own feature requests
CREATE POLICY "Users can insert their own feature requests" 
    ON public.feature_requests 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can update any feature request
CREATE POLICY "Admins can update all feature requests" 
    ON public.feature_requests 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'super_admin')
        )
    );

-- Trigger to auto-update updated_at
CREATE TRIGGER update_feature_requests_updated_at
    BEFORE UPDATE ON public.feature_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
