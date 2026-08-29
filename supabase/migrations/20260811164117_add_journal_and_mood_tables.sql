/*
# Add journal entries and mood check-ins tables

## Overview
Extends the Lumi schema with two new user-owned tables: journal entries
for private reflective writing, and mood check-ins for recording daily
emotional states. Both are strictly scoped per authenticated user via RLS.

## New Tables

### journal_entries
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users, NOT NULL, defaults to auth.uid()) — owner
- `title` (text, NOT NULL, default 'Untitled') — entry title
- `content` (text, NOT NULL, default '') — entry body
- `mood` (text, nullable) — optional mood tag for the entry
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### mood_checkins
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users, NOT NULL, defaults to auth.uid()) — owner
- `mood` (text, NOT NULL, CHECK in 'great','good','okay','low','overwhelmed')
- `note` (text, nullable) — optional short note
- `created_at` (timestamptz, default now())

## Security (RLS)
- RLS enabled on both new tables.
- journal_entries: owner-scoped CRUD (auth.uid() = user_id).
- mood_checkins: owner-scoped CRUD (auth.uid() = user_id).
- All policies restricted to `authenticated` role.
- user_id columns default to auth.uid() so client inserts succeed.

## Notes
1. Both tables use ON DELETE CASCADE to auth.users so deleting a user
   removes their journal and check-in data.
2. Indexes added for user_id and created_at for query performance.
3. updated_at trigger added to journal_entries.
*/

-- Journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled',
  content text NOT NULL DEFAULT '',
  mood text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_journal" ON journal_entries;
CREATE POLICY "select_own_journal" ON journal_entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_journal" ON journal_entries;
CREATE POLICY "insert_own_journal" ON journal_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_journal" ON journal_entries;
CREATE POLICY "update_own_journal" ON journal_entries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_journal" ON journal_entries;
CREATE POLICY "delete_own_journal" ON journal_entries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Mood check-ins
CREATE TABLE IF NOT EXISTS mood_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  mood text NOT NULL CHECK (mood IN ('great', 'good', 'okay', 'low', 'overwhelmed')),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE mood_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_checkins" ON mood_checkins;
CREATE POLICY "select_own_checkins" ON mood_checkins FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_checkins" ON mood_checkins;
CREATE POLICY "insert_own_checkins" ON mood_checkins FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_checkins" ON mood_checkins;
CREATE POLICY "update_own_checkins" ON mood_checkins FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_checkins" ON mood_checkins;
CREATE POLICY "delete_own_checkins" ON mood_checkins FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_journal_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_created_at ON journal_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON mood_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_created_at ON mood_checkins(created_at DESC);

-- updated_at trigger for journal_entries
CREATE OR REPLACE FUNCTION update_journal_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_journal_updated_at ON journal_entries;
CREATE TRIGGER trigger_journal_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_journal_timestamp();
