// K-beauty inspired color palette - soft, clean, elegant
export const colors = {
  // Primary - Soft rose/pink tones
  primary: '#E8A1B0',
  primaryDark: '#D4899A',
  primaryLight: '#F5D0D8',
  
  // Secondary - Gentle lavender
  secondary: '#B8A9C9',
  secondaryDark: '#9E8CB5',
  secondaryLight: '#D4CAE0',
  
  // Accent - Fresh mint/sage
  accent: '#A8D5BA',
  accentDark: '#8BC4A3',
  accentLight: '#C8E6D0',
  
  // Neutrals
  white: '#FFFFFF',
  offWhite: '#FAFAFA',
  cream: '#FDF8F5',
  lightGray: '#F0EDED',
  gray: '#A0A0A0',
  darkGray: '#666666',
  charcoal: '#333333',
  black: '#1A1A1A',
  
  // Semantic
  success: '#7CC47C',
  warning: '#F5C26B',
  error: '#E57373',
  info: '#7BAFD4',
  
  // Background
  background: '#FDFCFB',
  cardBackground: '#FFFFFF',
  inputBackground: '#F8F6F4',
  
  // Score colors
  scoreExcellent: '#7CC47C',
  scoreGood: '#A8D5BA',
  scoreFair: '#F5C26B',
  scorePoor: '#E8A1B0',
  scoreVeryPoor: '#E57373',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const getScoreColor = (score: number): string => {
  if (score >= 8) return colors.scoreExcellent;
  if (score >= 6) return colors.scoreGood;
  if (score >= 4) return colors.scoreFair;
  if (score >= 2) return colors.scorePoor;
  return colors.scoreVeryPoor;
};

export const getOverallScoreColor = (score: number): string => {
  if (score >= 80) return colors.scoreExcellent;
  if (score >= 60) return colors.scoreGood;
  if (score >= 40) return colors.scoreFair;
  if (score >= 20) return colors.scorePoor;
  return colors.scoreVeryPoor;
};
