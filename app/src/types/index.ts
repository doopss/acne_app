export interface UserProfile {
  id: string;
  created_at: string;
  updated_at: string;
  pain_point: PainPoint | null;
  budget_tier: BudgetTier | null;
  beauty_philosophy: BeautyPhilosophy | null;
  skin_type: SkinType | null;
  is_premium: boolean;
  subscription_ends_at: string | null;
  total_analyses: number;
  last_analysis_at: string | null;
}

export type PainPoint = 
  | 'persistent_breakouts'
  | 'scarring'
  | 'hormonal'
  | 'blackheads'
  | 'oily_skin'
  | 'texture';

export type BudgetTier = 'under_50' | '50_150' | '150_plus' | 'flexible';

export type BeautyPhilosophy = 
  | 'k_beauty'
  | 'western_clinical'
  | 'clean'
  | 'minimalist'
  | 'medical_grade';

export type SkinType = 'oily' | 'dry' | 'combination' | 'sensitive';

export type AcneType = 'inflammatory' | 'comedonal' | 'cystic' | 'mixed';

export type Severity = 'mild' | 'moderate' | 'severe';

export interface Product {
  id: string;
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
  effectiveness_rating: number | null;
}

export interface Analysis {
  id: string;
  user_id: string;
  created_at: string;
  photo_url: string;
  photo_storage_path: string;
  acne_type: AcneType | null;
  severity: Severity | null;
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
}

export interface Recommendation {
  id: string;
  analysis_id: string;
  product_id: string;
  rank: number;
  reasoning: string | null;
  usage_instructions: string | null;
  expected_results: string | null;
  routine_step: number | null;
  time_of_day: string[] | null;
  product?: Product;
}

export interface ProgressTracking {
  id: string;
  user_id: string;
  created_at: string;
  baseline_analysis_id: string | null;
  followup_analysis_id: string | null;
  improvement_percentage: number | null;
  areas_improved: string[] | null;
  areas_worsened: string[] | null;
  progress_summary: string | null;
  recommendations_adjustment: string | null;
}

export interface AnalysisResult {
  acne_type: AcneType;
  severity: Severity;
  distribution: Record<string, number>;
  scores: {
    hydration: number;
    texture: number;
    inflammation: number;
    clarity: number;
    pores: number;
    dark_spots: number;
    overall: number;
  };
  confidence: number;
  recommendations: string[];
  summary: string;
}
