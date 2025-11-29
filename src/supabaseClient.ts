
import { createClient } from '@supabase/supabase-js';

// Tus credenciales del proyecto 'guia_mundial_2026'
// Si estas claves cambian en Supabase, actualízalas aquí.
const supabaseUrl = 'https://mptcecsnpaxkyaalyrua.supabase.co';
const supabaseKey = 'sb_publishable_e9s9w6WpjEOhBO_Vokjhgw_zjMiYgPk'; // Asegúrate de que esta key sea correcta (Suele empezar con eyJ...)

export const supabase = createClient(supabaseUrl, supabaseKey);
