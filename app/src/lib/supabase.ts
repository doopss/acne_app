import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          pain_point: string | null;
          budget_tier: string | null;
          beauty_philosophy: string | null;
          skin_type: string | null;
          is_premium: boolean;
          subscription_ends_at: string | null;
          total_analyses: number;
          last_analysis_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['user_profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          brand: string;
          description: string | null;
          price_usd: number | null;
          image_url: string | null;
          product_type: string | null;
          acne_type: string[] | null;
          key_ingredients: string[] | null;
          budget_tier: string | null;
          beauty_philosophy: string[] | null;
          suitable_for_sensitive: boolean;
          amazon_url: string | null;
          sephora_url: string | null;
          ulta_url: string | null;
          yesstyle_url: string | null;
          affiliate_commission: number | null;
          effectiveness_rating: number | null;
          user_rating_count: number;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      analyses: {
        Row: {
          id: string;
          user_id: string | null;
          created_at: string;
          photo_url: string;
          photo_storage_path: string;
          acne_type: string | null;
          severity: string | null;
          distribution: Record<string, number> | null;
          hydration_score: number | null;
          texture_score: number | null;
          inflammation_score: number | null;
          clarity_score: number | null;
          pore_score: number | null;
          dark_spots_score: number | null;
          overall_score: number | null;
          ai_response: Record<string, any> | null;
          ai_model: string | null;
          ai_confidence: number | null;
          recommendations_count: number;
          user_rating: number | null;
          user_feedback: string | null;
        };
        Insert: Omit<Database['public']['Tables']['analyses']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['analyses']['Insert']>;
      };
      recommendations: {
        Row: {
          id: string;
          analysis_id: string | null;
          product_id: string | null;
          created_at: string;
          rank: number | null;
          reasoning: string | null;
          usage_instructions: string | null;
          expected_results: string | null;
          routine_step: number | null;
          time_of_day: string[] | null;
          clicked: boolean;
          clicked_at: string | null;
          purchased: boolean;
          purchased_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['recommendations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['recommendations']['Insert']>;
      };
      user_history: {
        Row: {
          id: string;
          user_id: string | null;
          created_at: string;
          updated_at: string;
          product_id: string | null;
          product_name: string | null;
          ingredient: string | null;
          status: string | null;
          effectiveness_rating: number | null;
          notes: string | null;
          started_at: string | null;
          stopped_at: string | null;
          duration_days: number | null;
        };
        Insert: Omit<Database['public']['Tables']['user_history']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['user_history']['Insert']>;
      };
      progress_tracking: {
        Row: {
          id: string;
          user_id: string | null;
          created_at: string;
          baseline_analysis_id: string | null;
          followup_analysis_id: string | null;
          improvement_percentage: number | null;
          areas_improved: string[] | null;
          areas_worsened: string[] | null;
          progress_summary: string | null;
          recommendations_adjustment: string | null;
        };
        Insert: Omit<Database['public']['Tables']['progress_tracking']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['progress_tracking']['Insert']>;
      };
    };
  };
};
