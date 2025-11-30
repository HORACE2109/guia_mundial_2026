
import { createClient } from '@supabase/supabase-js';

// Credenciales del proyecto 'mundial_2026_guia' (ID: ewetrtnugburpomwnvae)
const supabaseUrl = 'https://ewetrtnugburpomwnvae.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZXRydG51Z2J1cnBvbXdudmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1MzEzNzcsImV4cCI6MjA4MDEwNzM3N30.-M8752-Y8ZcnY_bLo6f35HgoEp8jWaQ0sRgIllc7VHY'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
