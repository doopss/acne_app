import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button } from '../components';
import { colors, spacing, typography, borderRadius } from '../styles/theme';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function Onboarding1Screen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Progress dots */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, styles.progressDotActive]} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>

      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔬</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>AI-Powered{'\n'}Skin Analysis</Text>
        <Text style={styles.subtitle}>
          Get personalized insights and recommendations in seconds
        </Text>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={[styles.stepIcon, { backgroundColor: colors.primaryLight }]}>
              <Text style={styles.stepEmoji}>📸</Text>
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>Analyze</Text>
              <Text style={styles.stepDescription}>Take a quick selfie</Text>
            </View>
          </View>

          <View style={styles.stepConnector} />

          <View style={styles.step}>
            <View style={[styles.stepIcon, { backgroundColor: colors.accentLight }]}>
              <Text style={styles.stepEmoji}>🎯</Text>
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>Understand</Text>
              <Text style={styles.stepDescription}>Get detailed insights</Text>
            </View>
          </View>

          <View style={styles.stepConnector} />

          <View style={styles.step}>
            <View style={[styles.stepIcon, { backgroundColor: colors.secondaryLight }]}>
              <Text style={styles.stepEmoji}>✨</Text>
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>Treat</Text>
              <Text style={styles.stepDescription}>Follow your routine</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Next"
          onPress={() => navigation.navigate('Onboarding2')}
          size="large"
        />
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
    backgroundColor: colors.primaryLight,
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
  stepsContainer: {
    width: '100%',
    paddingHorizontal: spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  stepEmoji: {
    fontSize: 24,
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.charcoal,
  },
  stepDescription: {
    ...typography.bodySmall,
    color: colors.gray,
  },
  stepConnector: {
    width: 2,
    height: 20,
    backgroundColor: colors.lightGray,
    marginLeft: 39,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
