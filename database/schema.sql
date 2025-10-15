-- =====================================================
-- KK Careers Portal Database Schema
-- =====================================================

-- Create profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, email)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Personal Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    
    -- Work Experiences (stored as JSONB for flexibility)
    experiences JSONB DEFAULT '[]'::jsonb,
    
    -- Education (stored as JSONB for flexibility)
    educations JSONB DEFAULT '[]'::jsonb,
    
    -- Languages (stored as JSONB for flexibility)  
    languages JSONB DEFAULT '[]'::jsonb,
    
    -- Document URLs (files stored in Supabase Storage)
    cv_file_url TEXT,
    cv_file_name TEXT,
    cover_letter_file_url TEXT,
    cover_letter_file_name TEXT,
    
    -- Application metadata
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Optional fields for future use
    notes TEXT,
    source TEXT DEFAULT 'careers-portal'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_applications_updated_at 
    BEFORE UPDATE ON applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow authenticated users to insert their own applications
CREATE POLICY "Users can insert own applications" ON applications
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy 2: Allow users to read their own applications
CREATE POLICY "Users can read own applications" ON applications
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy 3: Allow admins to read ALL applications (checks JWT metadata)
CREATE POLICY "Admins can read all applications" ON applications
    FOR SELECT 
    TO authenticated
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- Policy 4: Allow admins to update ALL applications (checks JWT metadata)
CREATE POLICY "Admins can update all applications" ON applications
    FOR UPDATE
    TO authenticated
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    )
    WITH CHECK (true);

-- =====================================================
-- Sample insert to test the table
-- =====================================================
-- INSERT INTO applications (
--     first_name, last_name, email, phone_number, city, country,
--     experiences, educations, languages
-- ) VALUES (
--     'John', 'Doe', 'john.doe@example.com', '+27123456789', 'Cape Town', 'South Africa',
--     '[{"company": "ABC Construction", "position": "General Worker", "duration": "2 years", "responsibilities": "Construction work"}]'::jsonb,
--     '[{"institution": "Local High School", "qualification": "Matric", "year": "2020"}]'::jsonb,
--     '["English", "Afrikaans"]'::jsonb
-- );