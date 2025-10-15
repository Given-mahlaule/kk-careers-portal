-- =====================================================
-- Storage Bucket Policies for Documents
-- =====================================================

-- Allow anonymous users to upload files to documents bucket
CREATE POLICY "Allow anonymous uploads" ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'documents');

-- Allow anonymous users to download files from documents bucket  
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT 
USING (bucket_id = 'documents');

-- Optional: Allow file updates (if needed later)
CREATE POLICY "Allow file updates" ON storage.objects
FOR UPDATE 
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');

-- Optional: Allow file deletion (if needed later)
CREATE POLICY "Allow file deletion" ON storage.objects
FOR DELETE 
USING (bucket_id = 'documents');