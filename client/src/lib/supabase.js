import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wxynwbuvmxuurbimbpbn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4eW53YnV2bXh1dXJiaW1icGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNDQ3NzUsImV4cCI6MjA4NzcyMDc3NX0.B6bFsQFb0gba1So3ZxEVCZqKSv48dfnRDbJ2I1YVVsQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
