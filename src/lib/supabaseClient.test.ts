import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSupabaseConfig } from './supabaseClient';

test('resolveSupabaseConfig accepts VITE_SUPABASE_PUBLISHABLE_KEY when anon key is unset', () => {
  const cfg = resolveSupabaseConfig({
    VITE_SUPABASE_URL: ' https://example.supabase.co ',
    VITE_SUPABASE_PUBLISHABLE_KEY: ' sb_publishable_demo_key ',
  });

  assert.equal(cfg.url, 'https://example.supabase.co');
  assert.equal(cfg.key, 'sb_publishable_demo_key');
  assert.equal(cfg.isConfigured, true);
});

test('resolveSupabaseConfig prefers VITE_SUPABASE_ANON_KEY over publishable key when both exist', () => {
  const cfg = resolveSupabaseConfig({
    VITE_SUPABASE_URL: 'https://example.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'anon_key_value',
    VITE_SUPABASE_PUBLISHABLE_KEY: 'publishable_key_value',
  });

  assert.equal(cfg.key, 'anon_key_value');
  assert.equal(cfg.isConfigured, true);
});

test('resolveSupabaseConfig rejects missing keys or non-HTTP URLs', () => {
  assert.equal(
    resolveSupabaseConfig({
      VITE_SUPABASE_URL: 'not-a-url',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_demo_key',
    }).isConfigured,
    false
  );
  assert.equal(
    resolveSupabaseConfig({
      VITE_SUPABASE_URL: 'https://example.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: '   ',
    }).isConfigured,
    false
  );
});
