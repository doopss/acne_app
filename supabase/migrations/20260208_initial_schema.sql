-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles (extends auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Onboarding preferences
    pain_point TEXT, -- "persistent_breakouts", "scarring", "hormonal", etc.
    budget_tier TEXT, -- "under_50", "50_150", "150_plus", "flexible"
    beauty_philosophy TEXT, -- "k_beauty", "western_clinical", "clean", "minimalist", "medical_grade"
    skin_type TEXT, -- "oily", "dry", "combination", "sensitive"
    
    -- Subscription
    is_premium BOOLEAN DEFAULT FALSE,
    subscription_ends_at TIMESTAMPTZ,
    
    -- Analytics
    total_analyses INTEGER DEFAULT 0,
    last_analysis_at TIMESTAMPTZ
);

-- Products database
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Product info
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    description TEXT,
    price_usd NUMERIC(10, 2),
    image_url TEXT,
    
    -- Categorization
    product_type TEXT, -- "cleanser", "treatment", "moisturizer", "sunscreen"
    acne_type TEXT[], -- ["inflammatory", "comedonal", "cystic"]
    key_ingredients TEXT[], -- ["salicylic_acid", "benzoyl_peroxide", "niacinamide"]
    
    -- Filters
    budget_tier TEXT, -- "under_50", "50_150", "150_plus"
    beauty_philosophy TEXT[], -- ["k_beauty", "western_clinical"]
    suitable_for_sensitive BOOLEAN DEFAULT FALSE,
    
    -- Purchase links
    amazon_url TEXT,
    sephora_url TEXT,
    ulta_url TEXT,
    yesstyle_url TEXT,
    affiliate_commission NUMERIC(5, 2), -- percentage
    
    -- Ratings
    effectiveness_rating NUMERIC(3, 2), -- 0-5
    user_rating_count INTEGER DEFAULT 0,
    
    -- Search
    tsv tsvector
);

-- Create text search index
CREATE INDEX products_tsv_idx ON products USING GIN(tsv);

-- Update text search trigger
CREATE OR REPLACE FUNCTION products_tsv_trigger() RETURNS trigger AS $$
BEGIN
    NEW.tsv := to_tsvector('english', 
        COALESCE(NEW.name, '') || ' ' || 
        COALESCE(NEW.brand, '') || ' ' || 
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(array_to_string(NEW.key_ingredients, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_tsv_update 
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION products_tsv_trigger();

-- Photo analyses
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Photo
    photo_url TEXT NOT NULL,
    photo_storage_path TEXT NOT NULL,
    
    -- AI Analysis results
    acne_type TEXT, -- "inflammatory", "comedonal", "cystic", "mixed"
    severity TEXT, -- "mild", "moderate", "severe"
    distribution JSONB, -- {"forehead": 20, "cheeks": 15, "chin": 10, "jaw": 5}
    
    -- Detailed scores (0-10 scale)
    hydration_score NUMERIC(3, 1),
    texture_score NUMERIC(3, 1),
    inflammation_score NUMERIC(3, 1),
    clarity_score NUMERIC(3, 1),
    pore_score NUMERIC(3, 1),
    dark_spots_score NUMERIC(3, 1),
    overall_score NUMERIC(4, 1), -- 0-100
    
    -- AI raw response
    ai_response JSONB,
    ai_model TEXT, -- "gemini-2.0-flash", "gpt-4o"
    ai_confidence NUMERIC(3, 2), -- 0-1
    
    -- Recommendations generated
    recommendations_count INTEGER DEFAULT 0,
    
    -- User feedback
    user_rating INTEGER, -- 1-5 stars
    user_feedback TEXT
);

-- Recommendations (links analyses to products)
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Recommendation logic
    rank INTEGER, -- 1, 2, 3 (top recommendations)
    reasoning TEXT, -- Why this product was recommended
    usage_instructions TEXT, -- "Apply morning and night after cleansing"
    expected_results TEXT, -- "Visible improvement in 4-6 weeks"
    
    -- Routine placement
    routine_step INTEGER, -- 1=cleanser, 2=treatment, 3=moisturizer, 4=sunscreen
    time_of_day TEXT[], -- ["morning", "night"]
    
    -- Tracking
    clicked BOOLEAN DEFAULT FALSE,
    clicked_at TIMESTAMPTZ,
    purchased BOOLEAN DEFAULT FALSE,
    purchased_at TIMESTAMPTZ
);

-- User history (what worked/didn't work)
CREATE TABLE user_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Product tracking
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT, -- Store name in case product deleted
    ingredient TEXT, -- Or just track ingredient type
    
    -- Experience
    status TEXT, -- "tried", "working", "not_working", "caused_reaction"
    effectiveness_rating INTEGER, -- 1-5
    notes TEXT,
    
    -- Timeline
    started_at DATE,
    stopped_at DATE,
    duration_days INTEGER
);

-- Progress tracking (for comparing photos over time)
CREATE TABLE progress_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Photo comparison
    baseline_analysis_id UUID REFERENCES analyses(id),
    followup_analysis_id UUID REFERENCES analyses(id),
    
    -- Progress metrics
    improvement_percentage NUMERIC(5, 2), -- -100 to 100 (negative = worse)
    areas_improved TEXT[], -- ["inflammation", "texture"]
    areas_worsened TEXT[], -- ["dark_spots"]
    
    -- AI insights
    progress_summary TEXT,
    recommendations_adjustment TEXT -- "Continue current routine" or "Try adding X"
);

-- Row Level Security (RLS) Policies

-- User profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Analyses
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own analyses" ON analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analyses" ON analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own analyses" ON analyses FOR UPDATE USING (auth.uid() = user_id);

-- Products (public read, admin write)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);

-- Recommendations
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own recommendations" ON recommendations FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM analyses WHERE analyses.id = recommendations.analysis_id AND analyses.user_id = auth.uid()
    ));
CREATE POLICY "Users can update own recommendation tracking" ON recommendations FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM analyses WHERE analyses.id = recommendations.analysis_id AND analyses.user_id = auth.uid()
    ));

-- User history
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own history" ON user_history FOR ALL USING (auth.uid() = user_id);

-- Progress tracking
ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON progress_tracking FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_recommendations_analysis_id ON recommendations(analysis_id);
CREATE INDEX idx_recommendations_product_id ON recommendations(product_id);
CREATE INDEX idx_user_history_user_id ON user_history(user_id);
CREATE INDEX idx_products_budget_tier ON products(budget_tier);
CREATE INDEX idx_products_acne_type ON products USING GIN(acne_type);
CREATE INDEX idx_products_key_ingredients ON products USING GIN(key_ingredients);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_history_updated_at BEFORE UPDATE ON user_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
