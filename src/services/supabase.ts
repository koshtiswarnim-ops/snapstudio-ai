import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, UserCredits, GenerationRecord } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xgmbdttczbcoyvuzjcxk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GnkudypuZ0H7-59MXoibPg_9dbQdXnj';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_'));

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Storage key helpers for user-isolated multi-tenant state
const LOCAL_STORAGE_KEY_USER = 'snapstudio_user_session';

/**
 * Normalizes any user object, email string, or user ID into a unified account key (e.g. acc_koshtiswarnim_gmail_com)
 */
export const normalizeAccountKey = (userOrEmail?: string | UserProfile | null): string => {
  if (!userOrEmail) return 'acc_guest';
  const rawEmail = typeof userOrEmail === 'string' ? userOrEmail : userOrEmail.email || userOrEmail.id;
  if (!rawEmail || rawEmail === 'guest') return 'acc_guest';
  const clean = rawEmail.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  return `acc_${clean}`;
};

export const createDeterministicUserId = (email: string): string => {
  return normalizeAccountKey(email);
};

export const getUserCreditsStorageKey = (userOrEmail: string | UserProfile) => {
  return `snapstudio_credits_${normalizeAccountKey(userOrEmail)}`;
};

export const getUserGenerationsStorageKey = (userOrEmail: string | UserProfile) => {
  return `snapstudio_generations_${normalizeAccountKey(userOrEmail)}`;
};

export const getInitialMockUser = (): UserProfile | null => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* ignore */ }
  }
  return null;
};

export const getInitialMockCredits = (userOrEmail: string | UserProfile): UserCredits => {
  const accountKey = normalizeAccountKey(userOrEmail);
  if (accountKey === 'acc_guest') {
    return { id: 'crd_guest', user_id: 'guest', available_credits: 0, total_used: 0, updated_at: new Date().toISOString() };
  }

  const key = getUserCreditsStorageKey(accountKey);
  const stored = localStorage.getItem(key);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { /* ignore */ }
  }

  // Also check legacy storage key to preserve previous credits
  const legacyStored = localStorage.getItem('snapstudio_user_credits');
  if (legacyStored) {
    try {
      const parsed: UserCredits = JSON.parse(legacyStored);
      localStorage.setItem(key, JSON.stringify(parsed));
      return parsed;
    } catch (e) { /* ignore */ }
  }

  // New account initial credits setup: 5 Initial Free Credits per distinct account
  const defaultCredits: UserCredits = {
    id: `crd_${accountKey}`,
    user_id: accountKey,
    available_credits: 5,
    total_used: 0,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(key, JSON.stringify(defaultCredits));
  return defaultCredits;
};

export const saveMockCredits = (credits: UserCredits) => {
  if (credits.user_id && credits.user_id !== 'guest') {
    localStorage.setItem(getUserCreditsStorageKey(credits.user_id), JSON.stringify(credits));
  }
};

const DEFAULT_FALLBACK_ORIGINAL = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';

export const getInitialMockGenerations = (userOrEmail?: string | UserProfile): GenerationRecord[] => {
  if (!userOrEmail) return [];
  const accountKey = normalizeAccountKey(userOrEmail);
  if (accountKey === 'acc_guest') return [];

  const key = getUserGenerationsStorageKey(accountKey);
  let records: GenerationRecord[] = [];

  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      records = JSON.parse(stored);
    } catch (e) { /* ignore */ }
  }

  // Also merge legacy generations if present
  const legacy = localStorage.getItem('snapstudio_user_generations');
  if (legacy) {
    try {
      const legacyList: GenerationRecord[] = JSON.parse(legacy);
      const combined = [...records, ...legacyList];
      const uniqueMap = new Map<string, GenerationRecord>();
      combined.forEach((item) => uniqueMap.set(item.id, item));
      records = Array.from(uniqueMap.values());
    } catch (e) { /* ignore */ }
  }

  const sanitized = records.map((item) => ({
    ...item,
    original_image_url:
      item.original_image_url && item.original_image_url.startsWith('blob:')
        ? DEFAULT_FALLBACK_ORIGINAL
        : item.original_image_url || DEFAULT_FALLBACK_ORIGINAL,
  }));

  return sanitized;
};

export const saveMockGenerations = (userOrEmail: string | UserProfile, gens: GenerationRecord[]) => {
  const accountKey = normalizeAccountKey(userOrEmail);
  if (accountKey !== 'acc_guest') {
    localStorage.setItem(getUserGenerationsStorageKey(accountKey), JSON.stringify(gens));
  }
};

/**
 * Persists a new generation record to Supabase Database (public.generations table) for specific user account.
 */
