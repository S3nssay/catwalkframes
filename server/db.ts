import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';
import { createClient } from '@supabase/supabase-js';

const connectionString = process.env.DATABASE_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

// Create the postgres connection for Drizzle
const client = postgres(connectionString);

// Create drizzle database instance
export const db = drizzle(client, { schema });

// Create Supabase client for auth and realtime features (optional)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;