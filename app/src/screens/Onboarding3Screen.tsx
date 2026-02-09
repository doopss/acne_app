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
import { PainPoint } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const CONCERNS = [
  { value: 'persistent_breakouts', label: 'Breakouts', emoji: '🔴', description: 'Active pimples & acne' },
  { value: 'scarring', label: 'Acne Scars', emoji: '🩹', description: 'Marks & texture issues' },
  { value: 'oily_skin', label: 'Oily Skin', emoji: '💧', description: 'Excess shine & sebum' },
  { value: 'texture', label: 'Texture', emoji: '🔘', description: 'Rough or bumpy skin' },
  { value: 'blackheads', label: 'Blackheads', emoji: '⚫', description: 'Clogged pores' },
  { value: 'hormonal', label: 'Hormonal', emoji: '🌙', description: 'Chin & jaw breakouts' },
];

export function Onboarding3Screen({ navigation }: Props) {
  const [selected, setSelected] = useState<PainPoint | null>(null);

  const handleNext = async () => {
    if (selected) {
      await storage.setUserPrefs({ mainConcern: selected });
    }
    navigation.navigate('Onboarding4');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress dots */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={[styles.progressDot, styles.progressDotActive]} />
        <View style={styles.progressDot} />
      </View>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>What's your{'\n'}main concern?</Text>
        <Text style={styles.subtitle}>
          We'll focus our analysis on what matters most to you
        </Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {CONCERNS.map((concern) => (
            <TouchableOpacity
              key={concern.value}
              style={[
                styles.optionCard,
                selected === concern.value && styles.optionCardSelected,
              ]}
              onPress={() => setSelected(concern.value as PainPoint)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionEmoji}>{concern.emoji}</Text>
              <View style={styles.optionText}>
                <Text style={[
                  styles.optionLabel,
                  selected === concern.value && styles.optionLabelSelected,
                ]}>
                  {concern.label}
                </Text>
                <Text style={styles.optionDescription}>{concern.description}</Text>
              </View>
              {selected === concern.value && (
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
            title="Next"
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
        <TouchableOpacity onPress={handleNext}>
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
    marginBottom: spacing.lg,
  },
  optionsContainer: {
    gap: spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.sm,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionEmoji: {
    fontSize: 28,
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
  optionDescription: {
    ...typography.bodySmall,
    color: colors.gray,
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