export const saveGenerationRecordToSupabase = async (record: GenerationRecord, userEmail?: string): Promise<void> => {
  const accountKey = normalizeAccountKey(userEmail || record.user_id);

  // 1. Update user-isolated local cache
  if (accountKey !== 'acc_guest') {
    const existing = getInitialMockGenerations(accountKey);
    const updated = [record, ...existing.filter((r) => r.id !== record.id)];
    saveMockGenerations(accountKey, updated);
  }

  // 2. Persist to Supabase Database
  if (isSupabaseConfigured && supabase) {
    try {
      const payload: Record<string, any> = {
        user_id: accountKey,
        original_image_url: record.original_image_url,
        generated_image_url: record.generated_image_url,
        selected_style: record.selected_style,
        aspect_ratio: record.aspect_ratio,
        quality: record.quality,
        status: record.status,
        created_at: record.created_at,
        completed_at: record.completed_at,
      };

      const { data, error } = await supabase.from('generations').insert([payload]).select();
      if (error) {
        console.warn('Supabase DB Insert notice:', error.message);
      } else {
        console.log('Saved generation to Supabase for account:', accountKey, data);
      }
    } catch (err) {
      console.warn('Failed to save generation record to Supabase:', err);
    }
  }
};

/**
 * Fetches user generations strictly isolated to the logged-in user account from Supabase backend.
 */
export const fetchGenerationsFromSupabase = async (userOrEmail?: string | UserProfile): Promise<GenerationRecord[]> => {
  if (!userOrEmail) return [];
  const accountKey = normalizeAccountKey(userOrEmail);
  if (accountKey === 'acc_guest') return [];

  const localList = getInitialMockGenerations(accountKey);

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .or(`user_id.eq.${accountKey},user_id.eq.${typeof userOrEmail === 'string' ? userOrEmail : userOrEmail.id}`)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const dbRecords = data.map((item: any) => ({
          ...item,
          original_image_url:
            item.original_image_url && item.original_image_url.startsWith('blob:')
              ? DEFAULT_FALLBACK_ORIGINAL
              : item.original_image_url || DEFAULT_FALLBACK_ORIGINAL,
        })) as GenerationRecord[];

        // Combine DB records and local list, deduplicating by ID
        const combined = [...dbRecords, ...localList];
        const uniqueMap = new Map<string, GenerationRecord>();
        combined.forEach((item) => uniqueMap.set(item.id, item));
        return Array.from(uniqueMap.values());
      }
    } catch (err) {
      console.warn('Supabase DB Fetch error:', err);
    }
  }

  return localList;
};

/**
 * Deletes a single generation record from local storage and Supabase Database.
 */
export const deleteGenerationRecordFromSupabase = async (
  recordId: string,
  userOrEmail?: string | UserProfile | null
): Promise<void> => {
  if (!userOrEmail) return;
  const accountKey = normalizeAccountKey(userOrEmail);

  // 1. Remove from local storage cache
  if (accountKey !== 'acc_guest') {
    const existing = getInitialMockGenerations(accountKey);
    const updated = existing.filter((r) => r.id !== recordId);
    saveMockGenerations(accountKey, updated);

    // Also cleanup legacy storage key if present
    const legacy = localStorage.getItem('snapstudio_user_generations');
    if (legacy) {
      try {
        const legacyList: GenerationRecord[] = JSON.parse(legacy);
        const filteredLegacy = legacyList.filter((r) => r.id !== recordId);
        localStorage.setItem('snapstudio_user_generations', JSON.stringify(filteredLegacy));
      } catch (e) { /* ignore */ }
    }
  }

  // 2. Delete from Supabase Database
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('generations').delete().eq('id', recordId);
      if (error) {
        console.warn('Supabase DB Delete notice:', error.message);
      } else {
        console.log('Successfully deleted generation record from Supabase:', recordId);
      }
    } catch (err) {
      console.warn('Failed to delete generation record from Supabase:', err);
    }
  }
};

/**
 * Clears all generation records for the specified user account.
 */
export const clearAllGenerationsFromSupabase = async (
  userOrEmail?: string | UserProfile | null
): Promise<void> => {
  if (!userOrEmail) return;
  const accountKey = normalizeAccountKey(userOrEmail);

  if (accountKey !== 'acc_guest') {
    saveMockGenerations(accountKey, []);
    localStorage.removeItem('snapstudio_user_generations');
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const accountId = typeof userOrEmail === 'string' ? userOrEmail : userOrEmail.id;
      await supabase.from('generations').delete().or(`user_id.eq.${accountKey},user_id.eq.${accountId}`);
    } catch (err) {
      console.warn('Failed to clear all generation records in Supabase:', err);
    }
  }
};

