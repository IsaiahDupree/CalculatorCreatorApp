-- Create calculators table
CREATE TABLE IF NOT EXISTS calculators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  spec JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0
);

-- Create index for faster queries
CREATE INDEX idx_calculators_created_at ON calculators(created_at DESC);
CREATE INDEX idx_calculators_views ON calculators(views DESC);

-- Enable Row Level Security (optional, for future auth)
ALTER TABLE calculators ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON calculators
  FOR SELECT USING (true);

-- Create policy to allow public insert (can be restricted later with auth)
CREATE POLICY "Allow public insert" ON calculators
  FOR INSERT WITH CHECK (true);
