// Warm, earthy, premium color palette
export const colors = {
  primary: '#9A3412',
  primaryDark: '#7C2D12',
  primaryLight: '#C2410C',
  
  secondary: '#57534E',
  secondaryDark: '#44403C',
  secondaryLight: '#78716C',
  
  accent: '#9A3412',
  accentDark: '#7C2D12',
  accentLight: '#EA580C',
  
  white: '#FFFFFF',
  offWhite: '#FAF9F7',
  cream: '#F5F0EB',
  lightGray: '#E6E1DB',
  gray: '#A8A29E',
  darkGray: '#78716C',
  charcoal: '#292524',
  black: '#1C1917',
  
  background: '#F5F0EB',       // Warm paper/cream
  cardBackground: '#FFFFFF',   // Clean white cards pop
  inputBackground: '#EBE6E0',  // Slightly darker cream
  
  success: '#166534',
  warning: '#A16207',
  error: '#B91C1C',
  info: '#1D4ED8',
  
  scoreExcellent: '#166534',
  scoreGood: '#4D7C0F',
  scoreFair: '#A16207',
  scorePoor: '#C2410C',
  scoreVeryPoor: '#B91C1C',
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
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
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

export const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  if (score >= 20) return 'Needs Attention';
  return 'Critical';
};
