-- AJ24 Shopping Mall Migration
-- Run this in Supabase Studio SQL Editor

-- 1. Add password_hash to members
ALTER TABLE aj24.members ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 2. Create wishlists table
CREATE TABLE IF NOT EXISTS aj24.wishlists (
  id SERIAL PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES aj24.members(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES aj24.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(member_id, product_id)
);

-- 3. Add shipping fields to orders
ALTER TABLE aj24.orders ADD COLUMN IF NOT EXISTS shipping_name TEXT;
ALTER TABLE aj24.orders ADD COLUMN IF NOT EXISTS shipping_phone TEXT;

-- 4. Grant access for PostgREST
GRANT ALL ON aj24.wishlists TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON SEQUENCE aj24.wishlists_id_seq TO anon, authenticated, service_role;

-- 5. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
