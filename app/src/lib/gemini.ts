import { AnalysisResult, AcneType, Severity } from '../types';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const ANALYSIS_PROMPT = `You are an expert dermatologist AI assistant. Analyze this facial skin image for acne and skin health.

Provide a detailed JSON response with the following structure:
{
  "acne_type": "inflammatory" | "comedonal" | "cystic" | "mixed",
  "severity": "mild" | "moderate" | "severe",
  "distribution": {
    "forehead": <percentage 0-100>,
    "cheeks": <percentage 0-100>,
    "chin": <percentage 0-100>,
    "jaw": <percentage 0-100>,
    "nose": <percentage 0-100>
  },
  "scores": {
    "hydration": <score 0-10>,
    "texture": <score 0-10>,
    "inflammation": <score 0-10>,
    "clarity": <score 0-10>,
    "pores": <score 0-10>,
    "dark_spots": <score 0-10>,
    "overall": <score 0-100>
  },
  "confidence": <confidence 0-1>,
  "recommendations": [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3"
  ],
  "summary": "Brief summary of skin condition and key concerns"
}

Scoring guidelines:
- Higher scores are better (less issues)
- 0-2: Very poor (severe issues)
- 3-4: Poor (significant issues)
- 5-6: Fair (moderate issues)
- 7-8: Good (mild issues)
- 9-10: Excellent (minimal to no issues)

For overall score:
- 0-20: Very poor
- 21-40: Poor
- 41-60: Fair
- 61-80: Good
- 81-100: Excellent

Be realistic and helpful. Focus on actionable insights.
ONLY respond with valid JSON, no additional text.`;

export async function analyzeImageWithGemini(base64Image: string): Promise<AnalysisResult> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: ANALYSIS_PROMPT,
          },
          {
            inline_data: {
              mime_type: 'image/jpeg',
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      topK: 32,
      topP: 1,
      maxOutputTokens: 1024,
    },
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract text from response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No response from Gemini');
    }

    // Parse JSON from response (handle markdown code blocks)
    let jsonText = text;
    if (text.includes('```json')) {
      jsonText = text.split('```json')[1].split('```')[0].trim();
    } else if (text.includes('```')) {
      jsonText = text.split('```')[1].split('```')[0].trim();
    }

    const result = JSON.parse(jsonText) as AnalysisResult;
    
    // Validate and sanitize the response
    return validateAnalysisResult(result);
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

function validateAnalysisResult(result: any): AnalysisResult {
  // Validate acne_type
  const validAcneTypes: AcneType[] = ['inflammatory', 'comedonal', 'cystic', 'mixed'];
  const acneType = validAcneTypes.includes(result.acne_type) 
    ? result.acne_type 
    : 'mixed';

  // Validate severity
  const validSeverities: Severity[] = ['mild', 'moderate', 'severe'];
  const severity = validSeverities.includes(result.severity)
    ? result.severity
    : 'moderate';

  // Validate distribution
  const distribution = {
    forehead: clamp(result.distribution?.forehead ?? 0, 0, 100),
    cheeks: clamp(result.distribution?.cheeks ?? 0, 0, 100),
    chin: clamp(result.distribution?.chin ?? 0, 0, 100),
    jaw: clamp(result.distribution?.jaw ?? 0, 0, 100),
    nose: clamp(result.distribution?.nose ?? 0, 0, 100),
  };

  // Validate scores
  const scores = {
    hydration: clamp(result.scores?.hydration ?? 5, 0, 10),
    texture: clamp(result.scores?.texture ?? 5, 0, 10),
    inflammation: clamp(result.scores?.inflammation ?? 5, 0, 10),
    clarity: clamp(result.scores?.clarity ?? 5, 0, 10),
    pores: clamp(result.scores?.pores ?? 5, 0, 10),
    dark_spots: clamp(result.scores?.dark_spots ?? 5, 0, 10),
    overall: clamp(result.scores?.overall ?? 50, 0, 100),
  };

  // Validate confidence
  const confidence = clamp(result.confidence ?? 0.8, 0, 1);

  // Validate recommendations
  const recommendations = Array.isArray(result.recommendations)
    ? result.recommendations.slice(0, 5)
    : ['Consult a dermatologist for personalized advice'];

  // Validate summary
  const summary = typeof result.summary === 'string'
    ? result.summary
    : 'Analysis complete. Please review your scores below.';

  return {
    acne_type: acneType,
    severity,
    distribution,
    scores,
    confidence,
    recommendations,
    summary,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateImprovementPercentage(
  baseline: { overall_score: number },
  followup: { overall_score: number }
): number {
  if (!baseline.overall_score) return 0;
  return ((followup.overall_score - baseline.overall_score) / baseline.overall_score) * 100;
}
