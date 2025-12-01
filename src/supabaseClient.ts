
import { createClient } from '@supabase/supabase-js';

// Credenciales del proyecto 'primera_mundial_2026' (ID: vghnrwwxrvbckqgojjgn)
const supabaseUrl = 'https://vghnrwwxrvbckqgojjgn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaG5yd3d4cnZiY2txZ29qamduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NjY5MDksImV4cCI6MjA4MDE0MjkwOX0.zp0hSq4yrXQu3-01wZDm5UfOi3qe2LcmArzYFXyWY-U'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
