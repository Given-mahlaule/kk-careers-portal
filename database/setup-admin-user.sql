-- =====================================================
-- Set Up Admin User
-- =====================================================
-- Run this script in Supabase SQL Editor to grant admin privileges

-- =====================================================
-- OPTION 1: Set admin role for existing user by email
-- =====================================================
-- Replace 'admin@kklabourservices.co.za' with your admin email

UPDATE auth.users 
SET raw_user_meta_data = 
    CASE 
        WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
        ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
    END
WHERE email = 'admin@kklabourservices.co.za';

-- =====================================================
-- OPTION 2: Set admin role for current user (if signed in)
-- =====================================================
-- UPDATE auth.users 
-- SET raw_user_meta_data = 
--     CASE 
--         WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
--         ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
--     END
-- WHERE id = auth.uid();

-- =====================================================
-- OPTION 3: Set admin role by user ID
-- =====================================================
-- Replace 'USER_ID_HERE' with the actual UUID

-- UPDATE auth.users 
-- SET raw_user_meta_data = 
--     CASE 
--         WHEN raw_user_meta_data IS NULL THEN '{"role": "admin"}'::jsonb
--         ELSE raw_user_meta_data || '{"role": "admin"}'::jsonb
--     END
-- WHERE id = 'USER_ID_HERE';

-- =====================================================
-- Verify admin role was set correctly
-- =====================================================
SELECT 
    id,
    email,
    raw_user_meta_data,
    raw_user_meta_data->>'role' as role,
    created_at
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin'
ORDER BY created_at DESC;

-- =====================================================
-- List all users with their roles
-- =====================================================
SELECT 
    id,
    email,
    raw_user_meta_data->>'first_name' as first_name,
    raw_user_meta_data->>'last_name' as last_name,
    raw_user_meta_data->>'role' as role,
    created_at
FROM auth.users
ORDER BY created_at DESC;

-- =====================================================
-- Remove admin role from a user (if needed)
-- =====================================================
-- UPDATE auth.users 
-- SET raw_user_meta_data = raw_user_meta_data - 'role'
-- WHERE email = 'user@example.com';
