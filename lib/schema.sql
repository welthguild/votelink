-- Create contests table
CREATE TABLE IF NOT EXISTS contests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  banner_url TEXT,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contestants table
CREATE TABLE IF NOT EXISTS contestants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  photo_url TEXT,
  position INTEGER NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create platforms table
CREATE TABLE IF NOT EXISTS platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  redirect_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id UUID NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
  contestant_id UUID NOT NULL REFERENCES contestants(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contestants_contest_id ON contestants(contest_id);
CREATE INDEX IF NOT EXISTS idx_platforms_contest_id ON platforms(contest_id);
CREATE INDEX IF NOT EXISTS idx_submissions_contest_id ON submissions(contest_id);
CREATE INDEX IF NOT EXISTS idx_submissions_contestant_id ON submissions(contestant_id);
CREATE INDEX IF NOT EXISTS idx_contests_slug ON contests(slug);

-- Enable RLS (Row Level Security)
ALTER TABLE contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contestants ENABLE ROW LEVEL SECURITY;
ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - public read-only access
CREATE POLICY "Public can read contests" ON contests FOR SELECT USING (true);
CREATE POLICY "Public can read contestants" ON contestants FOR SELECT USING (true);
CREATE POLICY "Public can read platforms" ON platforms FOR SELECT USING (true);
CREATE POLICY "Public can read submissions" ON submissions FOR SELECT USING (true);

-- Create function to increment vote count
CREATE OR REPLACE FUNCTION increment_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE contestants SET votes = votes + 1 WHERE id = NEW.contestant_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to increment votes on submission insert
CREATE TRIGGER on_submission_increment_votes
AFTER INSERT ON submissions
FOR EACH ROW
EXECUTE FUNCTION increment_vote_count();

-- Insert sample data
INSERT INTO contests (slug, name, banner_url, end_date, is_active)
VALUES (
  'first-contest',
  'First Contest',
  'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=1000&h=400&fit=crop',
  NOW() + INTERVAL '30 days',
  true
) ON CONFLICT DO NOTHING;

INSERT INTO contestants (contest_id, name, photo_url, position)
SELECT id, 'Candidate A', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', 1
FROM contests WHERE slug = 'first-contest'
ON CONFLICT DO NOTHING;

INSERT INTO contestants (contest_id, name, photo_url, position)
SELECT id, 'Candidate B', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', 2
FROM contests WHERE slug = 'first-contest'
ON CONFLICT DO NOTHING;

INSERT INTO platforms (contest_id, platform_name, is_enabled, redirect_url)
SELECT id, 'instagram', true, 'https://instagram.com'
FROM contests WHERE slug = 'first-contest'
ON CONFLICT DO NOTHING;

INSERT INTO platforms (contest_id, platform_name, is_enabled, redirect_url)
SELECT id, 'facebook', true, 'https://facebook.com'
FROM contests WHERE slug = 'first-contest'
ON CONFLICT DO NOTHING;
