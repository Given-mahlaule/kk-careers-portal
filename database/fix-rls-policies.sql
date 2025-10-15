-- =====================================================
-- FIX RLS Policies - Remove dependency on auth.users table
-- =====================================================

-- First, drop all existing policies on applications
DROP POLICY IF EXISTS "Allow authenticated inserts" ON applications;
DROP POLICY IF EXISTS "Allow reading own applications" ON applications;
DROP POLICY IF EXISTS "Allow admins to read all applications" ON applications;
DROP POLICY IF EXISTS "Allow admins to update applications" ON applications;

-- =====================================================
-- Policy 1: Allow authenticated users to insert their own applications
-- =====================================================
CREATE POLICY "Users can insert own applications" ON applications
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- Policy 2: Allow users to read their own applications
-- =====================================================
CREATE POLICY "Users can read own applications" ON applications
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

-- =====================================================
-- Policy 3: Allow admins to read ALL applications
-- (Checks role in the current user's JWT metadata)
-- =====================================================
CREATE POLICY "Admins can read all applications" ON applications
    FOR SELECT 
    TO authenticated
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- =====================================================
-- Policy 4: Allow admins to update ALL applications
-- (Checks role in the current user's JWT metadata)
-- =====================================================
CREATE POLICY "Admins can update all applications" ON applications
    FOR UPDATE
    TO authenticated
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
    WITH CHECK (true);

-- =====================================================
-- Verify the policies were created
-- =====================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'applications'
ORDER BY policyname;
