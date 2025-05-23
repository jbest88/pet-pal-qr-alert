
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vasxhdcthoeupolppxws.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhc3hoZGN0aG9ldXBvbHBweHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxOTU2NjYsImV4cCI6MjA2MTc3MTY2Nn0.yGMYKhopm2lFeD4j5-4OeeNwfuIEEBNSfPXbcTYIbcs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      autoRefreshToken: true,
      persistSession: true,
    }
  }
);
