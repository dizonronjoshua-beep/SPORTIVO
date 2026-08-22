import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Please check your .env file.');
}

window.supabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_key'
);

if (window.initSupabaseSync) {
  window.initSupabaseSync().then(() => {
    if (typeof go === 'function' && document.getElementById('portalRoot')) {
      const hash = location.hash || '#dashboard';
      go(hash.slice(1), false);
    }
  });
}
