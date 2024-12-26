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
      },
    },
  }
);

// Add a request interceptor to log requests
supabase.rest.interceptors.request.use(
  (config) => {
    console.log('Supabase Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('Supabase Request Error:', error);
    return Promise.reject(error);
  }
);