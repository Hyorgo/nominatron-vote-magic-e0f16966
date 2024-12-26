import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://psnxgyuomxstuzrqfcwy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzbnhneXVvbXhzdHV6cnFmY3d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzA5MzAsImV4cCI6MjA1MDIwNjkzMH0.mdJ2LsqiRlsU3ngJ69YWLiKe65hA9xDeejagwDzuJZs";

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('Missing Supabase credentials');
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        'apikey': SUPABASE_PUBLISHABLE_KEY
      },
    },
    db: {
      schema: 'public'
    }
  }
);

// Add debug logging for development
if (import.meta.env.DEV) {
  console.log('Supabase client initialized with URL:', SUPABASE_URL);
  
  // Listen for vote changes
  const channel = supabase.channel('votes-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'votes'
      },
      (payload) => {
        console.log('Vote change detected:', payload);
      }
    )
    .subscribe();

  // Log all requests in development
  const originalFrom = supabase.from.bind(supabase);
  supabase.from = (table: string) => {
    console.log(`Making request to table: ${table}`);
    return originalFrom(table);
  };

  // Cleanup on window unload
  window.addEventListener('beforeunload', () => {
    channel.unsubscribe();
  });
}