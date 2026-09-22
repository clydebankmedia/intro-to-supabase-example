import { createClient } from "@supabase/supabase-js";

// This file is already done for you!
// It reads your Supabase config from the .env file and creates a single
// Supabase client that the rest of the app imports.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
