import {
  createClient as createSupabaseJsClient,
  type SupabaseClient,
} from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  key: string;
  isConfigured: boolean;
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function resolveSupabaseConfig(
  env: Record<string, string | undefined>
): SupabaseConfig {
  const url = (env.VITE_SUPABASE_URL ?? '').trim();
  const key = (
    env.VITE_SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    ''
  ).trim();
  return {
    url,
    key,
    isConfigured: isValidHttpUrl(url) && key.length > 0,
  };
}

const runtimeEnv =
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env ??
  {};

const config = resolveSupabaseConfig(runtimeEnv);

export const isSupabaseConfigured = config.isConfigured;

export function createClient(): SupabaseClient | null {
  return config.isConfigured
    ? createSupabaseJsClient(config.url, config.key)
    : null;
}

export const supabase: SupabaseClient | null = createClient();
