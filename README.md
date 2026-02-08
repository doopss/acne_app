# Clear Skin - AI Acne Analysis App 🌸

A K-beauty inspired skincare app that uses AI to analyze your skin and provide personalized product recommendations.

![Clear Skin App](./docs/preview.png)

## Features

- **AI Skin Analysis** - Take a photo and get instant skin health scores powered by Google Gemini 2.0 Flash
- **Personalized Onboarding** - Capture user preferences (skin type, budget, beauty philosophy)
- **Detailed Scores** - View scores for hydration, texture, inflammation, clarity, pores, and dark spots
- **Product Recommendations** - Get curated product suggestions based on your skin analysis
- **Progress Tracking** - Compare photos over time and see improvement percentages
- **Clean, K-Beauty Aesthetic** - Beautiful, calming UI with soft pink and lavender tones

## Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: Google Gemini 2.0 Flash API
- **Navigation**: React Navigation
- **Styling**: Custom K-beauty inspired theme

## Project Structure

```
acne_app/
├── app/                          # Expo React Native app
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── screens/              # App screens
│   │   ├── navigation/           # Navigation configuration
│   │   ├── lib/                  # Supabase, Gemini API, Auth
│   │   ├── types/                # TypeScript types
│   │   └── styles/               # Theme and styling
│   ├── App.tsx                   # App entry point
│   └── app.json                  # Expo configuration
├── supabase/                     # Supabase configuration
│   └── migrations/               # Database schema
├── .env.example                  # Environment variables template
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (for testing)
- Supabase account
- Google Cloud account (for Gemini API)

### 1. Clone the Repository

```bash
git clone https://github.com/doopss/acne_app.git
cd acne_app
```

### 2. Install Dependencies

```bash
cd app
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration in `supabase/migrations/20260208_initial_schema.sql` via the SQL Editor
3. Create storage buckets:
   - `user-photos` (private)
   - `product-images` (public)
4. Set up storage policies (see migration file comments)

### 4. Get API Keys

**Supabase:**
- Go to Project Settings → API
- Copy the Project URL and `anon` public key

**Google Gemini:**
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create an API key

### 5. Configure Environment

Create `.env` file in the `app/` directory:

```bash
cp ../.env.example .env
```

Edit `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

### 6. Run the App

```bash
# Start Expo development server
npx expo start
```

Scan the QR code with Expo Go app on your phone.

## Testing with Expo Go

1. Install [Expo Go](https://expo.dev/client) on your iOS or Android device
2. Run `npx expo start` in the `app/` directory
3. Scan the QR code with your camera (iOS) or Expo Go app (Android)
4. Create an account and complete onboarding
5. Take a photo or select from gallery to analyze your skin

## Database Schema

The app uses 6 main tables:

- **user_profiles** - User preferences and subscription info
- **products** - Skincare product database
- **analyses** - AI analysis results with scores
- **recommendations** - Product recommendations per analysis
- **user_history** - Track what worked/didn't work
- **progress_tracking** - Compare analyses over time

See `supabase/migrations/20260208_initial_schema.sql` for full schema.

## Key Features Explained

### AI Analysis

The app uses Google Gemini 2.0 Flash to analyze facial skin images. The AI returns:

- Acne type (inflammatory, comedonal, cystic, mixed)
- Severity level (mild, moderate, severe)
- Distribution map (forehead, cheeks, chin, jaw, nose)
- Detailed scores (0-10 scale)
- Overall skin health score (0-100)
- Personalized recommendations

### Product Recommendations

Products are recommended based on:
- User's acne type and severity
- Skin type and sensitivity
- Budget tier preference
- Beauty philosophy (K-beauty, clinical, clean, etc.)

### Progress Tracking

The app tracks improvement over time by:
- Comparing baseline and follow-up analyses
- Calculating improvement percentage
- Showing score changes per category
- Identifying areas that improved or worsened

## Customization

### Adding Products

Products can be added via Supabase dashboard or SQL:

```sql
INSERT INTO products (name, brand, price_usd, product_type, key_ingredients, budget_tier)
VALUES ('Product Name', 'Brand', 29.99, 'treatment', ARRAY['salicylic_acid'], 'under_50');
```

### Changing Theme Colors

Edit `app/src/styles/theme.ts` to customize the color palette.

## Deployment

### Build for App Stores

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Environment Variables for Production

Set environment variables in EAS:

```bash
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "your-url"
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-key"
eas secret:create --name EXPO_PUBLIC_GEMINI_API_KEY --value "your-key"
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Support

For issues or questions, open a GitHub issue or contact the team.

---

Built with 💖 by the Clear Skin team
