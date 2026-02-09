import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../components';
import { colors, spacing, typography, borderRadius, shadows } from '../styles/theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function Onboarding2Screen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Progress dots */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={[styles.progressDot, styles.progressDotActive]} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>

      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📸</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Tips for{'\n'}Best Results</Text>
        <Text style={styles.subtitle}>
          Follow these simple tips for accurate analysis
        </Text>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <Text style={styles.tipIcon}>☀️</Text>
            </View>
            <Text style={styles.tipTitle}>Good Lighting</Text>
            <Text style={styles.tipDescription}>
              Natural daylight works best. Avoid harsh shadows.
            </Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <Text style={styles.tipIcon}>🧼</Text>
            </View>
            <Text style={styles.tipTitle}>Clean Skin</Text>
            <Text style={styles.tipDescription}>
              Remove makeup and skincare products first.
            </Text>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <Text style={styles.tipIcon}>📱</Text>
            </View>
            <Text style={styles.tipTitle}>Front Camera</Text>
            <Text style={styles.tipDescription}>
              Face forward with a neutral expression.
            </Text>
          </View>
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
            onPress={() => navigation.navigate('Onboarding3')}
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
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 48,
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
  tipsContainer: {
    width: '100%',
    gap: spacing.md,
  },
  tipCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  tipIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  tipIcon: {
    fontSize: 28,
  },
  tipTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  tipDescription: {
    ...typography.bodySmall,
    color: colors.gray,
    textAlign: 'center',
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
});
