import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, SelectableOption } from '../components';
import { useAuth } from '../lib/auth';
import { colors, spacing, typography, borderRadius } from '../styles/theme';
import { PainPoint, BudgetTier, BeautyPhilosophy, SkinType } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const STEPS = [
  {
    key: 'welcome',
    title: 'Welcome to Clear Skin',
    subtitle: "Let's personalize your skincare experience",
    emoji: '✨',
  },
  {
    key: 'pain_point',
    title: "What's your main concern?",
    subtitle: 'We\'ll focus on what matters most to you',
    options: [
      { value: 'persistent_breakouts', label: 'Persistent Breakouts', emoji: '😔', description: 'Pimples that keep coming back' },
      { value: 'scarring', label: 'Acne Scarring', emoji: '🩹', description: 'Dark marks and uneven texture' },
      { value: 'hormonal', label: 'Hormonal Acne', emoji: '🌙', description: 'Breakouts around jaw and chin' },
      { value: 'blackheads', label: 'Blackheads & Whiteheads', emoji: '⚫', description: 'Clogged pores and bumps' },
      { value: 'oily_skin', label: 'Oily Skin', emoji: '💧', description: 'Excess shine and greasy feeling' },
      { value: 'texture', label: 'Skin Texture', emoji: '🔘', description: 'Rough, bumpy skin surface' },
    ],
  },
  {
    key: 'skin_type',
    title: "What's your skin type?",
    subtitle: 'This helps us choose products that work for you',
    options: [
      { value: 'oily', label: 'Oily', emoji: '💦', description: 'Shiny all over, especially T-zone' },
      { value: 'dry', label: 'Dry', emoji: '🏜️', description: 'Tight, flaky, or dehydrated' },
      { value: 'combination', label: 'Combination', emoji: '☯️', description: 'Oily T-zone, dry cheeks' },
      { value: 'sensitive', label: 'Sensitive', emoji: '🌸', description: 'Easily irritated or reactive' },
    ],
  },
  {
    key: 'budget_tier',
    title: 'What\'s your budget?',
    subtitle: 'We\'ll recommend products in your range',
    options: [
      { value: 'under_50', label: 'Budget-Friendly', emoji: '💰', description: 'Under $50 for my full routine' },
      { value: '50_150', label: 'Mid-Range', emoji: '💎', description: '$50-150 for quality products' },
      { value: '150_plus', label: 'Premium', emoji: '✨', description: 'Willing to invest $150+' },
      { value: 'flexible', label: 'Flexible', emoji: '🎯', description: 'Show me the best options' },
    ],
  },
  {
    key: 'beauty_philosophy',
    title: 'What\'s your skincare style?',
    subtitle: 'Match products to your preferences',
    options: [
      { value: 'k_beauty', label: 'K-Beauty', emoji: '🇰🇷', description: 'Gentle, multi-step routines' },
      { value: 'western_clinical', label: 'Clinical/Dermatologist', emoji: '🔬', description: 'Science-backed, active ingredients' },
      { value: 'clean', label: 'Clean Beauty', emoji: '🌿', description: 'Natural, non-toxic ingredients' },
      { value: 'minimalist', label: 'Minimalist', emoji: '📦', description: 'Simple, no-fuss routine' },
      { value: 'medical_grade', label: 'Medical Grade', emoji: '⚕️', description: 'Prescription-strength actives' },
    ],
  },
];

export function OnboardingScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const [painPoint, setPainPoint] = useState<PainPoint | null>(null);
  const [skinType, setSkinType] = useState<SkinType | null>(null);
  const [budgetTier, setBudgetTier] = useState<BudgetTier | null>(null);
  const [beautyPhilosophy, setBeautyPhilosophy] = useState<BeautyPhilosophy | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useAuth();

  const currentStep = STEPS[step];
  const isLastStep = step === STEPS.length - 1;
  const isFirstStep = step === 0;

  const getSelectedValue = () => {
    switch (currentStep.key) {
      case 'pain_point': return painPoint;
      case 'skin_type': return skinType;
      case 'budget_tier': return budgetTier;
      case 'beauty_philosophy': return beautyPhilosophy;
      default: return null;
    }
  };

  const setSelectedValue = (value: string) => {
    switch (currentStep.key) {
      case 'pain_point': setPainPoint(value as PainPoint); break;
      case 'skin_type': setSkinType(value as SkinType); break;
      case 'budget_tier': setBudgetTier(value as BudgetTier); break;
      case 'beauty_philosophy': setBeautyPhilosophy(value as BeautyPhilosophy); break;
    }
  };

  const canProceed = () => {
    if (currentStep.key === 'welcome') return true;
    return getSelectedValue() !== null;
  };

  const handleNext = async () => {
    if (isLastStep) {
      // Save profile and navigate to main app
      setLoading(true);
      await updateProfile({
        pain_point: painPoint,
        skin_type: skinType,
        budget_tier: budgetTier,
        beauty_philosophy: beautyPhilosophy,
      });
      setLoading(false);
      // Navigation will happen automatically via auth state
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setStep(step - 1);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    await updateProfile({});
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        {STEPS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index <= step && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {currentStep.emoji && <Text style={styles.emoji}>{currentStep.emoji}</Text>}
          <Text style={styles.title}>{currentStep.title}</Text>
          <Text style={styles.subtitle}>{currentStep.subtitle}</Text>
        </View>

        {currentStep.options && (
          <View style={styles.options}>
            {currentStep.options.map((option) => (
              <SelectableOption
                key={option.value}
                label={option.label}
                description={option.description}
                emoji={option.emoji}
                selected={getSelectedValue() === option.value}
                onPress={() => setSelectedValue(option.value)}
              />
            ))}
          </View>
        )}

        {currentStep.key === 'welcome' && (
          <View style={styles.welcomeContent}>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>📸</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>AI Skin Analysis</Text>
                <Text style={styles.featureDescription}>Get instant insights about your skin</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🧴</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Personalized Products</Text>
                <Text style={styles.featureDescription}>Curated recommendations just for you</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>📈</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Track Progress</Text>
                <Text style={styles.featureDescription}>See your skin improve over time</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          {!isFirstStep ? (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSkip} style={styles.backButton}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </TouchableOpacity>
          )}
          
          <Button
            title={isLastStep ? "Get Started" : "Continue"}
            onPress={handleNext}
            disabled={!canProceed()}
            loading={loading}
            style={styles.nextButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.lightGray,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.charcoal,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
  },
  options: {
    marginBottom: spacing.lg,
  },
  welcomeContent: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.charcoal,
  },
  featureDescription: {
    ...typography.bodySmall,
    color: colors.gray,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    padding: spacing.md,
  },
  backButtonText: {
    ...typography.button,
    color: colors.gray,
  },
  skipButtonText: {
    ...typography.bodySmall,
    color: colors.gray,
  },
  nextButton: {
    flex: 1,
  },
});
