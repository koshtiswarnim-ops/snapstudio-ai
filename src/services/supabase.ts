import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, UserCredits, GenerationRecord } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xgmbdttczbcoyvuzjcxk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GnkudypuZ0H7-59MXoibPg_9dbQdXnj';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_'));

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Storage key helpers for user-isolated local state
const LOCAL_STORAGE_KEY_USER = 'snapstudio_user_session';

export const createDeterministicUserId = (email: string): string => {
  if (!email) return 'usr_guest';
  const cleanEmail = email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  return `usr_${cleanEmail}`;
};

export const getUserCreditsStorageKey = (userId: string) => `snapstudio_credits_${userId}`;
export const getUserGenerationsStorageKey = (userId: string) => `snapstudio_generations_${userId}`;

export const getInitialMockUser = (): UserProfile | null => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* ignore */ }
  }
  return null;
};

export const getInitialMockCredits = (userId: string): UserCredits => {
  if (!userId) {
    return { id: 'crd_guest', user_id: 'guest', available_credits: 0, total_used: 0, updated_at: new Date().toISOString() };
  }
  const key = getUserCreditsStorageKey(userId);
  const stored = localStorage.getItem(key);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* ignore */ }
  }
  // New account initial credits setup: 5 Initial Free Credits per distinct account
  const defaultCredits: UserCredits = {
    id: `crd_${userId}`,
    user_id: userId,
    available_credits: 5,
    total_used: 0,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(key, JSON.stringify(defaultCredits));
  return defaultCredits;
};

export const saveMockCredits = (credits: UserCredits) => {
  if (credits.user_id) {
    localStorage.setItem(getUserCreditsStorageKey(credits.user_id), JSON.stringify(credits));
  }
};

const DEFAULT_FALLBACK_ORIGINAL = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

export const getInitialMockGenerations = (userId?: string): GenerationRecord[] => {
  if (!userId) return [];
  const key = getUserGenerationsStorageKey(userId);
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const parsed: GenerationRecord[] = JSON.parse(stored);
      // Replace expired blob: URLs with high-quality product image fallback
      const sanitized = parsed.map((item) => ({
        ...item,
        original_image_url:
          item.original_image_url && item.original_image_url.startsWith('blob:')
            ? DEFAULT_FALLBACK_ORIGINAL
            : item.original_image_url || DEFAULT_FALLBACK_ORIGINAL,
      }));
      return sanitized;
    } catch (e) { /* ignore */ }
  }
  return [];
};

export const saveMockGenerations = (userId: string, gens: GenerationRecord[]) => {
  if (userId) {
    localStorage.setItem(getUserGenerationsStorageKey(userId), JSON.stringify(gens));
  }
};

/**
 * Persists a new generation record to Supabase Database (public.generations table) for specific user_id.
 */
export const saveGenerationRecordToSupabase = async (record: GenerationRecord): Promise<void> => {
  // 1. Update user-isolated local cache
  if (record.user_id) {
    const existing = getInitialMockGenerations(record.user_id);
    saveMockGenerations(record.user_id, [record, ...existing]);
  }

  // 2. Persist to Supabase Database
  if (isSupabaseConfigured && supabase) {
    try {
      const payload: Record<string, any> = {
        original_image_url: record.original_image_url,
        generated_image_url: record.generated_image_url,
        selected_style: record.selected_style,
        aspect_ratio: record.aspect_ratio,
        quality: record.quality,
        status: record.status,
        created_at: record.created_at,
        completed_at: record.completed_at,
      };

      if (record.user_id) {
        payload.user_id = record.user_id;
      }

      const { data, error } = await supabase.from('generations').insert([payload]).select();
      if (error) {
        console.warn('Supabase DB Insert notice:', error.message);
      } else {
        console.log('Saved generation details to Supabase backend successfully!', data);
      }
    } catch (err) {
      console.warn('Failed to save generation record to Supabase:', err);
    }
  }
};

/**
 * Fetches user generations strictly isolated to the logged-in user_id from Supabase backend.
 */
export const fetchGenerationsFromSupabase = async (userId?: string): Promise<GenerationRecord[]> => {
  if (!userId) return [];
  const localList = getInitialMockGenerations(userId);

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('generations').select('*').order('created_at', { ascending: false });
      query = query.eq('user_id', userId);

      const { data, error } = await query;
      if (!error && data) {
        const sanitized = data.map((item: any) => ({
          ...item,
          original_image_url:
            item.original_image_url && item.original_image_url.startsWith('blob:')
              ? DEFAULT_FALLBACK_ORIGINAL
              : item.original_image_url || DEFAULT_FALLBACK_ORIGINAL,
        }));
        return sanitized as GenerationRecord[];
      }
    } catch (err) {
      console.warn('Supabase DB Fetch error:', err);
    }
  }
  return localList;
};
