import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Whether remote sync is even worth attempting. When false the store skips every
 * network call instead of failing once per save and reporting success anyway.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn('Supabase credentials missing in environment variables. Remote sync is disabled; use Profile > Backup to save your progress.');
}

// Fallback to placeholder values if missing to prevent build crash
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  { global: { fetch: async (input, init) => {
    const controller = new AbortController();
    const abort = () => controller.abort();
    const sourceSignal = init?.signal;
    if (sourceSignal?.aborted) abort();
    sourceSignal?.addEventListener('abort', abort, { once: true });
    const timeout = setTimeout(abort, 12_000);
    try { return await fetch(input, { ...init, signal: controller.signal }); }
    finally {
      clearTimeout(timeout);
      sourceSignal?.removeEventListener('abort', abort);
    }
  } } }
);
