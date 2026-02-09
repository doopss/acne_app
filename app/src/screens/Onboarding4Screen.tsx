import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../components';
import { storage } from '../lib/storage';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/theme';
import { BudgetTier } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const BUDGETS = [
  { value: 'under_50', label: 'Budget-Friendly', price: 'Under $50', emoji: '💰', description: 'Effective basics' },
  { value: '50_150', label: 'Mid-Range', price: '$50 - $150', emoji: '💎', description: 'Quality products' },
  { value: '150_plus', label: 'Premium', price: '$150+', emoji: '✨', description: 'Best of the best' },
  { value: 'flexible', label: 'Flexible', price: 'Any budget', emoji: '🎯', description: 'Show me everything' },
];

export function Onboarding4Screen({ navigation }: Props) {
  const [selected, setSelected] = useState<BudgetTier | null>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    if (selected) {
      await storage.setUserPrefs({ budget: selected });
    }
    await storage.setHasSeenOnboarding(true);
    setLoading(false);
    navigation.navigate('Paywall');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress dots */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={[styles.progressDot, styles.progressDotActive]} />
      </View>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>What's your{'\n'}budget range?</Text>
        <Text style={styles.subtitle}>
          We'll recommend products that fit your budget
        </Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {BUDGETS.map((budget) => (
            <TouchableOpacity
              key={budget.value}
              style={[
                styles.optionCard,
                selected === budget.value && styles.optionCardSelected,
              ]}
              onPress={() => setSelected(budget.value as BudgetTier)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>{budget.emoji}</Text>
              <View style={styles.optionText}>
                <Text style={[
                  styles.optionLabel,
                  selected === budget.value && styles.optionLabelSelected,
                ]}>
                  {budget.label}
                </Text>
                <Text style={styles.optionPrice}>{budget.price}</Text>
              </View>
              {selected === budget.value && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Button
            title="Continue"
            onPress={handleContinue}
            loading={loading}
            style={styles.nextButton}
          />
        </View>
        <TouchableOpacity onPress={handleContinue}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.charcoal,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.darkGray,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  optionsContainer: {
    gap: spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.charcoal,
  },
  optionLabelSelected: {
    color: colors.primaryDark,
  },
  optionPrice: {
    ...typography.bodySmall,
    color: colors.gray,
    marginTop: 2,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
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
  nextButton: {
    flex: 1,
  },
  skipText: {
    ...typography.bodySmall,
    color: colors.gray,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
