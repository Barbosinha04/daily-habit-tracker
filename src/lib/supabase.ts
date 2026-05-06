import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// Fornecer valores padrão vazios ou dummy para evitar crash imediato durante o desenvolvimento
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Sanitização da URL: O SDK do Supabase espera apenas a URL base do projeto.
// Removemos barras no final e sufixos como /rest/v1 que são comuns de serem colados por engano.
supabaseUrl = supabaseUrl.replace(/\/+$/, '').replace(/\/rest\/v1$/, '');

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Configuração do Supabase ausente! O App não funcionará corretamente sem as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
