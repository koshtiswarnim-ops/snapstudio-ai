import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, UserCredits, GenerationRecord } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xgmbdttczbcoyvuzjcxk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GnkudypuZ0H7-59MXoibPg_9dbQdXnj';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_'));

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Storage key helpers for local state fallback
const LOCAL_STORAGE_KEY_USER = 'snapstudio_user_session';
const LOCAL_STORAGE_KEY_CREDITS = 'snapstudio_user_credits';
const LOCAL_STORAGE_KEY_GENERATIONS = 'snapstudio_user_generations';

export const getInitialMockUser = (): UserProfile => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* ignore */ }
  }
  const defaultUser: UserProfile = {
    id: 'usr_demo_8829',
    email: 'pro.seller@snapstudio.ai',
    name: 'Alex Vance',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    plan: 'pro',
    created_at: new Date().toISOString(),
  };
  localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(defaultUser));
  return defaultUser;
};

export const getInitialMockCredits = (userId: string): UserCredits => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY_CREDITS);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* ignore */ }
  }
  const defaultCredits: UserCredits = {
    id: 'crd_demo_102',
    user_id: userId,
    available_credits: 24,
    total_used: 18,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(LOCAL_STORAGE_KEY_CREDITS, JSON.stringify(defaultCredits));
  return defaultCredits;
};

export const getInitialMockGenerations = (): GenerationRecord[] => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY_GENERATIONS);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* ignore */ }
  }
  const samples: GenerationRecord[] = [
    {
      id: 'gen_9921',
      user_id: 'usr_demo_8829',
      original_image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      generated_image_url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80',
      selected_style: 'minimal-premium',
      aspect_ratio: '1:1',
      quality: 'high',
      status: 'completed',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      completed_at: new Date(Date.now() - 3600000 * 4 + 4000).toISOString(),
    },
    {
      id: 'gen_9920',
      user_id: 'usr_demo_8829',
      original_image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      generated_image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
      selected_style: 'soft-studio',
      aspect_ratio: '4:5',
      quality: 'standard',
      status: 'completed',
      created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
      completed_at: new Date(Date.now() - 3600000 * 26 + 3500).toISOString(),
    },
    {
      id: 'gen_9919',
      user_id: 'usr_demo_8829',
      original_image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
      generated_image_url: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&auto=format&fit=crop&q=80',
      selected_style: 'clean-white',
      aspect_ratio: '1:1',
      quality: 'high',
      status: 'completed',
      created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
      completed_at: new Date(Date.now() - 3600000 * 72 + 5000).toISOString(),
    }
  ];
  localStorage.setItem(LOCAL_STORAGE_KEY_GENERATIONS, JSON.stringify(samples));
  return samples;
};

export const saveMockGenerations = (gens: GenerationRecord[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_GENERATIONS, JSON.stringify(gens));
};

export const saveMockCredits = (credits: UserCredits) => {
  localStorage.setItem(LOCAL_STORAGE_KEY_CREDITS, JSON.stringify(credits));
};

/**
 * Persists a new generation record to Supabase Database (public.generations table).
 */
export const saveGenerationRecordToSupabase = async (record: GenerationRecord): Promise<void> => {
  // 1. Update local cache
  const existing = getInitialMockGenerations();
  saveMockGenerations([record, ...existing]);

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

      // Only attach valid UUID user_id if logged in via Supabase Auth
      if (record.user_id && !record.user_id.startsWith('usr_')) {
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
 * Fetches user generations from Supabase backend or local cache.
 */
export const fetchGenerationsFromSupabase = async (userId?: string): Promise<GenerationRecord[]> => {
  const localList = getInitialMockGenerations();
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('generations').select('*').order('created_at', { ascending: false });
      if (userId && !userId.startsWith('usr_')) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as GenerationRecord[];
      }
    } catch (err) {
      console.warn('Supabase DB Fetch error:', err);
    }
  }
  return localList;
};