export interface SupabaseVerificationResult {
  status: 'SUCCESS' | 'FAILED';
  configured: boolean;
  endpoint: string;
  tableChecked: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * Performs a safe, read-only verification check against an existing table in Supabase ('generations').
 * Prints a clear SUCCESS or FAILED banner in the browser console without exposing API secrets.
 */
export const verifySupabaseConnection = async (): Promise<SupabaseVerificationResult> => {
  if (!isSupabaseConfigured || !supabase) {
    const res: SupabaseVerificationResult = {
      status: 'FAILED',
      configured: false,
      endpoint: supabaseUrl || 'NOT_CONFIGURED',
      tableChecked: 'generations',
      message: 'Supabase client is not configured. Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.',
    };
    console.error(
      '%c[Supabase Connection Test] FAILED',
      'color: #EF4444; font-weight: bold; font-size: 14px;',
      `\nReason: ${res.message}\nEndpoint: ${res.endpoint}`
    );
    return res;
  }

  // Safe endpoint URL display (do not expose keys or query params)
  let safeEndpoint = '';
  try {
    safeEndpoint = new URL(supabaseUrl).origin;
  } catch {
    safeEndpoint = 'Supabase Host';
  }

  try {
    // Run a real read-only query against the existing 'generations' table (defined in schema.sql)
    const { data, error, status } = await supabase
      .from('generations')
      .select('id')
      .limit(1);

    if (error) {
      const errMsg = error.message || 'Unknown Supabase error';
      let diagnosis = '';

      if (errMsg.includes('fetch failed') || errMsg.includes('ENOTFOUND') || status === 0) {
        diagnosis = `Cannot reach Supabase host '${safeEndpoint}'. The project may be paused due to inactivity, deleted, or the domain has changed. Check your Supabase Dashboard to unpause or verify the project URL.`;
      } else if (status === 404 || errMsg.includes('does not exist') || error.code === '42P01') {
        diagnosis = `Host reached, but table 'generations' does not exist in the database yet. Run 'supabase/schema.sql' in your Supabase SQL Editor.`;
      } else if (status === 401 || errMsg.includes('Invalid API key') || errMsg.includes('JWT')) {
        diagnosis = `Host reached, but authentication was rejected. VITE_SUPABASE_ANON_KEY is invalid or expired. Check Project Settings -> API.`;
      } else if (status === 403 || errMsg.includes('row-level security') || errMsg.includes('permission denied')) {
        // Table exists and RLS is active: backend connection is successful!
        const successRes: SupabaseVerificationResult = {
          status: 'SUCCESS',
          configured: true,
          endpoint: safeEndpoint,
          tableChecked: 'generations',
          message: `Connected to Supabase successfully! Table 'generations' exists and Row-Level Security (RLS) is active.`,
          details: { httpStatus: status, rlsActive: true },
        };
        console.log(
          '%c[Supabase Connection Test] SUCCESS',
          'color: #10B981; font-weight: bold; font-size: 14px;',
          `\nStatus: SUCCESS\nEndpoint: ${safeEndpoint}\nTable: generations\nMessage: ${successRes.message}`
        );
        return successRes;
      } else {
        diagnosis = `Supabase responded with error (Code: ${error.code || status}): ${errMsg}`;
      }

      const failRes: SupabaseVerificationResult = {
        status: 'FAILED',
        configured: true,
        endpoint: safeEndpoint,
        tableChecked: 'generations',
        message: diagnosis,
        details: { code: error.code, httpStatus: status, rawMessage: errMsg },
      };

      console.error(
        '%c[Supabase Connection Test] FAILED',
        'color: #EF4444; font-weight: bold; font-size: 14px;',
        `\nStatus: FAILED\nEndpoint: ${safeEndpoint}\nTable: generations\nMessage: ${diagnosis}`
      );
      return failRes;
    }

    const successRes: SupabaseVerificationResult = {
      status: 'SUCCESS',
      configured: true,
      endpoint: safeEndpoint,
      tableChecked: 'generations',
      message: `Connected to Supabase backend successfully! Read-only query to table 'generations' succeeded (Records found: ${data?.length ?? 0}).`,
      details: { recordCount: data?.length ?? 0, httpStatus: status },
    };

    console.log(
      '%c[Supabase Connection Test] SUCCESS',
      'color: #10B981; font-weight: bold; font-size: 14px;',
      `\nStatus: SUCCESS\nEndpoint: ${safeEndpoint}\nTable: generations\nMessage: ${successRes.message}`
    );
    return successRes;
  } catch (err: any) {
    const rawErr = err?.message || String(err);
    const diagnosis = rawErr.includes('ENOTFOUND') || rawErr.includes('fetch failed')
      ? `Cannot reach Supabase host '${safeEndpoint}'. The project may be paused due to inactivity, deleted, or the domain has changed. Check your Supabase Dashboard to unpause or verify the project URL.`
      : `Connection check failed: ${rawErr}`;

    const failRes: SupabaseVerificationResult = {
      status: 'FAILED',
      configured: true,
      endpoint: safeEndpoint,
      tableChecked: 'generations',
      message: diagnosis,
      details: { error: rawErr },
    };

    console.error(
      '%c[Supabase Connection Test] FAILED',
      'color: #EF4444; font-weight: bold; font-size: 14px;',
      `\nStatus: FAILED\nEndpoint: ${safeEndpoint}\nTable: generations\nMessage: ${diagnosis}`
    );
    return failRes;
  }
};

// Expose globally for interactive browser console execution: window.verifySupabaseConnection()
if (typeof window !== 'undefined') {
  (window as any).verifySupabaseConnection = verifySupabaseConnection;
}

