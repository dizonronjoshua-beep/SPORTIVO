-- SQL Schema matching defaultState in app.js

CREATE TABLE IF NOT EXISTS state_storage (
  id boolean PRIMARY KEY DEFAULT TRUE,
  data jsonb NOT NULL,
  CONSTRAINT state_storage_single_row CHECK (id)
);

-- Insert the default state initially (the frontend can populate this, but having the row is good)
INSERT INTO state_storage (id, data) VALUES (TRUE, '{}') ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- PROFILES TABLE (Synced with Supabase Auth)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  role text DEFAULT 'user'::text,
  first_name text,
  last_name text,
  email text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and permissive policies for the frontend prototype
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Function to copy auth user data to profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically call handle_new_user() on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- HANDLE USER DELETION (Free up email)
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_deleted_user()
RETURNS trigger AS $$
DECLARE
    current_data jsonb;
    new_users jsonb;
BEGIN
    -- 1. Delete from profiles table
    DELETE FROM public.profiles WHERE id = old.id;

    -- 2. Remove the user from the state_storage JSON array so the email can be reused
    SELECT data INTO current_data FROM state_storage WHERE id = TRUE;
    
    IF current_data IS NOT NULL AND current_data ? 'users' THEN
        SELECT jsonb_agg(elem) INTO new_users
        FROM jsonb_array_elements(current_data->'users') AS elem
        WHERE lower(elem->>'email') != lower(old.email);

        IF new_users IS NULL THEN
            new_users := '[]'::jsonb;
        END IF;

        UPDATE state_storage 
        SET data = jsonb_set(current_data, '{users}', new_users)
        WHERE id = TRUE;
    END IF;

    RETURN old;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_deleted_user();
