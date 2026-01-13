-- =====================================================
-- Construxa - Storage Bucket Setup
-- =====================================================
-- This script sets up the storage bucket and RLS policies for file uploads.
-- Run this in the Supabase SQL Editor AFTER creating the 'drawings' bucket.

-- =====================================================
-- STORAGE BUCKET POLICIES
-- =====================================================
-- Note: First create the 'drawings' bucket in the Supabase Storage UI
-- Then run these policies

-- Allow authenticated users to upload files to their own folders
CREATE POLICY "Users can upload to their own folders"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'drawings' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to view their own files
CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'drawings'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'drawings'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'drawings'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Verify policies were created
SELECT 
  policyname,
  cmd,
  tablename
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
ORDER BY policyname;
