-- =====================================================
-- Create profiles for existing users who signed up 
-- before the trigger was created
-- =====================================================

-- This script creates profile records for any auth.users 
-- who don't have a corresponding profile yet

INSERT INTO public.profiles (id, first_name, last_name, email)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'first_name', 'User') as first_name,
    COALESCE(u.raw_user_meta_data->>'last_name', 'Name') as last_name,
    u.email
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
)
AND u.email NOT LIKE '%@supabase%'; -- Exclude system users

-- Check the results
SELECT 
    p.id,
    p.first_name,
    p.last_name,
    p.email,
    p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC;
