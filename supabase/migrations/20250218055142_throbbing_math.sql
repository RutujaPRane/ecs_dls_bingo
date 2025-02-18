/*
  # Initial Schema Setup for Conference Bingo

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - matches auth.users id
      - `name` (text) - user's display name
      - `is_moderator` (boolean) - whether user is a moderator
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `tasks`
      - `id` (int, primary key)
      - `task` (text) - task description
      - `proof_type` (text) - type of proof required
      - `description` (text) - detailed task description
      - `created_at` (timestamp)

    - `submissions`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - reference to profiles
      - `task_id` (int) - reference to tasks
      - `proof` (text) - text proof or file URL
      - `status` (text) - pending/approved/rejected
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - Unique constraint on user_id + task_id

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add special policies for moderators
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  is_moderator boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE tasks (
  id serial PRIMARY KEY,
  task text NOT NULL,
  proof_type text NOT NULL CHECK (proof_type IN ('photo', 'text', 'screenshot')),
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create submissions table
CREATE TABLE submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  task_id int REFERENCES tasks(id) NOT NULL,
  proof text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, task_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Anyone can read tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only moderators can insert tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_moderator = true
    )
  );

-- Submissions policies
CREATE POLICY "Users can read their own submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_moderator = true
    )
  );

CREATE POLICY "Users can create their own submissions"
  ON submissions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their pending submissions"
  ON submissions FOR UPDATE
  TO authenticated
  USING (
    (user_id = auth.uid() AND status = 'pending') OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_moderator = true
    )
  );

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert initial tasks
INSERT INTO tasks (task, proof_type, description) VALUES
  ('Introduce yourself to someone new', 'photo', 'Submit a selfie of you and the person'),
  ('Find someone from a different major', 'text', 'Submit their name and their major'),
  ('Attend a workshop', 'photo', 'Submit a picture of you in the workshop room'),
  ('Find someone wearing the same color', 'photo', 'Submit a selfie with your color twin'),
  ('Follow ECS Diversity Summit socials', 'screenshot', 'Submit screenshot proof'),
  ('Visit the career fair booth', 'photo', 'Take a photo at any company booth'),
  ('Collect 3 business cards', 'photo', 'Photo of the collected cards'),
  ('Ask a speaker a question', 'text', 'Write down your question and the speaker''s name'),
  ('Find an alumni', 'text', 'Submit their name and graduation year'),
  ('Attend a networking session', 'photo', 'Photo of you at the networking event'),
  ('Share on LinkedIn', 'screenshot', 'Screenshot of your LinkedIn post'),
  ('Join a student organization', 'photo', 'Photo with organization members'),
  ('Find a mentor', 'text', 'Submit their name and role'),
  ('Learn about research opportunities', 'text', 'Write the research topic'),
  ('Exchange contact info', 'screenshot', 'Screenshot of exchanged details'),
  ('Attend a panel discussion', 'photo', 'Photo of the panel'),
  ('Find someone from your hometown', 'text', 'Submit their name and hometown'),
  ('Learn about an internship', 'text', 'Write company and position'),
  ('Take a group photo', 'photo', 'Submit a group photo'),
  ('Visit the tech showcase', 'photo', 'Photo of an interesting project'),
  ('Learn a new technology', 'text', 'Write what you learned'),
  ('Meet someone from industry', 'text', 'Submit their name and company'),
  ('Attend the opening ceremony', 'photo', 'Photo from the ceremony'),
  ('Get career advice', 'text', 'Write down the key advice');