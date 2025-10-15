-- =====================================================
-- KK Careers Portal Database Schema
-- =====================================================

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
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

-- Create policy to allow anonymous inserts (for form submissions)
CREATE POLICY "Allow anonymous inserts" ON applications
    FOR INSERT 
    WITH CHECK (true);

-- Create policy for reading applications (you can modify this for admin access later)
CREATE POLICY "Allow reading own applications" ON applications
    FOR SELECT 
    USING (true); -- For now, allow reading. You can restrict this later.

-- Create policy to allow authenticated users (admins) to update applications
CREATE POLICY "Allow authenticated users to update applications" ON applications
    FOR UPDATE
    TO authenticated
    USING (true)
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