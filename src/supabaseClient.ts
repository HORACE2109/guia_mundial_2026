
import { createClient } from '@supabase/supabase-js';

// Tus credenciales del proyecto 'guia_mundial_2026'
// IMPORTANTE: Asegúrate de copiar la 'anon public' key desde Supabase > Project Settings > API.
// Debe empezar con 'eyJ...' (es un token largo).

const supabaseUrl = 'https://mptcecsnpaxkyaalyrua.supabase.co';

// REEMPLAZA ESTO CON LA CLAVE QUE EMPIEZA CON "eyJ..."
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wdGNlY3NucGF4a3lhYWx5cnVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NTQ1ODUsImV4cCI6MjA4MDAzMDU4NX0.y8NXLZhF1Uk-Qfw9WBwHWHsN-tu9S5wFuchz9ZkmEGw'; 

export const supabase = createClient(supabaseUrl, supabaseKey);
