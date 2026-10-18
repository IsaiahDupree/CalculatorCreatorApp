-- Add new columns to calculators table
ALTER TABLE calculators 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create index for owner_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_calculators_owner_id ON calculators(owner_id);

-- Update RLS Policies

-- 1. Drop existing policies to redefine them
DROP POLICY IF EXISTS "Allow public read access" ON calculators;
DROP POLICY IF EXISTS "Allow public insert" ON calculators;

-- 2. Allow everyone to read all calculators (public marketplace)
CREATE POLICY "Allow public read access" ON calculators
  FOR SELECT USING (true);

-- 3. Allow authenticated users to insert their own calculators
CREATE POLICY "Allow authenticated insert" ON calculators
  FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

-- 4. Allow users to update their own calculators
CREATE POLICY "Allow owners to update" ON calculators
  FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 5. Allow users to delete their own calculators
CREATE POLICY "Allow owners to delete" ON calculators
  FOR DELETE
  USING (auth.uid() = owner_id);

-- 6. Allow anonymous inserts (optional, if we still want to support guest creation, 
--    but for this phase we want to enforce auth for creation, so we'll skip this or 
--    make it conditional. For now, let's STRICTLY enforce auth for creation as per plan).
--    If we wanted guest creation, we'd need a separate policy or allow owner_id to be null.
--    Let's allow owner_id to be NULL for legacy/guest calculators, but only allow INSERT if authenticated?
--    Actually, let's keep it simple: You must be logged in to create.
