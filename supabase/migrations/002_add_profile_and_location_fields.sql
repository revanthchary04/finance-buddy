-- Add new fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN phone_number TEXT,
ADD COLUMN designation TEXT,
ADD COLUMN company TEXT;

-- Add location field to transactions table
ALTER TABLE public.transactions
ADD COLUMN location TEXT;

-- Create Storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for avatars
-- Allow public read access to avatars
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar."
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid() = owner
  );

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update their own avatar."
  ON storage.objects FOR UPDATE
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid() = owner
  );

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Users can delete their own avatar."
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' 
    AND auth.uid() = owner
  );
