-- SQL Schema matching defaultState in app.js

CREATE TABLE IF NOT EXISTS state_storage (
  id boolean PRIMARY KEY DEFAULT TRUE,
  data jsonb NOT NULL,
  CONSTRAINT state_storage_single_row CHECK (id)
);

-- Insert the default state initially (the frontend can populate this, but having the row is good)
INSERT INTO state_storage (id, data) VALUES (TRUE, '{}') ON CONFLICT (id) DO NOTHING;
