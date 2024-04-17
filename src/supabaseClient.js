import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kyomjfxvtqrejvvyyvbc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5b21qZnh2dHFyZWp2dnl5dmJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAzNDEyMzIsImV4cCI6MjAyNTkxNzIzMn0.05zqV_bbYTBC_u0LF5Ld5sO5oQOA48JOfsBJxZ9M5-g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);