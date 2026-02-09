import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResult, PainPoint, BudgetTier } from '../types';

// Storage keys
const STORAGE_KEYS = {
  HAS_SEEN_ONBOARDING: '@clearskin:hasSeenOnboarding',
  HAS_PURCHASED: '@clearskin:hasPurchased',
  USER_PREFS: '@clearskin:userPrefs',
  LAST_ANALYSIS: '@clearskin:lastAnalysis',
  ANALYSIS_HISTORY: '@clearskin:analysisHistory',
} as const;

// Types for local storage
export interface UserPrefs {
  mainConcern: PainPoint | null;
  budget: BudgetTier | null;
}

export interface StoredAnalysis {
  id: string;
  createdAt: string;
  photoUri: string;
  result: AnalysisResult;
}

// Default values
const DEFAULT_PREFS: UserPrefs = {
  mainConcern: null,
  budget: null,
};

// Storage helpers
export const storage = {
  // Onboarding
  async hasSeenOnboarding(): Promise<boolean> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING);
    return value === 'true';
  },

  async setHasSeenOnboarding(value: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, String(value));
  },

  // Purchase status
  async hasPurchased(): Promise<boolean> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_PURCHASED);
    return value === 'true';
  },

  async setHasPurchased(value: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_PURCHASED, String(value));
  },

  // User preferences
  async getUserPrefs(): Promise<UserPrefs> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFS);
    if (!value) return DEFAULT_PREFS;
    try {
      return JSON.parse(value);
    } catch {
      return DEFAULT_PREFS;
    }
  },

  async setUserPrefs(prefs: Partial<UserPrefs>): Promise<void> {
    const current = await storage.getUserPrefs();
    const updated = { ...current, ...prefs };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFS, JSON.stringify(updated));
  },

  // Last analysis
  async getLastAnalysis(): Promise<StoredAnalysis | null> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.LAST_ANALYSIS);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  },

  async setLastAnalysis(analysis: StoredAnalysis): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_ANALYSIS, JSON.stringify(analysis));
    // Also add to history
    await storage.addToHistory(analysis);
  },

  // Analysis history (for v2)
  async getAnalysisHistory(): Promise<StoredAnalysis[]> {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ANALYSIS_HISTORY);
    if (!value) return [];
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  },

  async addToHistory(analysis: StoredAnalysis): Promise<void> {
    const history = await storage.getAnalysisHistory();
    // Keep last 20 analyses
    const updated = [analysis, ...history].slice(0, 20);
    await AsyncStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(updated));
  },

  // Clear all data (for debugging/reset)
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  },

  // Check app state for navigation
  async getAppState(): Promise<{
    hasSeenOnboarding: boolean;
    hasPurchased: boolean;
    userPrefs: UserPrefs;
  }> {
    const [hasSeenOnboarding, hasPurchased, userPrefs] = await Promise.all([
      storage.hasSeenOnboarding(),
      storage.hasPurchased(),
      storage.getUserPrefs(),
    ]);
    return { hasSeenOnboarding, hasPurchased, userPrefs };
  },
};
